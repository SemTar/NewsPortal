import Env from '@ioc:Adonis/Core/Env'
import SearchError from 'App/Errors/SearchError'

export default class Helpers {
  /**
   * move to disc images with unique name
   * if image exist it returns path
   * @param dirName
   * @param image
   */
  public static async moveFile(dirName: string, image: any) {
    if (image) {
      await image.moveToDisk('./' + dirName, {
        name: Date.now().toString() + '.' + image.extname,
      })
      return Env.get('IMAGES_PATH').toString() + dirName + '/' + image.fileName
    }
    return ''
  }

  /**
   * it returns an object with num of last page and elements array
   * an example: { lastPage: 5, newsArray: newsArray }
   * if there are no elements in the array then returns SearchError
   * @param classInctance - object of the class with pagination
   */
  public static async paginator(classInctance) {
    const elemArray = classInctance.toJSON().data
    const objMeta = classInctance.toJSON().meta
    if (elemArray.length === 0) {
      throw new SearchError()
    }
    return { lastPage: objMeta.last_page, elemArray: elemArray }
  }

  public static naturalNumRegExp() {
    return new RegExp('^\\d+$')
  }
}
