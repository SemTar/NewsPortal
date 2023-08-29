import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ProfileValidator from 'App/Validators/ProfileValidator'
import ChangePasswordInProfileValidator from 'App/Validators/ChangePasswordInProfileValidator'
import Hash from '@ioc:Adonis/Core/Hash'
import Profile from 'App/Models/Profile'
import DataError from 'App/Errors/DataError'
import Helpers from 'App/Helpers'

export default class ProfilesController {
  public async header(ctx: HttpContextContract) {
    const user: any = ctx.auth.user

    const profile = await Profile.profileChecker(user)

    return {
      role: user.role,
      image: profile.profilePhoto,
      firstName: profile.firstName,
      secondName: profile.secondName,
    }
  }

  public async getProfileInfo(ctx: HttpContextContract) {
    const user: any = ctx.auth.user

    const profile = await Profile.profileChecker(user)

    return {
      image: profile.profilePhoto,
      firstName: profile.firstName,
      secondName: profile.secondName,
      email: user.email,
      phoneNumber: profile.phoneNumber,
      birthday: profile.birthday,
      city: profile.city,
    }
  }

  public async putProfileInfo(ctx: HttpContextContract) {
    const user: any = ctx.auth.user
    const profile = await Profile.profileChecker(user)
    const reqBody = await ctx.request.validate(ProfileValidator)
    const imagePath = await Helpers.moveFile('profile', ctx.request.file('image'))

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
    profile.save()
    user.save()
    return 'success'
  }

  public async putPassword(ctx: HttpContextContract) {
    const user: any = ctx.auth.user
    const reqBody = await ctx.request.validate(ChangePasswordInProfileValidator)

    if (!(await Hash.verify(user.password, reqBody.oldPassword))) {
      throw new DataError()
    }

    user.password = reqBody.newPassword
    user.save()
    return 'success'
  }
}
