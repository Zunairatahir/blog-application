# Blog Application

A responsive full-stack Blog Application developed as part of my **Full Stack Web Development Internship at Codomax Digital Solutions**.

The application allows users to register, log in, create blog posts, browse published blogs, and view individual blog details. It uses MongoDB Atlas for persistent data storage and a Node.js/Express.js backend to handle API requests.

## Project Overview

The project was developed in multiple modules, progressing from frontend development to backend implementation and database integration.

### Development Modules

- **Module 1 – Frontend Development:** Created the responsive user interface using HTML, CSS, and JavaScript.
- **Module 2 – Backend Development:** Implemented the backend using Node.js and Express.js, including REST API endpoints for user and blog operations.
- **Module 3 – Database Integration:** Connected the application to MongoDB Atlas, implemented database operations, added individual blog details, and introduced bcrypt password hashing.

## Features

### Frontend

- Responsive homepage displaying blog posts.
- User registration and login interfaces.
- User dashboard.
- Create Blog functionality.
- Blog categories.
- Individual blog details page.
- Read More functionality.
- Dynamic blog retrieval from the backend.
- Responsive layout for different screen sizes.

### Backend

- REST API development using Node.js and Express.js.
- MongoDB Atlas database connection using Mongoose.
- User registration and login endpoints.
- Password hashing using bcryptjs.
- Blog creation and deletion.
- Retrieve all blog posts from the database.
- Retrieve individual blog details using blog ID.
- Retrieve blogs associated with a specific user.
- Input validation and error handling.
- CORS configuration.
- Environment variable management using dotenv.

### Database

- MongoDB Atlas for cloud database hosting.
- Mongoose schemas and models for users and blog posts.
- Persistent storage of user and blog data.
- Bcrypt-hashed passwords instead of plain-text passwords.
- Password migration script for converting existing plain-text passwords into bcrypt hashes.

## Technologies Used

| Category | Technologies |
|---|---|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Security | bcryptjs |
| Backend utilities | dotenv, CORS |
| Tools | Visual Studio Code, Git, GitHub, npm |

## Project Structure

```text
blog-application/
│
├── backend/
│   ├── node_modules/
│   ├── .env
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js
│   └── migratePasswords.js
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
└── README.md
```

**Note:** `node_modules/` and `.env` are local files and should not be uploaded to GitHub. The `.env` file contains private database credentials.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Check API status and available endpoints |
| GET | `/api/health` | Check backend health |
| POST | `/api/register` | Register a new user |
| POST | `/api/login` | Authenticate a user |
| GET | `/api/blogs` | Retrieve all blog posts |
| GET | `/api/blogs/:id` | Retrieve an individual blog |
| POST | `/api/blogs` | Create a new blog post |
| GET | `/api/users/:id/blogs` | Retrieve blogs belonging to a user |
| DELETE | `/api/blogs/:id` | Delete a blog post |

## Getting Started

Follow these steps to run the project locally.

### Prerequisites

- Node.js
- npm
- MongoDB Atlas account
- Visual Studio Code
- Live Server extension (for running the frontend)

### 1. Clone the Repository

```bash
git clone https://github.com/Zunairatahir/blog-application.git
cd blog-application
```

### 2. Install Backend Dependencies

Navigate to the backend directory:

```bash
cd backend
```

Install the required packages:

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `backend` directory.

Add your MongoDB connection string:

```env
MONGO_URI=your_mongodb_connection_string
PORT=3000
```

Replace the placeholder with your actual MongoDB Atlas connection string.

**Important:** Never upload your actual `.env` file or database credentials to GitHub.

### 4. Start the Backend Server

While inside the `backend` directory, run:

```bash
node server.js
```

The backend API will run at:

```text
http://localhost:3000
```

### 5. Run the Frontend

Open the `frontend` folder in Visual Studio Code.

Launch `index.html` using the Live Server extension.

Make sure the backend server is running so the frontend can communicate with the API.

## Password Migration

The project includes `migratePasswords.js`, a one-time migration script used to convert existing plain-text user passwords in MongoDB into bcrypt hashes.

To run the migration when required:

```bash
node migratePasswords.js
```

The script skips passwords that are already bcrypt-hashed.

**Note:** This migration is intended for existing database records. It is not necessary to run it every time the application starts.

## Learning Outcomes

Through this project, I gained practical experience in:

- Building responsive frontend interfaces.
- Developing backend applications with Node.js and Express.js.
- Creating and using REST APIs.
- Connecting applications to MongoDB Atlas.
- Designing database schemas using Mongoose.
- Implementing password hashing with bcryptjs.
- Retrieving and managing database records.
- Integrating frontend and backend functionality.

## Future Improvements

- Implement JWT-based authentication.
- Add stronger authorization and protected routes.
- Introduce blog editing functionality.
- Improve application validation and security.
- Deploy the complete frontend and backend application.

## Author

**Zunaira Tahir**

- GitHub: [Zunairatahir](https://github.com/Zunairatahir)
- Repository: [Blog Application](https://github.com/Zunairatahir/blog-application)

Developed as part of the **Codomax Digital Solutions – Full Stack Web Development Internship**.
