import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'

export default class Profile extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public firstName: string

  @column()
  public secondName: string

  @column()
  public phoneNumber: string

  @column()
  public birthday: DateTime

  @column()
  public city: string

  @column()
  public profilePhoto: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  public static async createProfile(userId) {
    let profile = new Profile()
    profile.userId = userId
    return await profile.save()
  }

  public static async profileChecker(user: User) {
    let profile = await user.related('profile').query().first()
    if (!profile) {
      return await Profile.createProfile(user.id)
      // return await Profile.query().where('userId', user.id).first()
    }
    return profile
  }
}
