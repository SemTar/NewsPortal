import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'password_recovery_tokens'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').unsigned()
      table.integer('user_id').notNullable().unsigned()
      table.foreign('user_id').references('users.id').onDelete('CASCADE').onUpdate('CASCADE')
      table.string('token', 200).notNullable().unique()
      table.boolean('is_active').defaultTo(true).notNullable()
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('expires_at', { useTz: true }).nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
