import { adaptResolver } from '@/main/adapters'
import { makeLoginController } from '@/main/factories'

export default {
  Query: {
    login: async (_parent: any, args: any) => await adaptResolver(makeLoginController(), args)
  }
}
