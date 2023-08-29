export default class MyErrors extends Error {
  public code: number = 0
  public message: string = ''
  public decryption: object
  constructor() {
    super()
  }
}
