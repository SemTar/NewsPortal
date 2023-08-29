import MyErrors from 'App/Errors/MyErrors'

export default class ValidationError extends MyErrors {
  constructor(decryption) {
    super()
    this.code = 1
    this.message = 'Validation error'
    this.decryption = decryption
  }
}
