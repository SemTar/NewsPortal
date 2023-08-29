import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Profile from 'App/Models/Profile'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  public async run() {
    await Profile.createMany([
      {
        userId: 1,
        firstName: 'Alex',
        secondName: 'Malex',
        phoneNumber: '9914546556',
        birthday: DateTime.fromISO('1969-02-22'),
        city: 'Moscow',
        profilePhoto: 'photos/1234',
      },
      {
        userId: 2,
        firstName: 'Roman',
        secondName: 'Kim',
        phoneNumber: '9914546556',
        birthday: DateTime.fromISO('1995-05-22'),
        city: 'Moscow',
        profilePhoto: 'photos/345',
      },
      {
        userId: 3,
        firstName: 'Sem',
        secondName: 'Merf',
        phoneNumber: '9914546555',
        birthday: DateTime.fromISO('2000-02-22'),
        city: 'Moscow',
        profilePhoto: 'photos/1234',
      },
      {
        userId: 4,
        firstName: 'Her',
        secondName: 'Malex',
        phoneNumber: '9914546556',
        birthday: DateTime.fromISO('1987-02-22'),
        city: 'Moscow',
        profilePhoto: 'photos/12w34',
      },
      {
        userId: 5,
        firstName: 'Sir',
        secondName: 'Malex',
        phoneNumber: '9914546556',
        birthday: DateTime.fromISO('1997-01-02'),
        city: 'Moscow',
        profilePhoto: 'photos/1234',
      },
      {
        userId: 6,
        firstName: 'Pedro',
        secondName: 'Pendosovich',
        phoneNumber: '8005553535',
        birthday: DateTime.fromISO('1997-02-22'),
        city: 'Moscow',
        profilePhoto: 'photos/228',
      },
    ])
  }
}
