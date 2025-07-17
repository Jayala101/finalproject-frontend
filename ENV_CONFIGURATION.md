# Environment Configuration

This document explains how to configure the environment variables for this project.

## Available Environment Files

- `.env`: Default environment variables used in all environments
- `.env.local`: Local overrides (not committed to git)
- `.env.development`: Development-specific variables (when running with `npm run dev`)
- `.env.production`: Production-specific variables (when running with `npm run build`)

## Environment Variables

### API Configuration

- `VITE_API_URL`: The base URL for API requests (e.g., `http://localhost:3000/api`)
- `VITE_API_BASE_URL`: Fallback API URL if `VITE_API_URL` is not set

### Feature Flags

- `VITE_ENABLE_ANALYTICS`: Enable/disable analytics tracking (`true`/`false`)
- `VITE_ENABLE_MOCK_DATA`: Enable/disable mock data for API calls (`true`/`false`)

### Debug Options

- `VITE_DEBUG`: Enable/disable debug logging (`true`/`false`)

## Local Development

For local development, you can create or modify the `.env.local` file. This file is not committed to git and is used to override the default environment variables:

```bash
# API Configuration
VITE_API_URL=http://localhost:3000/api
# VITE_API_BASE_URL=https://nestjs-blog-backend-ecommerce.desarrollo-software.xyz/api

# Feature flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_MOCK_DATA=true

# Debug options
VITE_DEBUG=true
```

## How Environment Variables Are Used

Environment variables are used in the following files:

- `src/config/api.ts`: Main configuration file that reads environment variables
- `src/services/api.ts`: API service that uses the configuration
- `src/utils/api-helpers.ts`: Helper functions for using mock data

## Adding New Environment Variables

When adding new environment variables:

1. Add the variable to `.env` with a default value
2. Update `src/config/api.ts` to read the new variable
3. Document the variable in this README file
