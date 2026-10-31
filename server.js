
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((error) => console.error("MongoDB connection error:", error));

// User model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { type: String, required: true }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

// Blog model
const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  category: { type: String, default: "General", trim: true },
  content: { type: String, required: true, maxlength: 10000 },
  authorName: { type: String, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

const Blog = mongoose.model("Blog", blogSchema);

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "BlogSpace API is running.",
    endpoints: [
      "GET /api/blogs",
      "GET /api/blogs/:id",
      "POST /api/register",
      "POST /api/login",
      "POST /api/blogs",
      "GET /api/users/:id/blogs",
      "DELETE /api/blogs/:id"
    ]
  });
});

// Health route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "BlogSpace API is healthy." });
});

// Register
app.post("/api/register", async (req, res) => {
  try {
    const name = typeof req.body.name === "string"
      ? req.body.name.trim()
      : "";

    const email = typeof req.body.email === "string"
      ? req.body.email.trim().toLowerCase()
      : "";

    const password = typeof req.body.password === "string"
      ? req.body.password
      : "";

    if (name.length < 2 || !email || !email.includes("@") || password.length < 6) {
      return res.status(400).json({
        message: "Enter a name, valid email, and password of at least 6 characters."
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists."
      });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    return res.status(201).json({
      message: "Registration successful. Please log in.",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Registration failed." });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  try {
    const email = typeof req.body.email === "string"
      ? req.body.email.trim().toLowerCase()
      : "";

    const password = typeof req.body.password === "string"
      ? req.body.password
      : "";

    // Find user using email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Incorrect email or password."
      });
    }

    // Compare entered password with its stored hash
    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Incorrect email or password."
      });
    }

    return res.json({
      message: "Login successful.",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Login failed." });
  }
});

// Get all blogs
app.get("/api/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });

    res.json(blogs.map((blog) => ({
      id: blog._id.toString(),
      _id: blog._id.toString(),
      title: blog.title,
      category: blog.category,
      content: blog.content,
      authorName: blog.authorName,
      author: blog.authorName,
      userId: blog.userId.toString(),
      createdAt: blog.createdAt
    })));

  } catch (error) {
    console.error("Fetch blogs error:", error);
    res.status(500).json({ message: "Could not load blogs." });
  }
});

// Get individual blog by ID
app.get("/api/blogs/:id", async (req, res) => {
  try {
    const blogId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({ message: "Invalid blog ID." });
    }

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }

    res.json({
      id: blog._id.toString(),
      _id: blog._id.toString(),
      title: blog.title,
      category: blog.category,
      content: blog.content,
      authorName: blog.authorName,
      author: blog.authorName,
      userId: blog.userId.toString(),
      createdAt: blog.createdAt
    });

  } catch (error) {
    console.error("Fetch individual blog error:", error);
    res.status(500).json({ message: "Could not load blog details." });
  }
});

// Create blog
app.post("/api/blogs", async (req, res) => {
  try {
    const userId = req.header("x-user-id");

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(401).json({
        message: "Please log in before publishing a post."
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({
        message: "Please log in before publishing a post."
      });
    }

    const title = typeof req.body.title === "string"
      ? req.body.title.trim()
      : "";

    const category = typeof req.body.category === "string"
      ? req.body.category.trim()
      : "General";

    const content = typeof req.body.content === "string"
      ? req.body.content.trim()
      : "";

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required."
      });
    }

    if (title.length > 120 || content.length > 10000) {
      return res.status(400).json({
        message: "Title or content is too long."
      });
    }

    const blog = await Blog.create({
      title,
      category: category || "General",
      content,
      authorName: user.name,
      userId: user._id
    });

    return res.status(201).json({
      message: "Blog created successfully.",
      blog: {
        id: blog._id.toString(),
        _id: blog._id.toString(),
        title: blog.title,
        category: blog.category,
        content: blog.content,
        authorName: blog.authorName,
        author: blog.authorName,
        userId: blog.userId.toString(),
        createdAt: blog.createdAt
      }
    });

  } catch (error) {
    console.error("Create blog error:", error);
    return res.status(500).json({ message: "Could not create blog." });
  }
});

// Get blogs by user
app.get("/api/users/:id/blogs", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    const blogs = await Blog.find({
      userId: req.params.id
    }).sort({ createdAt: -1 });

    return res.json(blogs);

  } catch (error) {
    console.error("User blogs error:", error);
    return res.status(500).json({
      message: "Could not load user blogs."
    });
  }
});

// Delete blog
app.delete("/api/blogs/:id", async (req, res) => {
  try {
    const userId = req.header("x-user-id");
    const blogId = req.params.id;

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(blogId)
    ) {
      return res.status(400).json({
        message: "Invalid user or blog ID."
      });
    }

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }

    if (blog.userId.toString() !== userId) {
      return res.status(403).json({
        message: "You can only delete your own posts."
      });
    }

    await Blog.findByIdAndDelete(blogId);

    return res.json({ message: "Blog deleted successfully." });

  } catch (error) {
    console.error("Delete blog error:", error);
    return res.status(500).json({
      message: "Could not delete blog."
    });
  }
});

// Unknown API paths
app.use("/api", (req, res) => {
  res.status(404).json({ message: "API endpoint not found." });
});

// Start server after MongoDB connects
mongoose.connection.once("open", () => {
  app.listen(PORT, () => {
    console.log(`BlogSpace API running at http://localhost:${PORT}`);
  });
});
