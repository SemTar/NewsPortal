import MyErrors from 'App/Errors/MyErrors'

export default class DataError extends MyErrors {
  constructor() {
    super()
    this.code = 2
    this.message = 'Invalid data'
  }
}
