# EvolveNet - Professional Networking Platform

EvolveNet is a modern professional networking platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- User Authentication (Register, Login, Password Reset)
- Profile Management
- Event Management
- Professional Connections
- Groups and Communities
- Real-time Notifications
- Email Verification
- Secure API with JWT Authentication

## Tech Stack

- **Frontend**: React.js, Context API, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT, bcrypt
- **Email**: Nodemailer
- **Security**: Helmet, Rate Limiting, CORS

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/evolvenet.git
cd evolvenet
```

2. Install dependencies:
```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
```

3. Create a .env file in the root directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/evolvenet
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
EMAIL_SERVICE=gmail
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-email-password
EMAIL_FROM=your-email@gmail.com
```

4. Start the development server:
```bash
# From the root directory
npm run dev
```

This will start both the backend server (port 5000) and frontend development server (port 3000).

## Available Scripts

- `npm run dev` - Start both client and server in development mode
- `npm run server` - Start only the server
- `npm run client` - Start only the client
- `npm run build` - Build the client for production
- `npm test` - Run tests
- `npm start` - Start the server in production mode

## Project Structure

```
evolvenet/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/               # Source files
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context
│   │   ├── pages/         # Page components
│   │   └── App.js         # Main App component
│   └── package.json       # Frontend dependencies
├── server/                # Node.js/Express backend
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   └── server.js         # Main server file
└── package.json          # Root package.json
```

## Security Features

- JWT Authentication with refresh tokens
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation
- Email verification
- Password reset functionality

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Your Name - your.email@example.com

Project Link: [https://github.com/yourusername/evolvenet](https://github.com/yourusername/evolvenet) 