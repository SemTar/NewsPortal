import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import StringValidator from 'App/Validators/MyValidators/StringValidator'
import Category from 'App/Models/Category'
import CategoryValidator from 'App/Validators/CategoryValidator'
import Helpers from 'App/Helpers'
export default class CategoriesController {
  public async list(ctx: HttpContextContract) {
    const qs = ctx.request.qs()
    const countOfItemsInPage = StringValidator.asCountOfItemsInPage(qs.countOfItemsInPage, 10)
    const numOfPage = StringValidator.asNaturalNumber(ctx.request.param('numOfPage'), 'parameter')

    const categories = Category.query()

    if (qs.id) {
      const id = StringValidator.asNaturalNumber(qs.id, 'query string(id)')
      categories.where('id', id)
    }
    if (qs.name) {
      categories.where('name', qs.name)
    }

    return Helpers.paginator(await categories.paginate(numOfPage, countOfItemsInPage))
  }

  public async postCategory(ctx: HttpContextContract) {
    const reqBody = await ctx.request.validate(CategoryValidator)
    await Category.create({ name: reqBody.category })
    return 'success'
  }

  public async deleteCategory(ctx: HttpContextContract) {
    const categoryId = StringValidator.asNaturalNumber(ctx.request.param('id'), 'parameter')
    const category = await Category.categoryChecker(categoryId)
    await category.delete()
    return 'success'
  }
}
