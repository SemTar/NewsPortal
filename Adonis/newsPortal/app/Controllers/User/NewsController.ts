import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Category from 'App/Models/Category'
import Database from '@ioc:Adonis/Lucid/Database'
import StringValidator from 'App/Validators/MyValidators/StringValidator'
import SearchError from 'App/Errors/SearchError'
import Helpers from 'App/Helpers'
// import { validator, schema } from '@ioc:Adonis/Core/Validator'
// import QueryStringValidator from "App/Validators/String/QueryStringValidator";
// import GetCategory from "App/Models/GetNews/GetCategory";

export default class NewsController {
  public async list(ctx: HttpContextContract) {
    const qs = ctx.request.qs()
    const countOfNewsInPage = StringValidator.asCountOfItemsInPage(qs.countOfNewsInPage, 8)
    const categoryId = Category.categoryIdCheck(ctx)
    const numOfPage = StringValidator.asNaturalNumber(ctx.request.param('numOfPage'), 'parameter')

    // const numOfPage = await validator.validate({
    //   schema: QueryStringValidator,
    //   data: { num: ctx.request.param('numOfPage') },
    // })

    // return await GetCategory.query().preload('news').where('categories.id', categoryId).first()
    const category = await Category.categoryChecker(categoryId)
    const news = await Database.from('news')
      .select('id', 'date', 'image_preview as imagePreview', 'title', 'text_preview as textPreview')
      .where('category_id', '=', categoryId)
      .paginate(numOfPage, countOfNewsInPage)

    let paginated = await Helpers.paginator(news)
    return { category: category.name, lastPage: paginated.lastPage, elemArray: paginated.elemArray }
  }

  public async item(ctx: HttpContextContract) {
    const newsId = StringValidator.asNaturalNumber(ctx.request.param('id'), 'parameter')
    const news = await Database.from('news')
      .select('date', 'image', 'title', 'text', 'name as category')
      .join('categories', 'categories.id', '=', 'news.category_id')
      .where('news.id', newsId)
      .first()
    if (!news) {
      throw new SearchError()
    }
    return news
  }
}
