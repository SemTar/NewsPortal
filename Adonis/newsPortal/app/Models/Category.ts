import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import News from 'App/Models/News'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DataError from 'App/Errors/DataError'
import SearchError from 'App/Errors/SearchError'
import StringValidator from 'App/Validators/MyValidators/StringValidator'

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime

  @hasMany(() => News, { foreignKey: 'categoryId' })
  public news: HasMany<typeof News>

  /**
   * perform search category by id
   * return category or search exception
   * @param id
   */
  public static async categoryChecker(id) {
    const category = await Category.query().where('id', id).first()
    if (!category) {
      throw new SearchError()
    }
    return category
  }

  /**
   * perform search category by name
   * return found category or new category with name from parameter
   * @param name
   */
  public static async findOrCreate(name) {
    const category = await Category.query().where('name', name).first()
    if (category) {
      return category
    } else {
      return await Category.create({ name: name })
    }
  }

  public static categoryIdCheck(ctx: HttpContextContract) {
    const categoryId = ctx.request.qs().categoryId
    if (!categoryId) {
      throw new DataError()
    }

    return StringValidator.asNaturalNumber(categoryId, 'query string')
  }

  public static async getCountNewsInCategory(ctx: HttpContextContract) {
    const categoryId = Category.categoryIdCheck(ctx)
    const category = await Category.query().withCount('news').where('id', categoryId).first()
    if (!category) {
      throw new SearchError()
    }
    return category.$extras['news_count']
  }
}
