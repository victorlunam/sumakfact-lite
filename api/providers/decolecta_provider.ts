import { ApplicationService } from '@adonisjs/core/types'
import DecolectaService from '#services/decolecta_service'

export default class DecolectaProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    this.app.container.bind(DecolectaService, () => {
      return new DecolectaService()
    })
  }

  /**
   * The container bindings have booted
   */
  async boot() {}

  /**
   * The application has been booted
   */
  async start() {}

  /**
   * The process has been started
   */
  async ready() {}

  /**
   * Preparing to shutdown the app
   */
  async shutdown() {}
}
