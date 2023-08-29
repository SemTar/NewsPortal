import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import StringValidator from 'App/Validators/MyValidators/StringValidator'
import Database from '@ioc:Adonis/Lucid/Database'
import SearchError from 'App/Errors/SearchError'
import Comment from 'App/Models/Comment'
import TextValidator from 'App/Validators/TextValidator'
import Helpers from 'App/Helpers'

export default class CommentsController {
  public async list(ctx: HttpContextContract) {
    const qs = ctx.request.qs()
    const countOfNewsInPage = StringValidator.asCountOfItemsInPage(qs.countOfNewsInPage, 10)
    const numOfPage = StringValidator.asNaturalNumber(ctx.request.param('numOfPage'), 'parameter')

    const comments = Database.from('comments')
      .join('users', 'users.id', 'comments.user_id')
      .join('news', 'news.id', 'comments.news_id')
      .select(
        'comments.id as id',
        'comments.date as date',
        'comments.user_id as userId',
        'email as userEmail',
        'title as newsTitle',
        'comments.text as text'
      )

    if (qs.id) {
      const commentId = StringValidator.asNaturalNumber(qs.id, 'query string')
      return comments.where('comments.id', commentId)
    }
    if (qs.date) {
      const date = StringValidator.asDate(qs.date)
      comments
        .where('comments.date', '>', date.toString())
        .where('comments.date', '<', date.plus({ day: 1 }).toString())
    }
    if (qs.userId) {
      const id = StringValidator.asNaturalNumber(qs.userId, 'query string(id)')
      comments.where('comments.user_id', id)
    }
    if (qs.userEmail) {
      comments.where('email', qs.userEmail)
    }
    if (qs.newsTitle) {
      comments.where('title', qs.newsTitle) //todo сделать запрос с поиском по подстроке
    }
    if (qs.text) {
      comments.where('comments.text', qs.text)
    }

    return Helpers.paginator(await comments.paginate(numOfPage, countOfNewsInPage))
  }

  public async getComment(ctx: HttpContextContract) {
    const commentId = StringValidator.asNaturalNumber(ctx.request.param('id'), 'parameter')
    const comment = await Database.from('comments')
      .join('users', 'users.id', 'comments.user_id')
      .join('news', 'news.id', 'comments.news_id')
      .select(
        'comments.id',
        'comments.date',
        'comments.user_id as userId',
        'users.email',
        'news_id as newsId',
        'title as newsTitle',
        'comments.text'
      )
      .where('comments.id', commentId)
      .first()

    if (!comment) {
      throw new SearchError()
    }
    return comment
  }

  public async putComment(ctx: HttpContextContract) {
    const reqBody = await ctx.request.validate(TextValidator)
    const comment = await Comment.commentChecker(reqBody.id)

    if (reqBody.text) {
      comment.text = reqBody.text
      await comment.save()
    }
    return 'success'
  }

  public async deleteComment(ctx: HttpContextContract) {
    const commentId = StringValidator.asNaturalNumber(ctx.request.param('id'), 'parameter')
    const comment = await Comment.commentChecker(commentId)
    await comment.delete()
    return 'success'
  }
}
