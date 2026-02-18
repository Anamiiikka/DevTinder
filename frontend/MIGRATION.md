# Migration from Vite + React to Next.js 14

## Overview

This project has been migrated from Vite + React to Next.js 14 using the App Router.

## Key Changes

### 1. Package Dependencies

**Removed:**
- `vite` and `@vitejs/plugin-react`
- `react-router-dom` (replaced with Next.js routing)
- Vite-specific ESLint plugins

**Added:**
- `next` - The Next.js framework
- `eslint-config-next` - Next.js ESLint configuration

### 2. Project Structure

**Old Structure (Vite):**
```
src/
  ├── main.jsx          # Entry point
  ├── App.jsx          # Router setup
  ├── index.css        # Global styles
  ├── pages/           # Page components
  ├── components/      # Reusable components
  ├── services/        # API services
  └── store/           # Zustand store
```

**New Structure (Next.js):**
```
src/
  ├── app/             # Next.js app directory
  │   ├── layout.js    # Root layout
  │   ├── page.js      # Home page
  │   ├── globals.css  # Global styles
  │   ├── login/page.js
  │   ├── register/page.js
  │   ├── onboarding/page.js
  │   ├── matches/page.js
  │   ├── profile/page.js
  │   └── chat/[matchId]/page.js
  ├── components/      # Reusable components (updated)
  ├── services/        # API services (updated)
  └── store/           # Zustand store (unchanged)
```

### 3. Routing

**Before (React Router):**
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
<Route path="/login" element={<Login />} />
```

**After (Next.js App Router):**
- File-based routing in `app/` directory
- Each folder with `page.js` becomes a route
- Dynamic routes using `[param]` folders

### 4. Navigation

**Before:**
```jsx
import { Link, useNavigate, useLocation } from 'react-router-dom';
const navigate = useNavigate();
navigate('/matches');
```

**After:**
```jsx
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
const router = useRouter();
router.push('/matches');
```

### 5. Client Components

All interactive components require `'use client'` directive at the top:
```jsx
'use client';

import { useState } from 'react';
// Component code
```

### 6. Environment Variables

**Before (Vite):**
- `VITE_API_URL`
- `VITE_SOCKET_URL`
- Accessed via `import.meta.env.VITE_*`

**After (Next.js):**
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_SOCKET_URL`
- Accessed via `process.env.NEXT_PUBLIC_*`
- Variables must be prefixed with `NEXT_PUBLIC_` to be exposed to the browser

### 7. Configuration Files

**Removed:**
- `vite.config.js`
- `index.html`

**Added:**
- `next.config.js` - Next.js configuration
- `.eslintrc.json` - ESLint configuration
- `jsconfig.json` - JavaScript configuration for path aliases

**Updated:**
- `tailwind.config.js` - Updated content paths for Next.js
- `package.json` - Updated scripts and dependencies

## Scripts

**Development:**
```bash
npm run dev
```

**Production Build:**
```bash
npm run build
npm start
```

**Linting:**
```bash
npm run lint
```

## Benefits of Next.js

1. **Better Performance** - Server-side rendering and optimized builds
2. **SEO Friendly** - Built-in SSR support for better search engine optimization
3. **Image Optimization** - Automatic image optimization with `next/image`
4. **API Routes** - Can add backend API routes if needed
5. **Built-in Routing** - No need for external routing library
6. **Better Developer Experience** - Fast refresh, better error messages

## Compatibility Notes

- All existing Zustand stores work without changes
- Socket.IO client integration remains the same
- Axios API services work as-is (just updated env variables)
- Tailwind CSS styling is fully compatible
- All React hooks and components work the same way

## What Stayed the Same

- State management (Zustand)
- Styling (Tailwind CSS)
- API structure
- Socket.IO implementation
- Component logic
- Authentication flow

## Next Steps

1. Install dependencies: `npm install`
2. Update environment variables (create `.env.local`)
3. Run development server: `npm run dev`
4. Test all routes and functionality
