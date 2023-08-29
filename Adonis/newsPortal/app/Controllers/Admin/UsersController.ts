import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import StringValidator from 'App/Validators/MyValidators/StringValidator'
import Database from '@ioc:Adonis/Lucid/Database'
import SearchError from 'App/Errors/SearchError'
import CreateUserValidator from 'App/Validators/CreateUserValidator'
import User from 'App/Models/User'
import Profile from 'App/Models/Profile'
import ProfileForAdministrateValidator from 'App/Validators/ProfileForAdministrateValidator'
import Helpers from 'App/Helpers'
import PasswordValidator from 'App/Validators/PasswordValidator'

export default class UsersController {
  public async list(ctx: HttpContextContract) {
    const qs = ctx.request.qs()
    const countOfItemsInPage = StringValidator.asCountOfItemsInPage(qs.countOfItemsInPage, 10)
    const numOfPage = StringValidator.asNaturalNumber(ctx.request.param('numOfPage'), 'parameter')

    const users = Database.from('users')
      .join('profiles', 'users.id', 'profiles.user_id')
      .select(
        'users.id',
        'users.created_at as createdAt',
        'email',
        'first_name as firstName',
        'second_name as secondName',
        'role',
        'is_active as isActive'
      )

    if (qs.id) {
      const userId = StringValidator.asNaturalNumber(qs.id, 'query string')
      return users.where('users.id', userId)
    }

    if (qs.createdAt) {
      const createdAt = StringValidator.asDate(qs.createdAt)
      users
        .where('users.created_at', '>', createdAt.toString())
        .where('users.created_at', '<', createdAt.plus({ day: 1 }).toString())
    }

    if (qs.email) {
      users.where('email', qs.email)
    }

    if (qs.firstName) {
      users.where('first_name', qs.firstName)
    }

    if (qs.secondName) {
      users.where('second_name', qs.secondName)
    }

    if (qs.role) {
      const role = StringValidator.asNaturalNumber(qs.role, 'query string')
      users.where('role', role)
    }

    if (qs.isActive) {
      const isActive = StringValidator.asBoolean(qs.isActive)
      users.where('is_active', isActive)
    }

    return Helpers.paginator(await users.paginate(numOfPage, countOfItemsInPage))
  }

  public async itemSend(ctx: HttpContextContract) {
    const reqBody = await ctx.request.validate(CreateUserValidator)
    const user = await User.create({
      email: reqBody.email,
      password: reqBody.password,
      emailIsConfirmed: true,
    })
    await Profile.profileChecker(user)
    return 'success'
  }

  public async getUser(ctx: HttpContextContract) {
    const id = StringValidator.asNaturalNumber(ctx.request.param('id'), 'parameter')
    const user = await Database.from('users')
      .join('profiles', 'users.id', 'profiles.user_id')
      .select(
        'profile_photo as image',
        'first_name as firstName',
        'second_name as secondName',
        'email',
        'phone_number as phoneNumber',
        'birthday',
        'city',
        'role',
        'is_active as isActive'
      )
      .where('users.id', id)
      .first()

    if (!user) {
      throw new SearchError()
    }

    return user
  }

  public async putUser(ctx: HttpContextContract) {
    const reqBody = await ctx.request.validate(ProfileForAdministrateValidator)
    const user = await User.userChecker(reqBody.id)
    const profile = await Profile.profileChecker(user)
    const imagePath = await Helpers.moveFile('profile', ctx.request.file('image')) //todo create helper

    if (imagePath) {
      profile.profilePhoto = imagePath
    }
    if (reqBody.firstName) {
      profile.firstName = reqBody.firstName
    }
    if (reqBody.secondName) {
      profile.secondName = reqBody.secondName
    }
    if (reqBody.email) {
      user.email = reqBody.email
    }
    if (reqBody.phoneNumber) {
      profile.phoneNumber = reqBody.phoneNumber
    }
    if (reqBody.birthday) {
      profile.birthday = reqBody.birthday
    }
    if (reqBody.city) {
      profile.city = reqBody.city
    }
    if (reqBody.role) {
      user.role = reqBody.role
    }
    if (reqBody.isActive) {
      user.isActive = reqBody.isActive
    }
    await profile.save()
    await user.save()
    return 'success'
  }

  public async deleteUser(ctx: HttpContextContract) {
    const userId = StringValidator.asNaturalNumber(ctx.request.param('id'), 'parameter')
    const user = await User.userChecker(userId)
    await user.delete()
    return 'success'
  }

  public async putUserPassword(ctx: HttpContextContract) {
    const reqBody = await ctx.request.validate(PasswordValidator)
    const user = await User.userChecker(reqBody.id)

    user.password = reqBody.password
    await user.save()
    return 'success'
  }
}
