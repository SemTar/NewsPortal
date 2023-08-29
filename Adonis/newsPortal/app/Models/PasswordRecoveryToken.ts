import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column } from "@ioc:Adonis/Lucid/Orm";

export default class PasswordRecoveryToken extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public token: string

  @column()
  public isActive: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime()
  public expiresAt: DateTime

  @beforeSave()
  public static expiresAtCreate(passwordRecoveryToken: PasswordRecoveryToken) {
    passwordRecoveryToken.expiresAt = DateTime.utc().plus({ days: 2 })
  }
}
