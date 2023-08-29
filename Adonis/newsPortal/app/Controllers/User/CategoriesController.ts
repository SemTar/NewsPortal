import Category from 'App/Models/Category'

export default class CategoriesController {
  public async list() {
    const categories = await Category.all()
    return categories.map((elem) => elem.serialize())
  }
}
