# DevConnect - Quick Start Guide

## Prerequisites
- Node.js v16+
- MongoDB running locally or MongoDB Atlas account
- npm or yarn

## Installation

### Option 1: Install All at Once
```bash
npm run install:all
```

### Option 2: Install Separately
```bash
# Install backend dependencies
npm run install:backend

# Install frontend dependencies
npm run install:frontend
```

## Configuration

### Backend
1. Copy `.env.example` to `.env` in the backend directory
2. Update with your MongoDB URI and JWT secret

### Frontend
1. Copy `.env.example` to `.env` in the frontend directory
2. Update API and Socket URLs if needed

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend runs on: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on: http://localhost:5173

### Using Root Scripts

**Backend:**
```bash
npm run dev:backend
```

**Frontend:**
```bash
npm run dev:frontend
```

## Testing the Application

1. Open http://localhost:5173 in your browser
2. Register a new account
3. Complete the onboarding process
4. Start discovering teammates!

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally
- Or update `MONGODB_URI` in backend/.env with your MongoDB Atlas connection string

### Port Already in Use
- Backend: Change `PORT` in backend/.env
- Frontend: Change port in frontend/vite.config.js

### CORS Errors
- Ensure `FRONTEND_URL` in backend/.env matches your frontend URL
- Ensure `VITE_API_URL` in frontend/.env matches your backend URL

## Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- Check [backend/README.md](./backend/README.md) for API documentation
- Check [frontend/README.md](./frontend/README.md) for frontend architecture

## Deployment

See the main README.md for deployment instructions for:
- Frontend → Vercel
- Backend → Render
- Database → MongoDB Atlas
