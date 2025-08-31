import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class LegalEntityPerson extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare dni_number: string

  @column()
  declare full_name: string

  @column()
  declare first_name: string

  @column()
  declare first_last_name: string

  @column()
  declare second_last_name: string

  @column()
  declare birth_date: string

  @column()
  declare gender: string

  @column()
  declare civil_status: string

  @column()
  declare address: string

  @column()
  declare ubigeo: string

  @column()
  declare photo_url: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Static method to create from Decolecta API response
  static fromDecolectaResponse(dniNumber: string, data: any): Partial<LegalEntityPerson> {
    return {
      dni_number: dniNumber,
      full_name: data.full_name || '',
      first_name: data.first_name || '',
      first_last_name: data.first_last_name || '',
      second_last_name: data.second_last_name || '',
      birth_date: data.birth_date || '',
      gender: data.gender || '',
      civil_status: data.civil_status || '',
      address: data.address || '',
      ubigeo: data.ubigeo || '',
      photo_url: data.photo_url || '',
    }
  }
}
