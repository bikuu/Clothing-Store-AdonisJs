import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('email', 254).notNullable().unique()
      table.string('first_name', 80).notNullable()
      table.string('last_name', 80).notNullable()
      table.enu('role', ['consumer', 'maker']).defaultTo('consumer')
      table.string('password', 60).notNullable()
      table.string('address')
      table.integer('phone')
      table.date('dob')
      table.string('imageProfile')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
