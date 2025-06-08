# RecipeHub - Collaborative Recipe Builder

A full-stack web application for creating, sharing, and collaborating on recipes with built-in scaling and timers.

## Features

- 🔐 Secure authentication with JWT
- 🍲 Recipe creation and management
- 📊 Automatic ingredient scaling
- ⏲️ Built-in cooking timers
- 👥 Collaborative editing
- 🔄 Manual sync mechanism

## Tech Stack

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript
- Deployed on GitHub Pages

### Backend
- Java 11
- Spring Boot 2.7.0
- MongoDB Atlas
- JWT Authentication
- Deployed on Render.com

## Project Structure

```
RecipeHub/
├── frontend/
│   ├── index.html
│   ├── dashboard.html
│   ├── recipe-edit.html
│   ├── recipe-view.html
│   ├── css/
│   │   └── styles.css
│   └── js/
│       ├── auth.js
│       ├── recipe.js
│       └── timer.js
│
└── backend/
    ├── src/
    │   └── main/
    │       ├── java/
    │       │   └── com/
    │       │       └── recipehub/
    │       │           ├── controllers/
    │       │           ├── models/
    │       │           ├── repositories/
    │       │           ├── services/
    │       │           └── security/
    │       └── resources/
    │           └── application.properties
    └── pom.xml
```

## Setup Instructions

### Prerequisites
- Java 11 or higher
- Maven
- MongoDB Atlas account
- Node.js (for local development)

### Backend Setup
1. Clone the repository
2. Configure MongoDB connection in `application.properties`
3. Set up environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `CORS_ORIGINS`
4. Run the application:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

### Frontend Setup
1. Configure the API endpoint in `js/auth.js`
2. Open `index.html` in a web browser
3. For development, use a local server:
   ```bash
   cd frontend
   python -m http.server 3000
   ```

## API Documentation

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - User login
- POST `/api/auth/logout` - User logout
- GET `/api/auth/verify` - Verify token

### Recipes
- GET `/api/recipes` - List recipes
- GET `/api/recipes/{id}` - Get recipe details
- POST `/api/recipes` - Create recipe
- PUT `/api/recipes/{id}` - Update recipe
- DELETE `/api/recipes/{id}` - Delete recipe
- POST `/api/recipes/{id}/collaborators` - Add collaborator
- GET `/api/recipes/{id}/sync` - Sync recipe changes

## Security

- JWT-based authentication
- Password encryption with bcrypt
- CORS configuration for specific domains
- Environment variables for sensitive data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 