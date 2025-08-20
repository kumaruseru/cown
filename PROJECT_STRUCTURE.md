# COWN1 Project Structure - Complete Documentation

## 📁 Project Overview
This project combines Object-Oriented Programming architecture with Telegram Web App (TWeb) components and MTProto encryption for cloud-based authentication.

## 🏗️ Core Architecture

### 1. OOP Structure (`src/`)
```
src/
├── abstracts/          # Abstract base classes
├── controllers/        # HTTP request handlers  
├── models/            # Data models
├── views/             # UI templates & pages
├── services/          # Business logic layer
├── repositories/      # Data access layer
├── middlewares/       # Express middleware
├── routes/            # API routing
├── interfaces/        # TypeScript interfaces
├── utils/             # Utility functions
└── assets/            # Static resources
```

### 2. TWeb Components Integration
```
src/
├── components/        # 585+ UI components from TWeb
│   ├── chat/         # Chat functionality (49 files)
│   ├── popups/       # Modal dialogs (58 files)
│   ├── sidebarLeft/  # Left navigation (26 files)
│   ├── sidebarRight/ # Right panel (24 files)
│   ├── stories/      # Stories feature (7 files)
│   ├── mediaEditor/  # Media editing (57 files)
│   └── ... (100+ more component directories)
├── lib/              # 389 core library files (3.46MB)
├── helpers/          # 343 utility functions
├── hooks/            # 8 React/Solid hooks
├── stores/           # 8 state management stores
└── pages/            # 10 page components
```

### 3. Styling & Assets
```
src/
├── scss/             # 135 SCSS files
│   ├── partials/     # 71 component styles
│   ├── mixins/       # 7 SCSS mixins
│   ├── fonts/        # 3 font configurations
│   └── components/   # 4 global component styles
├── assets/
│   ├── css/pages/    # 12 page-specific CSS files
│   ├── js/modules/   # 12 JavaScript modules
│   └── images/       # Image resources
└── views/pages/      # 12 HTML page templates
```

### 4. Configuration & Environment
```
src/
├── config/           # 14 configuration files
│   ├── databases/    # Database configurations
│   ├── app.ts        # Main app config
│   ├── emoji.ts      # Emoji configurations
│   └── currencies.ts # Currency support
├── environment/      # 36 environment detection files
└── vendor/           # 97 third-party libraries
    ├── solid/        # SolidJS framework
    ├── opus/         # Audio codec
    └── emoji/        # Emoji processing
```

## 🔐 Authentication System

### MTProto Encryption Implementation
- **Protocol**: MTProto 2.0 with AES-256-IGE encryption
- **Key Exchange**: RSA-2048 for initial handshake
- **Session Management**: Encrypted session tokens
- **Database**: Multi-cloud architecture (MySQL, MongoDB, Redis, Neo4j)

### Authentication Files
```
src/
├── services/authService.js      # Core auth with MTProto
├── controllers/authController.js # HTTP auth handlers
├── middlewares/authMiddleware.js # Security middleware
├── routes/authRoutes.js         # API endpoints
└── assets/js/modules/
    ├── register.js              # Registration with encryption
    └── login.js                 # Login with encryption
```

## 🗄️ Database Schema

### Cloud Database Configuration
- **Primary**: MySQL (user accounts, encrypted credentials)
- **Profiles**: MongoDB (user profiles, preferences)  
- **Sessions**: Redis (session management, caching)
- **Social**: Neo4j (relationships, connections)

### Schema Features
- Encrypted password storage (bcrypt + MTProto)
- Session token encryption
- Audit logging for security events
- Multi-factor authentication support

## 🚀 Features Implemented

### ✅ Completed Features
1. **Complete OOP Architecture**: Full MVC structure with abstracts, interfaces
2. **TWeb Component Library**: 585+ components, 389 lib files, 343 helpers
3. **MTProto Authentication**: Encrypted registration/login flows
4. **Cloud Database Integration**: Multi-database architecture
5. **Responsive UI**: 12 HTML pages with corrected asset paths
6. **SCSS Styling**: 135 style files with mixins and components
7. **State Management**: 8 stores for application state
8. **TypeScript Support**: Complete type definitions and interfaces

### 🔧 Technical Stack
- **Frontend**: SolidJS, TypeScript, SCSS, HTML5
- **Backend**: Node.js, Express.js, MTProto
- **Databases**: MySQL, MongoDB, Redis, Neo4j
- **Security**: AES-256-IGE, RSA-2048, bcrypt
- **Build**: Vite, TypeScript compiler
- **Components**: 585+ TWeb components

### 📊 Project Statistics
- **Total Files**: 1000+ files
- **Total Size**: ~10MB
- **Components**: 585 UI components
- **Library Files**: 389 core files
- **Helper Functions**: 343 utilities
- **SCSS Files**: 135 stylesheets
- **Configuration Files**: 50+ config files

## 🛠️ Development Ready

The project is now fully equipped with:
- Complete TWeb component library
- MTProto encryption for authentication
- Cloud database integration
- Responsive UI with proper asset linking
- TypeScript support throughout
- Complete styling system
- State management infrastructure

All major components from TWeb have been successfully integrated, providing a solid foundation for building a complete Telegram-like web application with advanced encryption and cloud database support.
