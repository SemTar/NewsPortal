import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Comment from 'App/Models/Comment'
import StringValidator from 'App/Validators/MyValidators/StringValidator'
import WithNewsIdValidator from 'App/Validators/Comments/WithNewsIdValidator'
import News from 'App/Models/News'

export default class CommentsController {
  public async getComments(ctx: HttpContextContract) {
    const newsId = StringValidator.asNaturalNumber(ctx.request.qs().newsId, 'query string')

    return Database.from('comments')
      .join('users', 'comments.user_id', '=', 'users.id')
      .join('profiles', 'users.id', '=', 'profiles.user_id')
      .select('comments.text', 'comments.date')
      .select(
        'profiles.first_name as firstName',
        'profiles.second_name as secondName',
        'profiles.profile_photo as profilePhoto'
      )
      .where('news_id', newsId)
  }

  public async postComment(ctx: HttpContextContract) {
    const user: any = ctx.auth.user
    const reqBody = await ctx.request.validate(WithNewsIdValidator)
    const newComment = new Comment()
    await News.newsChecker(reqBody.newsId)

    newComment.userId = user.id
    newComment.text = reqBody.text
    newComment.newsId = Number(reqBody.newsId)
    await newComment.save()

    return 'success'
  }
}
