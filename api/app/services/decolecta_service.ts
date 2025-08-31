import fetch from 'node-fetch'
import env from '#start/env'
import LegalEntityPerson from '#models/legal_entity_person'
import LegalEntityCompany from '#models/legal_entity_company'

export default class DecolectaService {
  private baseUrl = 'https://api.decolecta.com/v1'
  private apiKey: string | undefined

  constructor() {
    this.apiKey = env.get('DECOLECTA_API_KEY')
  }

  private async makeRequest(endpoint: string): Promise<any> {
    if (!this.apiKey) {
      throw new Error('DECOLECTA_API_KEY environment variable is required')
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Decolecta API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async searchRUC(rucNumber: string) {
    try {
      const data = await this.makeRequest(`/sunat/ruc?numero=${rucNumber}`)

      // Create or update the company record
      let company = await LegalEntityCompany.query().where('ruc_number', rucNumber).first()

      if (company) {
        // Update existing record
        company.merge(LegalEntityCompany.fromDecolectaResponse(rucNumber, data))
        await company.save()
      } else {
        // Create new record
        company = await LegalEntityCompany.create(
          LegalEntityCompany.fromDecolectaResponse(rucNumber, data)
        )
      }

      // Return legacy format for backward compatibility
      return {
        success: true,
        data: {
          name: company.razon_social || '',
          trade_name: company.nombre_comercial || company.razon_social || '',
          address: company.direccion || '',
          location_id: company.ubigeo || '',
          phone: '', // RUC endpoint doesn't provide phone
        },
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  async searchDNI(dniNumber: string) {
    try {
      const data = await this.makeRequest(`/reniec/dni?numero=${dniNumber}`)

      // Create or update the person record
      let person = await LegalEntityPerson.query().where('dni_number', dniNumber).first()

      if (person) {
        // Update existing record
        person.merge(LegalEntityPerson.fromDecolectaResponse(dniNumber, data))
        await person.save()
      } else {
        // Create new record
        person = await LegalEntityPerson.create(
          LegalEntityPerson.fromDecolectaResponse(dniNumber, data)
        )
      }

      // Return legacy format for backward compatibility
      return {
        success: true,
        data: {
          name:
            person.full_name ||
            `${person.first_last_name || ''} ${person.second_last_name || ''} ${person.first_name || ''}`.trim(),
          trade_name: '',
          address: person.address || '',
          location_id: person.ubigeo || '',
          phone: '',
        },
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }
}
