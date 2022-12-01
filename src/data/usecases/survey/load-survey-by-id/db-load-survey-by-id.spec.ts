import MockDate from 'mockdate'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

import { DbLoadSurveyById } from './db-load-survey-by-id'
import { LoadSurveyByIdRepository, SurveyModel } from './db-load-survey-by-id-protocols'

interface SutTypes {
  sut: DbLoadSurveyById
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeFakeSurvey = (): SurveyModel => ({
  id: 'any_id',
  question: 'any_question',
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }],
  date: new Date()
})

const makeLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById (id: string): Promise<SurveyModel> {
      return await Promise.resolve(makeFakeSurvey())
    }
  }

  return new LoadSurveyByIdRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadSurveyByIdRepositoryStub = makeLoadSurveyByIdRepository()
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
    expect(survey).toEqual(makeFakeSurvey())
  })

  it('Should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    vi.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockReturnValueOnce(Promise.reject(new Error()))

    const promise = sut.loadById('any_id')

    await expect(promise).rejects.toThrow()
  })
})
