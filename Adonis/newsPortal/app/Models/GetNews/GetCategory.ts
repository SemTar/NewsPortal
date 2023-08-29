import { column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Category from 'App/Models/Category'
import GetNews from 'App/Models/GetNews/GetNews'

export default class GetCategory extends Category {
  constructor() {
    super()
  }

  public static table = 'categories'

  @column({ isPrimary: true, serializeAs: null })
  public id: number

  @hasMany(() => GetNews, { foreignKey: 'categoryId' })
  public news: HasMany<typeof GetNews>
}
