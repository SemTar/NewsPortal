import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AccessError from 'App/Errors/AccessError'

export default class MyAuth {
  public async handle({ auth }: HttpContextContract, next: () => Promise<void>) {
    try {
      await auth.use('api').authenticate() //todo возможно стоит написать свою аутентификацию
    } catch (e) {
      throw new AccessError()
    }
    await next()
  }
}
