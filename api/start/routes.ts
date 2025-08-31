/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// Health check endpoint
router.get('/api/health', '#controllers/legal_entities_controller.health')

// Legal entities legacy endpoints
router.get('/api/dni/:number', '#controllers/legal_entities_controller.search_legacy_person')
router.get('/api/ruc/:number', '#controllers/legal_entities_controller.search_legacy_company')
