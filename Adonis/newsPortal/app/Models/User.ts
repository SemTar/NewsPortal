import { DateTime } from 'luxon'
import {
  BaseModel,
  column,
  beforeSave,
  hasMany,
  HasMany,
  HasOne,
  hasOne,
} from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import Comment from 'App/Models/Comment'
import News from 'App/Models/News'
import Profile from 'App/Models/Profile'
import AuthToken from 'App/Models/AuthToken'
import PasswordRecoveryToken from 'App/Models/PasswordRecoveryToken'
import SearchError from "App/Errors/SearchError";

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @column()
  public role: number

  @column()
  public isActive: boolean

  @column()
  public emailIsConfirmed: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Comment)
  public comments: HasMany<typeof Comment>

  @hasMany(() => News)
  public news: HasMany<typeof News>

  @hasOne(() => Profile)
  public profile: HasOne<typeof Profile>

  @hasMany(() => AuthToken)
  public authTokens: HasMany<typeof AuthToken>

  @hasMany(() => PasswordRecoveryToken)
  public PasswordRecoveryTokens: HasMany<typeof PasswordRecoveryToken>

  /**
   * it checks user for user id
   * if user exist  returns user otherwise generates SearchError
   * @param userId
   */
  public static async userChecker(userId: number) {
    const user = await User.query().where('id', userId).first()
    if (!user) {
      throw new SearchError()
    }
    return user
  }

  public static async findTokenUser(token) {
    return await User.query()
      .whereHas('PasswordRecoveryTokens', (query) => {
        query
          .where({ token: token, isActive: true })
          .where('expiresAt', '>', DateTime.utc().toString())
      })
      .where('isActive', true)
      .first()
  }
}
