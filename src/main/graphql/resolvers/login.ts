import { adaptResolver } from '@/main/adapters'
import { makeLoginController, makeSignUpController } from '@/main/factories'

export default {
  Query: {
    login: async (_parent: any, args: any) => await adaptResolver(makeLoginController(), args)
  },
  Mutation: {
    signUp: async (_parent: any, args: any) => await adaptResolver(makeSignUpController(), args)
  }
}
