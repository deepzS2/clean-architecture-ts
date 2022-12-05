import MockDate from 'mockdate'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

import { mockLoadSurveyByIdRepository } from '@/data/mocks'
import { mockSurveyModel } from '@/domain/mocks'

import { DbLoadSurveyById } from './db-load-survey-by-id'
import { LoadSurveyByIdRepository } from './db-load-survey-by-id-protocols'

interface SutTypes {
  sut: DbLoadSurveyById
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = mockLoadSurveyByIdRepository()
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub)

  return { sut, loadSurveyByIdRepositoryStub }
}

describe('DbLoadSurveyById', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  it('Should call LoadSurveyByIdRepository with correct value', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    const loadAllSpy = vi.spyOn(loadSurveyByIdRepositoryStub, 'loadById')

    await sut.loadById('any_id')
    expect(loadAllSpy).toHaveBeenCalledWith('any_id')
  })

  it('Should return a Survey on success', async () => {
    const { sut } = makeSut()

    const survey = await sut.loadById('any_id')
    expect(survey).toEqual(mockSurveyModel())
  })

  it('Should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    vi.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockRejectedValueOnce(new Error())

    const promise = sut.loadById('any_id')

    await expect(promise).rejects.toThrow()
  })
})
