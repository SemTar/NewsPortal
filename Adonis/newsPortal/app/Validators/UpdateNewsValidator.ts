import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyReporter } from 'App/Validators/Reporters/MyReporter'

export default class UpdateNewsValidator {
  constructor(protected ctx: HttpContextContract) {}
  public reporter = MyReporter
  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    id: schema.number([rules.exists({ table: 'news', column: 'id' })]),
    category: schema.string.optional({}, [rules.maxLength(100)]),
    date: schema.date.optional(),
    imagePreview: schema.file.optional({
      size: '5mb',
      extnames: ['jpg', 'png'],
    }),
    image: schema.file.optional({
      size: '5mb',
      extnames: ['jpg', 'png'],
    }),
    title: schema.string.optional({}, [rules.maxLength(200)]),
    textPreview: schema.string.optional({}, [rules.maxLength(1000)]),
    text: schema.string.optional(),
    isPublished: schema.boolean.optional(),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {}
}
