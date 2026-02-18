# DevConnect Frontend

Next.js frontend for DevConnect - Hackathon Teammate Matching Platform

## Features

- Next.js 14 with App Router
- Tailwind CSS styling
- Zustand state management
- Socket.IO real-time chat
- Protected routes
- Responsive design
- Server-side rendering support

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
npm start
```

## Pages

- `/` - Home (redirects to matches or login)
- `/login` - User login
- `/register` - User registration
- `/onboarding` - Profile setup (3 steps)
- `/matches` - Discover & connections
- `/chat/:matchId` - Real-time chat
- `/profile` - User profile

## State Management

Using Zustand with local storage persistence for authentication state.

## Components

- `Navbar` - Navigation bar
- `ProtectedRoute` - Route protection wrapper

## Services

- `api.js` - Axios instance with interceptors
- `socket.js` - Socket.IO client setup
- `index.js` - API service methods

## Styling

Tailwind CSS with custom utility classes:
- `.btn-primary` - Primary button
- `.btn-secondary` - Secondary button
- `.input-field` - Form input
- `.card` - Card container
