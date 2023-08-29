import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'profiles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').unsigned()
      table.integer('user_id').notNullable().unsigned()
      table.foreign('user_id').references('users.id').onDelete('CASCADE').onUpdate('CASCADE')
      table.string('first_name', 100)
      table.string('second_name', 100)
      table.string('phone_number')
      table.timestamp('birthday')
      table.string('city', 100)
      table.string('profile_photo', 100)
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
