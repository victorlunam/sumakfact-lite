import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class LegalEntityCompany extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare ruc_number: string

  @column()
  declare razon_social: string

  @column()
  declare nombre_comercial: string

  @column()
  declare tipo_contribuyente: string

  @column()
  declare estado: string

  @column()
  declare condicion: string

  @column()
  declare direccion: string

  @column()
  declare ubigeo: string

  @column()
  declare departamento: string

  @column()
  declare provincia: string

  @column()
  declare distrito: string

  @column()
  declare fecha_inscripcion: string

  @column()
  declare fecha_inicio_actividades: string

  @column()
  declare fecha_baja: string

  @column()
  declare sistema_contabilidad: string

  @column()
  declare actividad_economica: string

  @column()
  declare emisor_electronico: string

  @column()
  declare placa: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Static method to create from Decolecta API response
  static fromDecolectaResponse(rucNumber: string, data: any): Partial<LegalEntityCompany> {
    return {
      ruc_number: rucNumber,
      razon_social: data.razon_social || '',
      nombre_comercial: data.nombre_comercial || '',
      tipo_contribuyente: data.tipo_contribuyente || '',
      estado: data.estado || '',
      condicion: data.condicion || '',
      direccion: data.direccion || '',
      ubigeo: data.ubigeo || '',
      departamento: data.departamento || '',
      provincia: data.provincia || '',
      distrito: data.distrito || '',
      fecha_inscripcion: data.fecha_inscripcion || '',
      fecha_inicio_actividades: data.fecha_inicio_actividades || '',
      fecha_baja: data.fecha_baja || '',
      sistema_contabilidad: data.sistema_contabilidad || '',
      actividad_economica: data.actividad_economica || '',
      emisor_electronico: data.emisor_electronico || '',
      placa: data.placa || '',
    }
  }
}
