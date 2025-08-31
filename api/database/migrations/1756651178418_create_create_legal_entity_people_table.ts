import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'legal_entity_people'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('dni_number').notNullable().unique()
      table.string('full_name')
      table.string('first_name')
      table.string('first_last_name')
      table.string('second_last_name')
      table.string('birth_date')
      table.string('gender')
      table.string('civil_status')
      table.string('address')
      table.string('ubigeo')
      table.string('photo_url')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
