# API Configuration

This directory contains the API configuration for the application.

## Base URL Configuration

The application uses different base URLs for different environments:

- **Production**: `https://a2b.runasp.net` (configured in `.env.production`)
- **Development**: `http://localhost:5000` (configured in `.env.development`)

## Files

### api.ts

This file exports a configured axios instance (`apiClient`) with:

- Base URL from environment variables
- Request/response interceptors for authentication and error handling
- Default timeout of 10 seconds
- JSON content-type headers

## Usage

Import the `apiClient` in your service files:

```typescript
import apiClient from '../config/api';

// Make API calls
const response = await apiClient.get('/api/products');
const data = await apiClient.post('/api/orders', orderData);
```

## Services

All API calls are organized in the `/src/services` directory:

- **authService.ts**: Authentication (login, OTP, logout)
- **productService.ts**: Products and categories
- **orderService.ts**: Orders and order management

## Environment Variables

Create a `.env.local` file to override the default development URL if needed:

```
REACT_APP_API_BASE_URL=http://your-custom-url
```

The production build will automatically use the URL from `.env.production`.
