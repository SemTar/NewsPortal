import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import News from 'App/Models/News'

export default class extends BaseSeeder {
  public async run() {
    await News.createMany([
      {
        userId: 1,
        categoryId: 1,
        title: 'this is awesome news',
        isPublished: true,
        image: 'image/awesome',
        imagePreview: 'imagePreview/awesome',
        text: 'some text',
        textPreview: 'some textPreview',
      },
      {
        userId: 1,
        categoryId: 3,
        title: 'this is awesome news222',
        isPublished: true,
        image: 'image/awesome',
        imagePreview: 'imagePreview/awesome',
        text: 'some text',
        textPreview: 'some textPreview',
      },
      {
        userId: 2,
        categoryId: 3,
        title: 'this is awesome news333',
        isPublished: true,
        image: 'image/awesome',
        imagePreview: 'imagePreview/awesome',
        text: 'some text',
        textPreview: 'some textPreview',
      },
      {
        userId: 3,
        categoryId: 3,
        title: 'this is awesome news444',
        isPublished: true,
        image: 'image/awesome',
        imagePreview: 'imagePreview/awesome',
        text: 'some text',
        textPreview: 'some textPreview',
      },
    ])
  }
}
