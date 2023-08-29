import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { MyReporter } from 'App/Validators/Reporters/MyReporter'

export default class ProfileForAdministrateValidator {
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
    id: schema.number([rules.exists({ table: 'users', column: 'id' })]),
    image: schema.file.optional({
      size: '5mb',
      extnames: ['jpg', 'png'],
    }),
    firstName: schema.string.optional({}, [rules.maxLength(100)]),
    secondName: schema.string.optional({}, [rules.maxLength(100)]),
    email: schema.string.optional({}, [
      rules.email(),
      rules.unique({ table: 'users', column: 'email' }),
      rules.maxLength(255),
    ]),
    phoneNumber: schema.string.optional({}, [
      rules.mobile({
        locale: ['ru-RU'],
      }),
    ]),
    birthday: schema.date.optional(),
    city: schema.string.optional({}, [rules.maxLength(100)]),
    role: schema.number.optional(),
    isActive: schema.boolean.optional(),
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
