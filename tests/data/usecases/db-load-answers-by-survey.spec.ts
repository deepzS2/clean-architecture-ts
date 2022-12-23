import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DbLoadAnswersBySurvey } from '@/data/usecases'
import { faker } from '@faker-js/faker'

import { LoadSurveyByIdRepositorySpy } from '../mocks'

interface SutTypes {
  sut: DbLoadAnswersBySurvey
  loadSurveyByIdRepositorySpy: LoadSurveyByIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositorySpy = new LoadSurveyByIdRepositorySpy()
  const sut = new DbLoadAnswersBySurvey(loadSurveyByIdRepositorySpy)

  return { sut, loadSurveyByIdRepositorySpy }
}

let surveyId: string

describe('DbLoadAnswersBySurvey', () => {
  beforeEach(() => {
    surveyId = faker.datatype.uuid()
  })

  it('Should call LoadSurveyByIdRepository with correct value', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    await sut.loadAnswers(surveyId)

    expect(loadSurveyByIdRepositorySpy.id).toBe(surveyId)
  })

  it('Should return empty array if LoadSurveyByIdRepository returns null', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    loadSurveyByIdRepositorySpy.result = null

    const answers = await sut.loadAnswers(surveyId)

    expect(answers).toEqual([])
  })

  it('Should return answers on success', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    const answers = await sut.loadAnswers(surveyId)

    expect(answers).toEqual(loadSurveyByIdRepositorySpy.result?.answers.map(a => a.answer))
  })

  it('Should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositorySpy } = makeSut()
    vi.spyOn(loadSurveyByIdRepositorySpy, 'loadById').mockRejectedValueOnce(new Error())

    const promise = sut.loadAnswers('any_id')

    await expect(promise).rejects.toThrow()
  })
})
