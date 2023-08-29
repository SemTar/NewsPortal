import ValidationError from 'App/Errors/ValidationError'
import { DateTime } from 'luxon'

export default class StringValidator {
  constructor() {}

  /**
   * it checks string. The string must be a natural number.
   * if true then return parameter converted to type number
   * if false then generate ValidationError with custom description
   * @param string
   * @param place - indicate which type of string you are checking(parameter, query string...).
   * It need for description
   */
  public static asNaturalNumber(string: string, place: string) {
    const checkedString = string.match(/^\d+$/)
    if (!checkedString) {
      throw new ValidationError(`${place} will be a natural number after conversion`)
    }
    const number = Number(checkedString[0])
    if (number === 0) {
      throw new ValidationError(`${place} will be a natural number after conversion`)
    }
    return number
  }

  /**
   * it checks string as date.
   * if it is valid return date(luxon)
   * if it's not valid return validation exception
   * @param string
   */
  public static asDate(string: string) {
    const date = DateTime.fromISO(string)
    if (!date.isValid) {
      throw new ValidationError(date.invalidExplanation)
    }
    return date
  }

  public static asBoolean(st: string) {
    if (st === 'true' || st === '1') {
      return true
    } else if (st === 'false' || st === '0') {
      return false
    }

    throw new ValidationError('wrong boolean format')
  }

  /**
   *  if count exist it returns result of another func
   *  else returns default value
   * @param count - CountOfItemsInPage
   * @param defVel - default value
   */
  public static asCountOfItemsInPage(count, defVel) {
    if (count) {
      return StringValidator.asNaturalNumber(count, 'query string')
    }
    return defVel
  }
}
