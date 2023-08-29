import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').unsigned()
      table.string('email', 255).notNullable().unique()
      table.string('password', 255).notNullable()
      table.integer('role').defaultTo(1).notNullable()
      table.boolean('is_active').defaultTo(true).notNullable()
      table.boolean('email_is_confirmed').notNullable().defaultTo(false)
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
