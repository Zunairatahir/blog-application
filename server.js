const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Demo-only in-memory data: resets whenever the server restarts.
// Never store plain-text passwords in a real application.
let users = [];
let blogs = [];
let nextUserId = 1;
let nextBlogId = 1;

app.get("/", (req, res) => {
  res.json({
    message: "BlogSpace API is running.",
    endpoints: [
      "GET /api/blogs",
      "POST /api/register",
      "POST /api/login",
      "POST /api/blogs",
      "GET /api/users/:id/blogs",
      "DELETE /api/blogs/:id"
    ]
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "BlogSpace API is healthy." });
});

app.post("/api/register", (req, res) => {
  const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
  const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const password = typeof req.body.password === "string" ? req.body.password : "";

  if (name.length < 2 || !email || !email.includes("@") || password.length < 6) {
    return res.status(400).json({ message: "Enter a name, valid email, and password of at least 6 characters." });
  }
  if (users.some((user) => user.email === email)) {
    return res.status(409).json({ message: "An account with this email already exists." });
  }

  const user = { id: nextUserId++, name, email, password };
  users.push(user);
  return res.status(201).json({
    message: "Registration successful. Please log in.",
    user: { id: user.id, name: user.name, email: user.email }
  });
});

app.post("/api/login", (req, res) => {
  const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const password = typeof req.body.password === "string" ? req.body.password : "";
  const user = users.find((item) => item.email === email && item.password === password);

  if (!user) return res.status(401).json({ message: "Incorrect email or password." });
  return res.json({
    message: "Login successful.",
    user: { id: user.id, name: user.name, email: user.email }
  });
});

app.get("/api/blogs", (req, res) => {
  res.json(blogs.map(({ id, title, category, content, authorName, userId, createdAt }) => ({
    id, title, category, content, authorName, userId, createdAt
  })));
});

app.post("/api/blogs", (req, res) => {
  const userId = Number(req.header("x-user-id"));
  const user = users.find((item) => item.id === userId);
  if (!user) return res.status(401).json({ message: "Please log in before publishing a post." });

  const title = typeof req.body.title === "string" ? req.body.title.trim() : "";
  const category = typeof req.body.category === "string" ? req.body.category.trim() : "General";
  const content = typeof req.body.content === "string" ? req.body.content.trim() : "";

  if (!title || !content) return res.status(400).json({ message: "Title and content are required." });
  if (title.length > 120 || content.length > 10000) {
    return res.status(400).json({ message: "Title or content is too long." });
  }

  const blog = {
    id: nextBlogId++,
    title,
    category: category || "General",
    content,
    authorName: user.name,
    userId: user.id,
    createdAt: new Date().toISOString()
  };
  blogs.push(blog);
  return res.status(201).json({ message: "Blog created successfully.", blog });
});

app.get("/api/users/:id/blogs", (req, res) => {
  const userId = Number(req.params.id);
  const user = users.find((item) => item.id === userId);
  if (!user) return res.status(404).json({ message: "User not found." });
  return res.json(blogs.filter((blog) => blog.userId === userId));
});

app.delete("/api/blogs/:id", (req, res) => {
  const userId = Number(req.header("x-user-id"));
  const blogId = Number(req.params.id);
  const index = blogs.findIndex((blog) => blog.id === blogId);
  if (index === -1) return res.status(404).json({ message: "Blog not found." });
  if (blogs[index].userId !== userId || !users.some((user) => user.id === userId)) {
    return res.status(403).json({ message: "You can only delete your own posts." });
  }
  blogs.splice(index, 1);
  return res.json({ message: "Blog deleted successfully." });
});

// JSON response for unknown API paths.
app.use("/api", (req, res) => {
  res.status(404).json({ message: "API endpoint not found." });
});

app.listen(PORT, () => {
  console.log(`BlogSpace API running at http://localhost:${PORT}`);
});
