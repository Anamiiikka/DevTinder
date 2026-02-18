# DevConnect - Hackathon Teammate Matching Platform

DevConnect is a MERN stack web application that helps developers find hackathon teammates based on shared technology stacks and role requirements. Instead of random swiping, users enter their preferences and receive ranked recommendations using a compatibility scoring algorithm.

## 🚀 Features

- **Smart Matching Algorithm**: Find teammates based on skills, roles, and location
- **Real-time Chat**: Communicate with matched teammates instantly
- **User Profiles**: Showcase your skills, role, and availability
- **Connection System**: Send connection requests and create mutual matches
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 📋 Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Axios
- Zustand (State Management)
- Socket.IO Client
- React Router

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (Authentication)
- bcrypt
- Socket.IO

## 📁 Project Structure

```
DevConnect/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── chatController.js
│   │   ├── matchController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── Match.js
│   │   ├── Message.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── chatRoutes.js
│   │   ├── matchRoutes.js
│   │   └── userRoutes.js
│   ├── services/
│   │   └── matchingService.js
│   ├── utils/
│   │   └── tokenUtils.js
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── pages/
    │   │   ├── Chat.jsx
    │   │   ├── Login.jsx
    │   │   ├── Matches.jsx
    │   │   ├── Onboarding.jsx
    │   │   ├── Profile.jsx
    │   │   └── Register.jsx
    │   ├── services/
    │   │   ├── api.js
    │   │   ├── index.js
    │   │   └── socket.js
    │   ├── store/
    │   │   └── authStore.js
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── .env.example
    ├── .gitignore
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    └── vite.config.js
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/devconnect
JWT_SECRET=your_secret_key_here
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

5. Start the backend server:
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

5. Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🔄 User Flows

### New User Flow (First Time Registration)

1. **Landing Page**: User opens application and sees Sign Up / Login options
2. **Registration**: User enters name, email, password
   - API: `POST /api/auth/register`
   - Password hashed with bcrypt, JWT generated
3. **Onboarding** (3-step profile setup):
   - Step 1 - Basic Info: Name, Bio, Role
     - API: `PUT /api/users/profile/basic`
   - Step 2 - Tech Stack: Select skills
     - API: `PUT /api/users/profile/skills`
   - Step 3 - Requirements: Select roles needed
     - API: `PUT /api/users/profile/requirements`
     - Backend marks `profileCompleted = true`
4. **Find Teammates**: Click "Find My Team"
   - API: `POST /api/match/find`
   - Returns ranked suggestions based on compatibility
5. **Connect**: User clicks Connect on a potential teammate
   - API: `POST /api/match/connect`
   - If mutual → Match created
6. **Chat**: After mutual match, real-time chat enabled via Socket.IO

### Existing User Flow (Already Registered)

1. **Login**: Enter email & password
   - API: `POST /api/auth/login`
2. **Profile Check**:
   - If `profileCompleted = true` → Dashboard
   - If `false` → Onboarding
3. **Dashboard**: Three main features:
   - **Discover**: Find new teammates (`POST /api/match/find`)
   - **My Matches**: View mutual matches (`GET /api/match/my`)
   - **Chat**: Real-time messaging with matches

## 🎯 Matching Algorithm

The matching algorithm uses a scoring system:

### Hard Filtering
- Filters users by required roles
- Shows only users with matching criteria

### Scoring System
- **Common Skills**: +3 points per shared skill
- **Role Match**: +5 points if candidate is looking for your role
- **Location Match**: +1 point for same location

Results are sorted by score, and top 10 candidates are returned.

## �️ Database Structure

### Users Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String,           // 'Frontend Dev', 'Backend Dev', etc.
  bio: String,
  skills: [String],       // ['React', 'Node.js', 'MongoDB']
  lookingFor: [String],   // Roles they're looking for
  location: String,
  availability: String,   // 'Full Time', 'Part Time', etc.
  profileCompleted: Boolean,
  pendingConnections: [ObjectId],
  matches: [ObjectId],
  hackathons: Number,
  wins: Number
}
```

### Connections Collection
```javascript
{
  fromUser: ObjectId,     // User who sent the connection
  toUser: ObjectId,       // User who received the connection
  status: String          // 'pending', 'accepted', 'rejected'
}
```

### Matches Collection
```javascript
{
  users: [ObjectId, ObjectId],  // Both matched users
  chatId: String                // Unique chat identifier
}
```

### Messages Collection
```javascript
{
  chatId: String,
  senderId: ObjectId,
  text: String
}
```

## �🔐 Authentication

- Passwords are hashed using bcrypt
- Authentication handled via JSON Web Tokens (JWT)
- Protected routes require valid JWT token
- Tokens stored in localStorage (frontend)

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### User Profile
- `POST /api/users/profile` - Update entire user profile
- `PUT /api/users/profile/basic` - Update basic info (name, bio, role, location, availability)
- `PUT /api/users/profile/skills` - Update user skills array
- `PUT /api/users/profile/requirements` - Update lookingFor array (roles needed)
- `GET /api/users/:id` - Get user by ID

### Matching
- `POST /api/match/find` - Find potential matches (returns ranked suggestions)
- `POST /api/match/connect` - Connect with a user (creates pending or mutual match)
- `GET /api/match/my` - Get user's mutual matches

### Chat
- `GET /api/chat/:matchId` - Get chat messages for a match
- `POST /api/chat/:matchId` - Send a message to a chat

## 💬 Socket.IO Events

### Client → Server
- `join_chat` - Join a chat room
- `send_message` - Send a message
- `typing` - User is typing
- `stop_typing` - User stopped typing
- `leave_chat` - Leave a chat room

### Server → Client
- `new_message` - New message received
- `user_typing` - Another user is typing
- `user_stop_typing` - Another user stopped typing

## 🚀 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

### Backend (Render)
1. Push code to GitHub
2. Create new Web Service in Render
3. Set environment variables
4. Deploy

### Database (MongoDB Atlas)
1. Create account on MongoDB Atlas
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in backend `.env`

## 📝 Environment Variables

### Backend
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/devconnect
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [ISC License](LICENSE).

## 👨‍💻 Author

Built with ❤️ for the developer community

---

**Happy Coding! 🚀**
