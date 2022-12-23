import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DbLoadAnswersBySurvey } from '@/data/usecases'
import { faker } from '@faker-js/faker'

import { LoadAnswersBySurveyRepositorySpy } from '../mocks'

interface SutTypes {
  sut: DbLoadAnswersBySurvey
  loadAnswersBySurveyRepositorySpy: LoadAnswersBySurveyRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadAnswersBySurveyRepositorySpy = new LoadAnswersBySurveyRepositorySpy()
  const sut = new DbLoadAnswersBySurvey(loadAnswersBySurveyRepositorySpy)

  return { sut, loadAnswersBySurveyRepositorySpy }
}

let surveyId: string

describe('DbLoadAnswersBySurvey', () => {
  beforeEach(() => {
    surveyId = faker.datatype.uuid()
  })

  it('Should call LoadAnswersBySurveyRepository with correct value', async () => {
    const { sut, loadAnswersBySurveyRepositorySpy } = makeSut()
    await sut.loadAnswers(surveyId)

    expect(loadAnswersBySurveyRepositorySpy.id).toBe(surveyId)
  })

  it('Should return empty array if LoadAnswersBySurveyRepository returns null', async () => {
    const { sut, loadAnswersBySurveyRepositorySpy } = makeSut()
    loadAnswersBySurveyRepositorySpy.result = []

    const answers = await sut.loadAnswers(surveyId)

    expect(answers).toEqual([])
  })

  it('Should return answers on success', async () => {
    const { sut, loadAnswersBySurveyRepositorySpy } = makeSut()
    const answers = await sut.loadAnswers(surveyId)

    expect(answers).toEqual(loadAnswersBySurveyRepositorySpy.result)
  })

  it('Should throw if LoadAnswersBySurveyRepository throws', async () => {
    const { sut, loadAnswersBySurveyRepositorySpy } = makeSut()
    vi.spyOn(loadAnswersBySurveyRepositorySpy, 'loadAnswers').mockRejectedValueOnce(new Error())

    const promise = sut.loadAnswers('any_id')

    await expect(promise).rejects.toThrow()
  })
})
