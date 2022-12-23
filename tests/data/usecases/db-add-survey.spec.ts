import MockDate from 'mockdate'
import { it, describe, vi, expect, beforeAll, afterAll } from 'vitest'

import { DbAddSurvey } from '@/data/usecases'

import { mockAddSurveyParams } from '../../domain/mocks'
import { AddSurveyRepositorySpy } from '../mocks'

interface SutTypes {
  sut: DbAddSurvey
  addSurveyRepositorySpy: AddSurveyRepositorySpy
}

const makeSut = (): SutTypes => {
  const addSurveyRepositorySpy = new AddSurveyRepositorySpy()
  const sut = new DbAddSurvey(addSurveyRepositorySpy)

  return { sut, addSurveyRepositorySpy }
}

describe('DbAddSurvey UseCase', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositorySpy } = makeSut()
    const surveyData = mockAddSurveyParams()

    await sut.add(surveyData)

    expect(addSurveyRepositorySpy.addSurveyParams).toEqual(surveyData)
  })

  it('Should throws if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositorySpy } = makeSut()
    vi.spyOn(addSurveyRepositorySpy, 'add').mockRejectedValueOnce(new Error())

    const promise = sut.add(mockAddSurveyParams())
    await expect(promise).rejects.toThrow()
  })
})
