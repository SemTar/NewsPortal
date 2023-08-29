import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import SearchError from 'App/Errors/SearchError'

export default class Comment extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public newsId: number

  @column()
  public userId: number

  @column()
  public text: string

  @column.dateTime({ autoCreate: true })
  public date: DateTime

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  /**
   * finds item by id and check it to existence
   * if item doesn't exist then returns SearchError
   * @param id
   */
  public static async commentChecker(id) {
    const comment = await Comment.query().where('id', id).first()
    if (!comment) {
      throw new SearchError()
    }
    return comment
  }
}
