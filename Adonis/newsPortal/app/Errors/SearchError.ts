import MyErrors from 'App/Errors/MyErrors'

export default class SearchError extends MyErrors {
  constructor() {
    super()
    this.code = 4
    this.message = 'The specified resource was not found'
  }
}
