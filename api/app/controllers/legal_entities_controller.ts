import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import DecolectaService from '#services/decolecta_service'
import LegalEntityPerson from '#models/legal_entity_person'
import LegalEntityCompany from '#models/legal_entity_company'

@inject()
export default class LegalEntitiesController {
  constructor(private decolecta: DecolectaService) {}

  /**
   * Health check endpoint to verify database connectivity
   */
  async health({ response }: HttpContext) {
    try {
      // Test database connection with a simple query
      await LegalEntityPerson.query().limit(1)

      return response.json({
        success: true,
        message: 'Database connection is healthy',
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Database health check failed:', error)
      return response.status(503).json({
        success: false,
        error: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  /**
   * Retry mechanism for Decolecta service calls
   */
  private async retryServiceCall<T>(
    serviceCall: () => Promise<T>,
    maxRetries: number = 2
  ): Promise<T> {
    let lastError: Error | null = null

    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
      try {
        return await serviceCall()
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error')

        if (attempt <= maxRetries) {
          console.log(
            `Decolecta service call failed (attempt ${attempt}/${maxRetries + 1}), retrying...`
          )
          // Wait before retry (exponential backoff: 1s, 2s)
          await new Promise((resolve) => setTimeout(resolve, attempt * 1000))
        }
      }
    }

    throw lastError || new Error('Service call failed after all retry attempts')
  }

  /**
   * Search for a person by DNI number using legacy endpoint
   * First checks local database, then calls external service if needed
   */
  async search_legacy_person({ params, response }: HttpContext) {
    const { number } = params

    try {
      // 1. Check if person exists in our database
      let person = await LegalEntityPerson.query().where('dni_number', number).first()

      if (!person) {
        // 2. If not found, call external service with retry and save to database
        const result = await this.retryServiceCall(() => this.decolecta.searchDNI(number))

        if (!result.success) {
          return response.status(400).json(result)
        }

        // Retrieve the newly created/updated record
        person = await LegalEntityPerson.query().where('dni_number', number).first()

        if (!person) {
          return response.status(500).json({
            success: false,
            error: 'Failed to retrieve person record after creation',
          })
        }
      }

      // 3. Return our database record in legacy format
      return response.json({
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
      })
    } catch (error) {
      console.error('Error in search_legacy_person:', error)
      return response.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      })
    }
  }

  /**
   * Search for a company by RUC number using legacy endpoint
   * First checks local database, then calls external service if needed
   */
  async search_legacy_company({ params, response }: HttpContext) {
    const { number } = params

    try {
      // 1. Check if company exists in our database
      let company = await LegalEntityCompany.query().where('ruc_number', number).first()

      if (!company) {
        // 2. If not found, call external service with retry and save to database
        const result = await this.retryServiceCall(() => this.decolecta.searchRUC(number))

        if (!result.success) {
          return response.status(400).json(result)
        }

        // Retrieve the newly created/updated record
        company = await LegalEntityCompany.query().where('ruc_number', number).first()

        if (!company) {
          return response.status(500).json({
            success: false,
            error: 'Failed to retrieve company record after creation',
          })
        }
      }

      // 3. Return our database record in legacy format
      return response.json({
        success: true,
        data: {
          name: company.razon_social || '',
          trade_name: company.nombre_comercial || company.razon_social || '',
          address: company.direccion || '',
          location_id: company.ubigeo || '',
          phone: '', // RUC endpoint doesn't provide phone
        },
      })
    } catch (error) {
      console.error('Error in search_legacy_company:', error)
      return response.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      })
    }
  }
}
