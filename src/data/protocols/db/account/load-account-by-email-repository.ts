export interface LoadAccountByEmailRepository {
  loadByEmail: (email: string) => Promise<LoadAccountByEmailRepository.Result>
}

export namespace LoadAccountByEmailRepository {
  interface ResultModel {
    id: string
    name: string
    password: string
  }

  export type Result = ResultModel | null
}
