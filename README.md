# 21 - Fresh Groceries Online 🛒

A modern, mobile-friendly React web application for online grocery shopping with authentication, cart management, and order tracking.

## Features ✨

- **User Authentication**
  - Login/Register with phone number and name
  - OTP verification (Demo OTP: 1234)
  - Guest mode for browsing products

- **Product Management**
  - Browse products by category
  - Search functionality
  - Product images and details
  - Stock status indicators

- **Shopping Cart**
  - Add/remove items
  - Update quantities
  - Persistent cart (localStorage)
  - Real-time total calculation

- **Checkout & Orders**
  - Secure checkout for logged-in users
  - Delivery address management
  - Order history tracking
  - Order status updates

- **Mobile-First Design**
  - Fully responsive layout
  - Touch-friendly interface
  - Optimized for mobile devices
  - PWA support

- **SEO Optimized**
  - Meta tags for search engines
  - Open Graph support
  - Twitter Card support
  - Mobile-optimized meta tags

## Tech Stack 🚀

- **React 19** with TypeScript
- **React Router** for navigation
- **React Helmet Async** for SEO
- **Context API** for state management
- **CSS3** with custom properties
- **LocalStorage** for data persistence

## Getting Started 🏁

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install --legacy-peer-deps
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Demo Credentials 🔑

**OTP for testing:** `1234`

## Available Scripts 📜

### `npm start`
Runs the app in development mode

### `npm run build`
Builds the app for production

### `npm test`
Launches the test runner

## Deployment 🚀

### Cloudflare Pages

This app is configured for easy deployment on Cloudflare Pages:

1. **Connect your GitHub repository** to Cloudflare Pages
2. **Build settings**:
   - Framework preset: **None** (or Create React App)
   - Build command: `npm run build`
   - Build output directory: `build`
   - Root directory: `/` (leave empty)
3. **Deploy**: Cloudflare will automatically build and deploy your app

The app includes:
- `.npmrc` file to handle React 19 peer dependencies
- `_redirects` file for proper SPA routing on Cloudflare

### Other Platforms

The app can also be deployed to:
- **Vercel**: Auto-detected as Create React App
- **Netlify**: Use build command `npm run build` and publish directory `build`
- **GitHub Pages**: Requires additional configuration for client-side routing

## Browser Support 🌐

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

Made with ❤️ for online grocery shopping
