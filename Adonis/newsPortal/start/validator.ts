import { validator } from '@ioc:Adonis/Core/Validator'

validator.rule('naturalNumber', (value, _) => {
  // if (typeof value !== 'number') {
  //   return
  // }

  if (value === 1) {
    return
  }
})
/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/
