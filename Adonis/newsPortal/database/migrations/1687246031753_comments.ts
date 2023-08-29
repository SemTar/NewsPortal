import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'comments'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').unsigned()
      table.integer('news_id').notNullable().unsigned()
      table.foreign('news_id').references('news.id').onDelete('CASCADE').onUpdate('CASCADE')
      table.integer('user_id').unsigned()
      table.foreign('user_id').references('users.id').onDelete('SET NULL').onUpdate('CASCADE')
      table.text('text')
      table.timestamp('date')
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
