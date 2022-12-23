export interface Authentication {
  auth: (authenticationParams: Authentication.Params) => Promise<Authentication.Result>
}

export namespace Authentication {
  export interface Params {
    email: string
    password: string
  }

  interface ResultModel {
    accessToken: string
    name: string
  }

  export type Result = ResultModel | null
}
