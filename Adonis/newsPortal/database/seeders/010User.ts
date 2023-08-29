import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class extends BaseSeeder {
  public async run() {
    await User.createMany([
      {
        email: 'virk@adonisjs.com',
        password: 'secret',
        isActive: false,
        emailIsConfirmed: true,
      },
      {
        email: 'romain@adonisjs.com',
        password: 'supersecret',
        isActive: true,
        emailIsConfirmed: true,
      },
      {
        email: 'Sem@adonisjs.com',
        password: '9980',
        isActive: true,
        emailIsConfirmed: true,
      },
      {
        email: 'Her@adonisjs.com',
        password: '12345678',
        isActive: true,
      },
      {
        email: 'Sir@adonisjs.com',
        password: 'qwerty',
        isActive: true,
        emailIsConfirmed: true,
      },
      {
        email: 'Pedro@adonisjs.com',
        password: '1234qwerty',
        isActive: true,
        emailIsConfirmed: true,
        role: 10,
      },
    ])
  }
}
