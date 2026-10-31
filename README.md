# Blog Application

A responsive full-stack Blog Application developed as part of my **Full Stack Web Development Internship at Codomax Digital Solutions**.

The application allows users to register, log in, create and manage blog posts, browse published blogs, search for content, filter posts by category, and view individual blog details.

The project uses **HTML, CSS, and JavaScript** for the frontend, **Node.js and Express.js** for the backend, and **MongoDB Atlas** for persistent data storage.

## Project Overview

The application was developed in multiple modules, progressing from frontend development to backend implementation, database integration, and complete CRUD functionality.

### Development Modules

- **Module 1 – Frontend Development:** Created a responsive user interface using HTML, CSS, and JavaScript.
- **Module 2 – Backend Development:** Developed the backend using Node.js and Express.js and implemented REST API endpoints.
- **Module 3 – Database Integration:** Connected the application to MongoDB Atlas, implemented database operations, added individual blog details, and introduced bcrypt password hashing.
- **Module 4 – CRUD Functionality:** Implemented Create, Read, Update, and Delete operations for blog posts, along with search and category filtering.

## Features

### Frontend

- Responsive homepage displaying published blog posts.
- User registration and login interfaces.
- User dashboard for managing personal blog posts.
- Create new blog posts.
- Edit existing blog posts.
- Delete blog posts.
- Individual blog details page.
- Read More functionality.
- Search blogs using keywords.
- Filter blogs by category.
- Dynamic blog retrieval from the backend.
- Form validation and user feedback.
- Responsive layout for different screen sizes.

### Backend

- REST API development using Node.js and Express.js.
- MongoDB Atlas database connection using Mongoose.
- User registration and login endpoints.
- Password hashing and comparison using bcryptjs.
- Create new blog posts.
- Retrieve all published blog posts.
- Retrieve individual blog details using blog ID.
- Update existing blog posts.
- Delete blog posts.
- Retrieve blogs associated with a specific user.
- Input validation and error handling.
- Ownership checks for blog editing and deletion.
- CORS configuration.
- Environment variable management using dotenv.
- Backend health-check endpoint.

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
| Backend Utilities | dotenv, CORS |
| Tools | Visual Studio Code, Git, GitHub, npm |

## Project Structure

```text
blog-application/
│
├── backend/
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
├── .gitignore
└── README.md
```

**Note:** `node_modules/` and `.env` are local files and should not be uploaded to GitHub. The `.env` file contains private database credentials. Make sure they are excluded through `.gitignore`.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Check API status and available endpoints |
| GET | `/api/health` | Check backend health |
| POST | `/api/register` | Register a new user |
| POST | `/api/login` | Log in an existing user |
| GET | `/api/blogs` | Retrieve all blog posts |
| GET | `/api/blogs/:id` | Retrieve an individual blog |
| POST | `/api/blogs` | Create a new blog post |
| PUT | `/api/blogs/:id` | Update an existing blog post |
| DELETE | `/api/blogs/:id` | Delete a blog post |
| GET | `/api/users/:id/blogs` | Retrieve blogs belonging to a specific user |

## Getting Started

Follow these steps to run the project locally.

### Prerequisites

- Node.js
- npm
- MongoDB Atlas account
- Visual Studio Code
- Live Server extension

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

Add your MongoDB connection string and port:

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

To check whether the backend is running, open:

```text
http://localhost:3000/api/health
```

### 5. Run the Frontend

Open the `frontend` folder in Visual Studio Code.

Launch `index.html` using the Live Server extension.

Make sure the backend server is running so the frontend can communicate with the API.

The frontend API configuration should point to:

```javascript
const API_URL = "http://localhost:3000/api";
```

## Password Migration

The project includes `migratePasswords.js`, a one-time migration script used to convert existing plain-text user passwords in MongoDB into bcrypt hashes.

To run the migration when required, navigate to the backend directory and execute:

```bash
node migratePasswords.js
```

The script skips passwords that are already bcrypt-hashed.

**Note:** This migration is intended for existing database records. It is not necessary to run it every time the application starts.

## Learning Outcomes

Through this project, I gained practical experience in:

- Building responsive frontend interfaces.
- Developing backend applications using Node.js and Express.js.
- Creating and using REST APIs.
- Connecting applications to MongoDB Atlas.
- Designing database schemas using Mongoose.
- Implementing password hashing with bcryptjs.
- Performing CRUD operations on database records.
- Implementing blog ownership checks.
- Integrating frontend and backend functionality.
- Implementing search and category-based filtering.
- Handling API requests, validation, and errors.
- Managing environment variables and project dependencies.

## Future Improvements

- Implement JWT-based authentication and secure session management.
- Strengthen authorization and protected routes.
- Improve application security and validation.
- Add image uploads for blog posts.
- Deploy the complete frontend and backend application.

## Author

**Zunaira Tahir**

- GitHub: [Zunairatahir](https://github.com/Zunairatahir)
- Repository: [Blog Application](https://github.com/Zunairatahir/blog-application)

Developed as part of the **Codomax Digital Solutions – Full Stack Web Development Internship**.
