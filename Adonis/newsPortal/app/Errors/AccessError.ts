import MyErrors from 'App/Errors/MyErrors'

export default class AccessError extends MyErrors {
  constructor() {
    super()
    this.code = 3
    this.message =
      'the client request has not been completed because ' +
      'it lacks valid authentication credentials for the requested resource'
  }
}
