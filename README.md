
# Blog Application

A responsive blog application developed as part of my Full Stack Web Development Internship at Codomax Digital Solutions. The project is being developed in stages, covering frontend development and backend integration.

## Project Overview

The Blog Application provides a user-friendly interface for exploring blog posts, registering an account, logging in, viewing a dashboard, and creating blog posts.

Module 1 focuses on the frontend interface, while Module 2 introduces a Node.js and Express.js backend with REST APIs for authentication and blog management.

## Features

### Frontend
- Responsive homepage with featured blogs
- User registration and login pages
- User dashboard
- Create Blog page
- Blog categories
- Form validation
- Responsive layout for desktop, tablet, and mobile devices

### Backend
- REST API development using Node.js and Express.js
- User registration and login endpoints
- Password hashing using bcryptjs
- JWT-based authentication
- Protected blog creation endpoint
- API for retrieving all blog posts
- API for retrieving an individual blog post
- Frontend-backend communication using HTTP requests
- CORS configuration
- Environment configuration using dotenv

## Technologies Used

**Frontend**
- HTML5
- CSS3
- JavaScript

**Backend**
- Node.js
- Express.js
- REST APIs
- bcryptjs
- JSON Web Token (JWT)
- dotenv
- CORS
- npm

**Tools**
- Visual Studio Code
- Git and GitHub
- Live Server

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Check backend status |
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in a user |
| GET | `/api/blogs` | Retrieve all blog posts |
| GET | `/api/blogs/:id` | Retrieve an individual blog post |
| POST | `/api/blogs` | Create a blog post (authentication required) |

## Project Structure

```
blog-application/
├── README.md
├── index.html
├── package-lock.json
├── package.json
├── script.js
├── server.js
└── style.css
```

The `backend/.env` file must be created locally and should not be uploaded to GitHub.

## Getting Started

### Prerequisites

- Node.js
- npm
- Visual Studio Code
- Live Server extension

### 1. Clone the Repository

```bash
git clone https://github.com/Zunairatahir/blog-application.git
cd blog-application
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
JWT_SECRET=replace_with_a_unique_secret
```

Use a unique secret for local development. Never commit your `.env` file to GitHub.

### 4. Start the Backend Server

From the `backend` directory, run:

```bash
node server.js
```

The backend server should run at:

```text
http://localhost:5000
```

### 5. Run the Frontend

Open the project in Visual Studio Code and launch `index.html` using Live Server.

Ensure the frontend API configuration points to the running backend:

```javascript
const API_BASE_URL = "http://localhost:5000/api";
```

The frontend-backend features require the backend server to remain running.

## Development Notes

- The backend uses temporary in-memory arrays for user and blog data.
- User and blog records are not permanently stored by the backend and will be lost when the server restarts.
- Database integration is planned for a subsequent development stage.
- This project is an educational internship project and is not intended for production use.

## Author

**Zunaira Tahir**

GitHub: https://github.com/Zunairatahir

Repository: https://github.com/Zunairatahir/blog-application
