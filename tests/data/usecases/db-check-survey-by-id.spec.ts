import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DbCheckSurveyById } from '@/data/usecases'
import { faker } from '@faker-js/faker'

import { CheckSurveyByIdRepositorySpy } from '../mocks'

interface SutTypes {
  sut: DbCheckSurveyById
  checkSurveyByIdRepositorySpy: CheckSurveyByIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const checkSurveyByIdRepositorySpy = new CheckSurveyByIdRepositorySpy()
  const sut = new DbCheckSurveyById(checkSurveyByIdRepositorySpy)

  return { sut, checkSurveyByIdRepositorySpy }
}

let surveyId: string

describe('DbCheckSurveyById', () => {
  beforeEach(() => {
    surveyId = faker.datatype.uuid()
  })

  it('Should call CheckSurveyByIdRepository with correct value', async () => {
    const { sut, checkSurveyByIdRepositorySpy } = makeSut()
    await sut.checkById(surveyId)

    expect(checkSurveyByIdRepositorySpy.id).toBe(surveyId)
  })

  it('Should return a Survey on success', async () => {
    const { sut, checkSurveyByIdRepositorySpy } = makeSut()
    const survey = await sut.checkById(surveyId)

    expect(survey).toEqual(checkSurveyByIdRepositorySpy.result)
  })

  it('Should throw if CheckSurveyByIdRepository throws', async () => {
    const { sut, checkSurveyByIdRepositorySpy } = makeSut()
    vi.spyOn(checkSurveyByIdRepositorySpy, 'checkById').mockRejectedValueOnce(new Error())

    const promise = sut.checkById('any_id')

    await expect(promise).rejects.toThrow()
  })
})
