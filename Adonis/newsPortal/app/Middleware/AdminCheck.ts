import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AdminAccessError from 'App/Errors/AdminAccessError'

export default class AdminCheck {
  public async handle({ auth }: HttpContextContract, next: () => Promise<void>) {
    const userAuth: any = auth.user
    if (userAuth.role !== 10) {
      throw new AdminAccessError()
    }
    await next()
  }
}
