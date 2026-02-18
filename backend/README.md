# DevConnect Backend

Backend API for DevConnect - Hackathon Teammate Matching Platform

## Features

- RESTful API endpoints
- JWT authentication
- MongoDB database
- Real-time chat with Socket.IO
- Smart matching algorithm

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/devconnect
JWT_SECRET=your_secret_key_here
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

3. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (protected)

### Users
- `POST /api/users/profile` - Update profile (protected)
- `GET /api/users/:id` - Get user by ID (protected)

### Matches
- `POST /api/match/find` - Find matches (protected)
- `POST /api/match/connect` - Connect with user (protected)
- `GET /api/match/my` - Get my matches (protected)

### Chat
- `GET /api/chat/:matchId` - Get messages (protected)
- `POST /api/chat/:matchId` - Send message (protected)

## Matching Algorithm

Scoring system:
- Common skills: +3 points each
- Role match: +5 points
- Location match: +1 point

Returns top 10 matches sorted by score.

## Socket.IO

Events:
- `join_chat` - Join chat room
- `send_message` - Send message
- `typing` / `stop_typing` - Typing indicators
- `new_message` - Broadcast new message
