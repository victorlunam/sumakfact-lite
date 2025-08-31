import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'legal_entity_companies'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('ruc_number').notNullable().unique()
      table.string('razon_social')
      table.string('nombre_comercial')
      table.string('tipo_contribuyente')
      table.string('estado')
      table.string('condicion')
      table.string('direccion')
      table.string('ubigeo')
      table.string('departamento')
      table.string('provincia')
      table.string('distrito')
      table.string('fecha_inscripcion')
      table.string('fecha_inicio_actividades')
      table.string('fecha_baja')
      table.string('sistema_contabilidad')
      table.string('actividad_economica')
      table.string('emisor_electronico')
      table.string('placa')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
