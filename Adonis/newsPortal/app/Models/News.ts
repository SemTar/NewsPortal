import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Comment from 'App/Models/Comment'
import SearchError from 'App/Errors/SearchError'

export default class News extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public categoryId: number

  @column()
  public title: string

  @column.dateTime({ autoCreate: true })
  public date: DateTime

  @column()
  public isPublished: boolean

  @column()
  public image: string

  @column()
  public imagePreview: string

  @column()
  public text: string

  @column()
  public textPreview: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Comment, { foreignKey: 'newsId' })
  public comments: HasMany<typeof Comment>

  /**
   * finds item by id and check it to existence
   * if item doesn't exist then returns SearchError
   * @param id
   */
  public static async newsChecker(id: number) {
    const news = await News.query().where('id', id).first()
    if (!news) {
      throw new SearchError()
    }
    return news
  }
}
