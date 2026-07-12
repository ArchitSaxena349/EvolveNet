# EvolveNet - Alumni Association Platform

A modern, full-stack professional networking platform designed for alumni communities to connect, collaborate, and grow together.

## Overview

**EvolveNet** is a comprehensive MERN stack application that empowers users to:

- **Build professional profiles** – Showcase your background, skills, and achievements
- **Network with peers** – Send and manage connection requests with other members
- **Join communities** – Participate in interest-based groups and discussions
- **Discover events** – Create, promote, and RSVP to professional events
- **Stay connected** – Maintain and grow your alumni network

## Features

### User Authentication & Security
- **JWT-based authentication** with secure token management
- **Email verification** via Nodemailer
- **Password hashing** with Bcrypt
- Refresh token functionality for persistent sessions
- Rate limiting to prevent brute-force attacks

### Profile Management
- Create and customize professional profiles
- View and edit user information
- Display network statistics and connections

### Networking & Connections
- Send, accept, and manage connection requests
- View mutual connections
- Build and maintain professional relationships

### Groups & Communities
- Create and join interest-based groups
- Foster collaboration within communities
- Group discovery and filtering

### Event Management
- Create and manage professional events
- RSVP and event registration
- View upcoming and past events
- Event details and attendee information

## Technology Stack

### Frontend
- **React.js** – Modern UI library
- **React Router** – Client-side navigation
- **Axios** – HTTP client for API requests
- **CSS** – Styling

### Backend
- **Node.js** – JavaScript runtime
- **Express.js** – Web framework
- **MongoDB** – NoSQL database
- **Mongoose** – MongoDB object modeling

### Security & Utilities
- **bcrypt** – Password hashing and salting
- **jsonwebtoken** – JWT authentication
- **Nodemailer** – Email service for verification
- **Helmet.js** – HTTP security headers
- **CORS** – Cross-origin resource sharing
- **dotenv** – Environment variable management

## Project Structure

```
├── client/                    # React frontend application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── context/           # React Context for state management
│   │   ├── App.js
│   │   └── index.js
│   └── public/
├── server/                    # Express backend application
│   ├── controllers/           # Route handlers
│   ├── models/                # MongoDB schemas
│   ├── routes/                # API route definitions
│   ├── middleware/            # Express middleware
│   └── server.js
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas account)
- Git

### Clone the Repository

```bash
git clone https://github.com/ArchitSaxena349/EvolveNet.git
cd "Alumni Association"
```

### Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd server && npm install && cd ..

# Install frontend dependencies
cd client && npm install && cd ..
```

### Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB_NAME=evolvenet
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=1h
JWT_REFRESH_EXPIRE=7d
EMAIL_SERVICE=your_email_service_provider (e.g. Gmail)
EMAIL_USERNAME=your_email@example.com
EMAIL_PASSWORD=your_email_password_or_app_password
EMAIL_FROM="Your App <no-reply@example.com>"
CLIENT_URL=http://localhost:3000
```

## Running the Application

### Development Mode

With hot reloading enabled:

```bash
npm run dev
```

This starts both the backend server and React development server concurrently.

### Production Mode

Build and start the application:

```bash
# Build the React client for production
npm run build

# Start the backend server
npm start
```

## Utility Scripts

### Asset Organization

Consolidate and organize frontend assets:

```bash
node scripts/organize-assets.js
```

This script moves files from `logo/` and `client/public/` into `client/public/assets/` and updates references in `index.html` and `manifest.json`. Backups are created with `.bak` extension.

### Cleanup

Remove temporary files and debug logs:

```bash
npm run clean
```

## API Documentation

The backend provides the following API endpoints:

### Authentication
- `POST /api/auth/signup` – Register a new user
- `POST /api/auth/login` – User login
- `POST /api/auth/refresh-token` – Refresh JWT token

### Users
- `GET /api/users/:id` – Get user profile
- `PUT /api/users/:id` – Update user profile

### Connections
- `POST /api/connections/send` – Send connection request
- `GET /api/connections` – Get all connections
- `PUT /api/connections/:id/accept` – Accept connection request

### Groups
- `GET /api/groups` – Get all groups
- `POST /api/groups` – Create a new group
- `GET /api/groups/:id` – Get group details

### Events
- `GET /api/events` – Get all events
- `POST /api/events` – Create a new event
- `GET /api/events/:id` – Get event details
- `PUT /api/events/:id/rsvp` – RSVP to an event

## Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `build/` folder to your hosting platform
3. Set the backend API URL as an environment variable

### Backend (Heroku/Railway/Render)
1. Push your code to a Git repository
2. Connect your repository to your hosting platform
3. Add environment variables through the platform's dashboard
4. Deploy

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Make your changes and commit (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

For major changes, please open an issue first to discuss what you'd like to change.

## License

This project is licensed under the [MIT License](LICENSE). Feel free to use, fork, or contribute!

## Support

If you encounter any issues or have questions, please open an issue on GitHub or contact the project maintainers.

## Acknowledgements

Thanks to all open-source contributors and the tools that made this project possible!
