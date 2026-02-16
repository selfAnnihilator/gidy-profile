# Gidy - Professional Profile Management System

Gidy is a full-stack professional profile management application that allows users to create, manage, and showcase their professional profiles with detailed information including experience, education, certifications, and career aspirations.

## Tech Stack
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Real-time**: Socket.IO
- **Styling**: Tailwind CSS with custom dark mode

## Features

### Core Functionality
- Professional profile creation and management
- Detailed profile sections (bio, experience, education, certifications, skills)
- Real-time collaborative editing with Socket.IO
- Responsive design with mobile-first approach
- Dark/light mode toggle with persistent preferences

### Profile Sections
- Personal information (name, title, bio, contact details)
- Professional experience tracking
- Educational background
- Certifications with links
- Skills with endorsement system
- Career vision with aspirations and goals

### Advanced Features
- Real-time collaboration (multiple users can view updates simultaneously)
- Skill endorsement system
- Social media integration
- Career vision management with persistent storage
- Comprehensive profile statistics

## Environment Configuration

### Frontend Environment Variables
Create `.env` file in the `client` directory:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

### Backend Environment Variables
Create `.env` file in the `server` directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gidy
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret_here
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or accessible via URI)

### Backend Setup
```bash
cd server
npm install
npm start
```

The backend will run on `http://localhost:5000` by default.

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

The frontend will run on `http://localhost:5173` by default.

## Project Structure
```
Gidy/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── config/        # Configuration files
│   │   └── ...
├── server/                 # Backend Express application
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   └── ...
```

## API Endpoints
- `GET /api/profile/demo` - Retrieve demo profile
- `PUT /api/profile` - Update profile
- `DELETE /api/profile/experience/:id` - Delete experience
- `DELETE /api/profile/education/:id` - Delete education
- `DELETE /api/profile/certification/:id` - Delete certification

## Key Innovations
1. **Real-time Collaboration** - Updates are instantly visible to all connected users
2. **Persistent Career Vision** - Career goals are saved to localStorage and survive page refreshes
3. **Advanced Dark Mode** - Comprehensive theme system with CSS variables
4. **Skill Endorsement System** - Interactive skill management
5. **Responsive Design** - Works seamlessly across devices

## Development
For development:
- The application uses environment variables for configuration
- API calls are centralized through the config system
- Socket.IO enables real-time updates
- Tailwind CSS with custom theme variables for consistent styling

## Deployment
For production deployment:
1. Update environment variables for your hosting platform
2. Ensure MongoDB connection string is properly configured
3. Set appropriate CORS origins
4. Build the frontend with `npm run build` in the client directory

