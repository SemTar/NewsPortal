import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateUserValidator from 'App/Validators/CreateUserValidator'
import User from 'App/Models/User'
import PasswordRecoveryToken from 'App/Models/PasswordRecoveryToken'
import Env from '@ioc:Adonis/Core/Env'
import LoginUserValidator from 'App/Validators/LoginUserValidator'
import SendTokenValidator from 'App/Validators/SendTokenValidator'
import { v4 as uuid } from 'uuid'
import NewPasswordValidator from 'App/Validators/NewPasswordValidator'
import DataError from 'App/Errors/DataError'
import AccessError from 'App/Errors/AccessError'
import SearchError from 'App/Errors/SearchError'
import Profile from 'App/Models/Profile'
import { connect, JSONCodec } from 'nats'

export default class AuthController {
  public async createUser(ctx: HttpContextContract) {
    const reqBody = await ctx.request.validate(CreateUserValidator)
    const user = await User.create({ email: reqBody.email, password: reqBody.password })
    await Profile.profileChecker(user)
    return 'success'
  }

  public async loginUser(ctx: HttpContextContract) {
    const reqBody = await ctx.request.validate(LoginUserValidator)

    const user = await User.query().where('email', reqBody.email).first()
    if (!user) {
      throw new DataError()
    }

    if (user.isActive === false || user.emailIsConfirmed === false) {
      throw new AccessError()
    }

    return await ctx.auth
      .use('api')
      .attempt(reqBody.email, reqBody.password, { expiresIn: '5 days' })
  }

  public async sendToken(ctx: HttpContextContract) {
    const reqBody = await ctx.request.validate(SendTokenValidator)
    const user = await User.query().where('email', reqBody.email).first()
    if (!user) {
      return 'success'
    }

    const token = uuid()
    console.log(1)
    const connection = await connect()
    const js = connection.jetstream()
    console.log(2)
    const JCodec = JSONCodec()

    await js.publish(
      'mail',
      JCodec.encode({
        email: reqBody.email,
        token: token,
        hostFront: Env.get('URL_FRONT'),
        recPassPathFront: Env.get('RECOVER_PASSWORD_PATH_FRONT'),
      })
    )
    await connection.drain()

    const newToken = new PasswordRecoveryToken()
    newToken.userId = user.id
    newToken.token = token
    await newToken.save()
    return 'success'
  }

  public async accessCheck(ctx: HttpContextContract) {
    const token = ctx.request.param('refreshPasswordToken')

    const user = await User.findTokenUser(token)
    if (!user) {
      throw new SearchError()
    }

    return 'success'
  }

  public async newPassword(ctx: HttpContextContract) {
    const reqBody = await ctx.request.validate(NewPasswordValidator)

    const token = reqBody.refreshPasswordTokens
    const password = reqBody.newPassword

    const user = await User.findTokenUser(token)
    if (!user) {
      throw new DataError()
    }

    user.password = password
    await user.save()

    const tokensArr = await PasswordRecoveryToken.query().where({
      userId: user.id,
      isActive: true,
    })
    if (tokensArr) {
      tokensArr.forEach((elem) => {
        elem.isActive = false
        elem.save()
      })
    }

    return 'success'
  }
}
