import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import News from 'App/Models/News'
import StringValidator from 'App/Validators/MyValidators/StringValidator'
import Database from '@ioc:Adonis/Lucid/Database'
import SearchError from 'App/Errors/SearchError'
import CreateNewsValidator from 'App/Validators/CreateNewsValidator'
import Category from 'App/Models/Category'
import UpdateNewsValidator from 'App/Validators/UpdateNewsValidator'
import Helpers from 'App/Helpers'

export default class NewsController {
  public async list(ctx: HttpContextContract) {
    const qs = ctx.request.qs()
    const countOfNewsInPage = StringValidator.asCountOfItemsInPage(qs.countOfNewsInPage, 10)
    const numOfPage = StringValidator.asNaturalNumber(ctx.request.param('numOfPage'), 'parameter')

    const news = Database.from('news')
      .join('categories', 'categories.id', 'news.category_id')
      .select('news.id', 'date', 'title', 'is_published', 'name as category')

    if (qs.id) {
      const newsId = StringValidator.asNaturalNumber(qs.id, 'query string')
      return news.where('id', newsId)
    }

    if (qs.date) {
      const date = StringValidator.asDate(qs.date)
      news.where('date', '>', date.toString()).where('date', '<', date.plus({ day: 1 }).toString())
    }

    if (qs.title) {
      news.where('title', qs.title) //todo сделать запрос с поиском по подстроке
    }

    if (qs.category) {
      news.where('name', qs.category)
    }

    if (qs.isPublished) {
      const isPublished = StringValidator.asBoolean(qs.isPublished)
      news.where('is_published', isPublished)
    }

    return Helpers.paginator(await news.paginate(numOfPage, countOfNewsInPage))
  }

  public async itemSend(ctx: HttpContextContract) {
    const user: any = ctx.auth.user
    const reqBody = await ctx.request.validate(CreateNewsValidator)
    const news = new News()

    news.imagePreview = await Helpers.moveFile('newsPreview', ctx.request.file('imagePreview'))
    news.image = await Helpers.moveFile('news', ctx.request.file('image'))
    news.date = reqBody.date
    news.title = reqBody.title
    news.text = reqBody.text
    news.textPreview = reqBody.textPreview
    news.userId = user.id

    const category = await Category.findOrCreate(reqBody.category)
    news.categoryId = category.id
    await news.save()
    return 'success'
  }

  public async getNews(ctx: HttpContextContract) {
    const newsId = StringValidator.asNaturalNumber(ctx.request.param('id'), 'parameter')
    const news = await Database.from('news')
      .join('categories', 'categories.id', 'news.category_id')
      .select(
        'name as category',
        'date',
        'image_preview',
        'image',
        'title',
        'text_preview',
        'text',
        'is_published'
      )
      .where('news.id', '=', newsId)
      .first()

    if (!news) {
      throw new SearchError()
    }
    return news
  }

  public async putNews(ctx: HttpContextContract) {
    const reqBody = await ctx.request.validate(UpdateNewsValidator)
    const news = await News.newsChecker(reqBody.id)
    const imagePreview = await Helpers.moveFile('newsPreview', ctx.request.file('imagePreview'))
    const image = await Helpers.moveFile('news', ctx.request.file('image'))

    if (reqBody.date) {
      news.date = reqBody.date
    }
    if (imagePreview) {
      news.imagePreview = imagePreview
    }
    if (image) {
      news.image = image
    }
    if (reqBody.title) {
      news.title = reqBody.title
    }
    if (reqBody.textPreview) {
      news.textPreview = reqBody.textPreview
    }
    if (reqBody.text) {
      news.text = reqBody.text
    }
    if (reqBody.isPublished) {
      news.isPublished = reqBody.isPublished
    }

    if (reqBody.category) {
      const category = await Category.findOrCreate(reqBody.category)
      news.categoryId = category.id
    }
    await news.save()
    return 'success'
  }

  public async deleteNews(ctx: HttpContextContract) {
    const newsId = StringValidator.asNaturalNumber(ctx.request.param('id'), 'parameter')
    const news = await News.newsChecker(newsId)
    await news.delete()
    return 'success'
  }
}
