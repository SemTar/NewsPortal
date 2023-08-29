import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import AuthToken from 'App/Models/AuthToken'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  public async run() {
    await AuthToken.createMany([
      {
        name: 'Opaque Access Token',
        type: 'api',
        token: 'a966ad3660ad9b1ed89d2fe60f59339627cdd2b49810fdae85fe3684729d5766',
        expiresAt: DateTime.utc().plus({ days: 100 }),
        userId: 6,
      },
      {
        name: 'Opaque Access Token',
        type: 'api',
        token: 'a049fdee66a3140bcd19a190e9f1fede8e9419e6c13ab3e439d18e367bed1227',
        expiresAt: DateTime.utc().plus({ days: 100 }),
        userId: 5,
      },
    ])
    // Write your database queries inside the run method
  }
}
