import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Comment from 'App/Models/Comment'

export default class extends BaseSeeder {
  public async run() {
    await Comment.createMany([
      {
        newsId: 1,
        userId: 4,
        text: 'this news is shit',
      },
      {
        newsId: 1,
        userId: 4,
        text: 'and im too',
      },
      {
        newsId: 1,
        userId: 5,
        text: 'yes it is',
      },
      {
        newsId: 2,
        userId: 6,
        text: 'awesome news',
      },
      {
        newsId: 3,
        userId: 6,
        text: 'awesome news',
      },
    ])
  }
}
