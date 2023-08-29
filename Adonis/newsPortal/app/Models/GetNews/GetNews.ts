import { column } from '@ioc:Adonis/Lucid/Orm'
import News from 'App/Models/News'
import { DateTime } from 'luxon'

export default class GetNews extends News {
  constructor() {
    super()
  }
  public static table = 'news'

  @column({ serializeAs: null })
  public userId: number

  @column({ serializeAs: null })
  public categoryId: number

  @column({ serializeAs: null })
  public isPublished: boolean

  @column({ serializeAs: null })
  public image: string

  @column({ serializeAs: null })
  public text: string

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime
}
