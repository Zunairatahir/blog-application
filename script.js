// BlogSpace frontend demo. Data stays in this browser's localStorage.
// Do not use real passwords. This is not production authentication.

const STORAGE_KEYS = { users: "blogspace_demo_users_v1", blogs: "blogspace_demo_blogs_v1" };

function readStorage(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

let users = readStorage(STORAGE_KEYS.users);
let blogs = readStorage(STORAGE_KEYS.blogs);
let currentUser = null;
let toastTimer;

const $ = (id) => document.getElementById(id);

function saveData() {
  localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
  localStorage.setItem(STORAGE_KEYS.blogs, JSON.stringify(blogs));
}

function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}

function showPage(pageId) {
  const target = $(pageId);
  if (!target) return;

  document.querySelectorAll(".page").forEach((page) => page.classList.add("hidden"));
  target.classList.remove("hidden");

  document.querySelectorAll(".nav-link[data-page]").forEach((button) => {
    button.classList.toggle("active", button.dataset.page === pageId);
  });

  $("mainNav").classList.remove("open");
  $("menuToggle").setAttribute("aria-expanded", "false");

  if (pageId === "dashboard") renderDashboard();
  if (pageId === "home") renderBlogs();
  if (pageId === "create" && !currentUser) {
    showToast("Log in or register before publishing a story.");
    // Keep the Create page visible so visitors can read the form note;
    // submit handler will redirect to login if they try to publish.
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function createBlogCard(blog, canDelete = false) {
  const card = makeElement("article", "blog-card");
  const top = makeElement("div", "blog-card-top");
  top.appendChild(makeElement("span", "category", blog.category || "Other"));
  top.appendChild(makeElement("span", "blog-date", blog.date || ""));
  card.appendChild(top);
  card.appendChild(makeElement("h3", "", blog.title));
  card.appendChild(makeElement("p", "", blog.excerpt || blog.content.slice(0, 155) + (blog.content.length > 155 ? "…" : "")));
  const meta = makeElement("div", "blog-meta");
  meta.appendChild(makeElement("span", "", "By " + (blog.author || "Guest")));
  if (canDelete && currentUser && blog.authorEmail === currentUser.email) {
    const deleteButton = makeElement("button", "card-delete", "Delete");
    deleteButton.type = "button";
    deleteButton.addEventListener("click", () => {
      if (!window.confirm("Delete this story? This cannot be undone.")) return;
      blogs = blogs.filter((item) => item.id !== blog.id);
      saveData();
      renderBlogs();
      renderDashboard();
      showToast("Story deleted.");
    });
    meta.appendChild(deleteButton);
  } else {
    meta.appendChild(makeElement("span", "", blog.category || "Story"));
  }
  card.appendChild(meta);
  return card;
}

function renderBlogs() {
  const list = $("blogList");
  const searchTerm = $("searchInput").value.trim().toLowerCase();
  list.replaceChildren();

  const filtered = [...blogs].reverse().filter((blog) => {
    const searchable = [blog.title, blog.excerpt, blog.content, blog.category, blog.author].join(" ").toLowerCase();
    return searchable.includes(searchTerm);
  });

  filtered.forEach((blog) => list.appendChild(createBlogCard(blog)));
  $("emptyMessage").classList.toggle("hidden", filtered.length > 0);
}

function renderDashboard() {
  $("welcomeMessage").textContent = currentUser
    ? `Welcome, ${currentUser.name}. Here are the stories you have published.`
    : "You are viewing the dashboard as a guest. Log in to manage your stories.";
  $("accountStatus").textContent = currentUser ? "Logged in" : "Guest";
  const ownBlogs = currentUser
    ? blogs.filter((blog) => blog.authorEmail === currentUser.email)
    : [];
  $("myBlogCount").textContent = String(ownBlogs.length);
  const list = $("myBlogs");
  list.replaceChildren();
  ownBlogs.slice().reverse().forEach((blog) => list.appendChild(createBlogCard(blog, true)));
  $("myEmptyMessage").classList.toggle("hidden", ownBlogs.length > 0);
  if (!currentUser) $("myEmptyMessage").textContent = "Log in to view and manage your stories.";
  else $("myEmptyMessage").textContent = "You have not published any stories yet.";
}

document.querySelectorAll("[data-page]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    showPage(button.dataset.page);
  });
});

$("menuToggle").addEventListener("click", () => {
  const open = $("mainNav").classList.toggle("open");
  $("menuToggle").setAttribute("aria-expanded", String(open));
});

$("exploreButton").addEventListener("click", () => {
  $("blogsSection").scrollIntoView({ behavior: "smooth" });
});

$("searchInput").addEventListener("input", renderBlogs);

$("registerForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = $("registerName").value.trim();
  const email = $("registerEmail").value.trim().toLowerCase();
  const password = $("registerPassword").value;

  if (name.length < 2) {
    showToast("Please enter your full name.");
    return;
  }
  if (users.some((user) => user.email === email)) {
    showToast("That email is already registered in this browser.");
    return;
  }

  // Demo only: plain-text password storage is not safe for real accounts.
  users.push({ id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), name, email, password });
  saveData();
  event.target.reset();
  showToast("Account created. Please log in.");
  showPage("login");
});

$("loginForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const email = $("loginEmail").value.trim().toLowerCase();
  const password = $("loginPassword").value;
  const user = users.find((item) => item.email === email && item.password === password);

  if (!user) {
    showToast("Email or password is incorrect. Register first if you have no account.");
    return;
  }

  currentUser = { id: user.id, name: user.name, email: user.email };
  event.target.reset();
  updateNavigation();
  showToast(`Welcome back, ${currentUser.name}!`);
  showPage("dashboard");
});

$("blogForm").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!currentUser) {
    showToast("Please log in before publishing a story.");
    showPage("login");
    return;
  }

  const title = $("blogTitle").value.trim();
  const category = $("blogCategory").value;
  const excerpt = $("blogExcerpt").value.trim();
  const content = $("blogContent").value.trim();

  if (!title || !content) {
    showToast("Please add a title and story content.");
    return;
  }

  blogs.push({
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    title, category, excerpt, content,
    author: currentUser.name,
    authorEmail: currentUser.email,
    date: new Date().toLocaleDateString()
  });
  saveData();
  event.target.reset();
  renderBlogs();
  renderDashboard();
  showToast("Your story has been published!");
  showPage("home");
});

$("logoutButton").addEventListener("click", () => {
  currentUser = null;
  updateNavigation();
  showToast("You have logged out.");
  showPage("home");
});

function updateNavigation() {
  const loggedIn = Boolean(currentUser);
  $("loginNav").classList.toggle("hidden", loggedIn);
  $("registerNav").classList.toggle("hidden", loggedIn);
  $("logoutButton").classList.toggle("hidden", !loggedIn);
}

renderBlogs();
renderDashboard();
updateNavigation();
showPage("home");
