# COWN1 Platform

A modern social messaging platform with end-to-end encryption using MTProto protocol, built with Node.js, Express, and multiple database technologies.

## 🚀 Features

- **Secure Messaging**: End-to-end encryption using MTProto 2.0
- **Real-time Communication**: WebSocket support for instant messaging
- **Multi-Database Architecture**: MySQL, MongoDB, Redis, and Neo4j
- **File Sharing**: Support for images, videos, audio, and documents
- **User Management**: Registration, authentication, profiles, and preferences
- **Friend System**: Add friends, manage requests, and social connections
- **Group Chat**: Create and manage group conversations
- **Modern UI**: Responsive web interface with 12 different pages
- **Cloud Integration**: Support for cloud storage and databases

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MTProto 2.0** for encryption
- **JWT** for authentication
- **Socket.io** for real-time communication
- **Multer** for file uploads

### Databases
- **MySQL** - Primary user data and messages
- **MongoDB** - User profiles and preferences
- **Redis** - Session management and caching
- **Neo4j** - Social relationships and connections

### Security
- **Helmet.js** for security headers
- **Rate limiting** to prevent abuse
- **CORS** protection
- **Input validation** and sanitization
- **File upload** restrictions

## 📁 Project Structure

```
cown1/
├── src/
│   ├── assets/
│   │   ├── css/         # Stylesheets
│   │   ├── js/          # Frontend JavaScript
│   │   ├── images/      # Images and icons
│   │   └── fonts/       # Font files
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── repositories/    # Data access layer
│   ├── models/          # Data models
│   ├── middlewares/     # Express middleware
│   ├── routes/          # API routes
│   ├── views/
│   │   ├── pages/       # HTML pages
│   │   ├── components/  # Reusable components
│   │   └── layouts/     # Page layouts
│   ├── utils/           # Utility functions
│   └── database/        # Database configurations
├── logs/                # Application logs
├── uploads/             # File uploads
├── server.js            # Main server file
├── package.json         # Dependencies and scripts
└── .env                 # Environment variables
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MySQL
- MongoDB
- Redis
- Neo4j

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/cown1/cown1-platform.git
   cd cown1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials and configuration
   ```

4. **Setup databases**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - API: http://localhost:3000/api

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token

### Users
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/avatar` - Upload avatar
- `GET /api/users/search/:query` - Search users

### Messages
- `GET /api/messages/conversations` - Get conversations
- `POST /api/messages/send` - Send message
- `GET /api/messages/conversations/:id` - Get messages
- `DELETE /api/messages/:id` - Delete message

### Friends
- `GET /api/friends` - Get friends list
- `POST /api/friends/request` - Send friend request
- `PUT /api/friends/request/:id/accept` - Accept request

## 🔧 Development

### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run build` - Build for production

### Environment Variables
See `.env.example` for all available configuration options.

### Database Setup
1. **MySQL**: Create database and run migrations
2. **MongoDB**: Setup connection URI
3. **Redis**: Configure for sessions and caching
4. **Neo4j**: Setup for social relationships

## 🔐 Security Features

- **MTProto 2.0** encryption for all communications
- **JWT** tokens with refresh mechanism
- **Rate limiting** to prevent abuse
- **Input validation** and sanitization
- **Secure file uploads** with type restrictions
- **CORS** and security headers
- **Session management** with Redis

## 📱 Frontend Pages

1. **Index** - Landing page
2. **Login** - User authentication
3. **Register** - User registration
4. **Messages** - Chat interface
5. **Profile** - User profile management
6. **Friends** - Friend management
7. **Settings** - User preferences
8. **Calls** - Voice/video calls
9. **Discovery** - Discover new people
10. **Maps** - Location sharing
11. **Forgot Password** - Password recovery
12. **Reset Password** - Password reset

## 🚀 Deployment

### Render Deployment

This app is ready to deploy on Render with the included `render.yaml` configuration.

#### Quick Deploy to Render:
1. **Connect GitHub**: Link your GitHub repository to Render
2. **Create Web Service**: Use the `render.yaml` file for automatic configuration
3. **Set Environment Variables**:
   - `NODE_ENV`: production
   - `PORT`: 10000 (auto-set by Render)
   - `SESSION_SECRET`: Generate secure string
   - `JWT_SECRET`: Generate secure string
   - Database credentials for MySQL, MongoDB, Redis, Neo4j

#### Manual Render Setup:
1. Fork/clone this repository
2. Create new Web Service on Render
3. Connect your repository
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Set environment variables in Render dashboard

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Configure production databases
- [ ] Set strong JWT secrets
- [ ] Enable SSL/HTTPS (auto-enabled on Render)
- [ ] Configure backup strategies
- [ ] Setup monitoring and logging

### Docker Deployment
```bash
# Build image
docker build -t cown1-platform .

# Run container
docker run -p 3000:3000 --env-file .env cown1-platform
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

## 🔄 Changelog

### Version 1.0.0
- Initial release
- Complete messaging system
- MTProto encryption
- Multi-database architecture
- Real-time communication
- File sharing capabilities

---

**Built with ❤️ by the COWN1 Team**
