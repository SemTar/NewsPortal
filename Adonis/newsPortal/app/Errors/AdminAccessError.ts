import MyErrors from 'App/Errors/MyErrors'

export default class AdminAccessError extends MyErrors {
  constructor() {
    super()
    this.code = 5
    this.message = 'The client does not have access rights to the content'
  }
}
