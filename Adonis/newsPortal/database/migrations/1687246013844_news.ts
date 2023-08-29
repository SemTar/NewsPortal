import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'news'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').unsigned()
      table.integer('user_id').unsigned()
      table.foreign('user_id').references('users.id').onDelete('SET NULL').onUpdate('CASCADE')
      table.integer('category_id').unsigned()
      table
        .foreign('category_id')
        .references('categories.id')
        .onDelete('SET NULL')
        .onUpdate('CASCADE')
      table.string('title', 200)
      table.timestamp('date')
      table.boolean('is_published').defaultTo(false).notNullable()
      table.string('image', 100)
      table.string('image_preview', 100)
      table.text('text')
      table.string('text_preview', 1000)
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
