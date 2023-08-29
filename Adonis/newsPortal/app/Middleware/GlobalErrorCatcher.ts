import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DataError from 'App/Errors/DataError'

export default class GlobalErrorCatcher {
  public async handle({ response }: HttpContextContract, next: () => Promise<void>) {
    try {
      await next()
    } catch (e) {
      const code = e.code

      if (e.guard === 'api') {
        try {
          throw new DataError()
        } catch (dataError) {
          return response.badRequest(dataError) //todo переделать?
        }
      }

      if (code === 1) {
        return response.badRequest(e) // catch custom validation error
      }

      if (code === 2) {
        return response.badRequest(e) // invalid data
      }

      if (code === 3) {
        return response.unauthorized(e)
      }

      if (code === 4) {
        return response.notFound(e)
      }

      if (code === 5) {
        return response.forbidden(e)
      }

      console.log(e)
      return response.status(500).send('Unknown Error')
    }
  }
}
