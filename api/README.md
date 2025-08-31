# Sumakfact Lite API

## Setup

### Environment Variables

The application uses AdonisJS's built-in environment variable validation. Create a `.env` file in the root directory with the following variables:

```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=
DB_DATABASE=sumakfact_lite

# App
APP_KEY=your_app_key_here
HOST=0.0.0.0
PORT=3333
NODE_ENV=development
LOG_LEVEL=info

# Auth
SESSION_DRIVER=cookie

# CORS
CORS_ENABLED=true
CORS_ORIGIN=true

# Decolecta API (optional for development/testing)
DECOLECTA_API_KEY=your_decolecta_api_key_here
```

**Note**: The `DECOLECTA_API_KEY` is optional for development and testing (migrations, etc.) but required for actual API usage.

### Decolecta API Key

To use the Decolecta service, you need to:

1. Register at [https://decolecta.com/profile](https://decolecta.com/profile)
2. Generate an API key
3. Add the key to your `.env` file as `DECOLECTA_API_KEY`

## Database Models

### LegalEntityPerson
Stores person information from RENIEC DNI searches:
- `dni_number` - Unique DNI identifier
- `full_name`, `first_name`, `first_last_name`, `second_last_name`
- `birth_date`, `gender`, `civil_status`
- `address`, `ubigeo`, `photo_url`
- Timestamps: `created_at`, `updated_at`

### LegalEntityCompany
Stores company information from SUNAT RUC searches:
- `ruc_number` - Unique RUC identifier
- `razon_social`, `nombre_comercial`
- `tipo_contribuyente`, `estado`, `condicion`
- `direccion`, `ubigeo`, `departamento`, `provincia`, `distrito`
- `fecha_inscripcion`, `fecha_inicio_actividades`, `fecha_baja`
- `sistema_contabilidad`, `actividad_economica`
- `emisor_electronico`, `placa`
- Timestamps: `created_at`, `updated_at`

## API Endpoints

### Search Person (DNI)
- **GET** `/api/dni/:number`
- Searches for person information using DNI number
- Creates/updates database record with full RENIEC data
- Returns standardized legacy format response

### Search Company (RUC)
- **GET** `/api/ruc/:number`
- Searches for company information using RUC number
- Creates/updates database record with full SUNAT data
- Returns standardized legacy format response

## Response Format

All endpoints return data in the following format:

```json
{
  "success": true,
  "data": {
    "name": "string",
    "trade_name": "string",
    "address": "string",
    "location_id": "string",
    "phone": "string"
  }
}
```

## Database Setup

### Run Migrations
```bash
# Create the database tables
node ace migration:run

# Rollback if needed
node ace migration:rollback
```

### Database Schema
The application automatically creates the necessary tables for storing legal entity data from Decolecta API responses.

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test
```

## Environment Variable Validation

The application validates all required environment variables at startup using AdonisJS's built-in validation system. If any required variables are missing or invalid, the application will fail to start with a clear error message.

Required variables are defined in `start/env.ts` and include:
- `APP_KEY` - Must be a non-empty string
- `HOST` - Must be a valid host format
- `PORT` - Must be a valid number
- Database configuration variables

Optional variables:
- `DECOLECTA_API_KEY` - Required only for API usage, not for development tasks
