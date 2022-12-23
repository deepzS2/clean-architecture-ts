import { HttpResponse } from './http'

export interface Controller<T = any> {
  handle: (httpRequest: T) => Promise<HttpResponse>
}
