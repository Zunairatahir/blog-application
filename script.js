
const API_URL = "http://localhost:3000/api";

let currentUser = null;
let allBlogs = [];
let toastTimer;
let editingBlogId = null;

const $ = (id) => document.getElementById(id);

// API REQUESTS
async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(currentUser ? { "x-user-id": String(currentUser.id) } : {}),
      ...options.headers
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
}

// TOAST NOTIFICATION
function showToast(message) {
  const toast = $("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// PAGE NAVIGATION
function showPage(pageId) {
  if (
    (pageId === "create" || pageId === "editBlog") &&
    !currentUser
  ) {
    showToast("Please log in first.");
    pageId = "login";
  }

  const target = $(pageId);
  if (!target) return;

  document.querySelectorAll(".page").forEach((page) => {
    page.classList.add("hidden");
  });

  target.classList.remove("hidden");

  document.querySelectorAll(".nav-link[data-page]").forEach((button) => {
    button.classList.toggle(
      "active",
      button.dataset.page === pageId
    );
  });

  $("mainNav").classList.remove("open");
  $("menuToggle").setAttribute("aria-expanded", "false");

  if (pageId === "home") renderBlogs();
  if (pageId === "dashboard") renderDashboard();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// CREATE HTML ELEMENTS
function makeElement(tag, className = "", text = "") {
  const element = document.createElement(tag);

  if (className) element.className = className;
  element.textContent = text;

  return element;
}

// FORMAT DATE
function formatDate(value) {
  if (!value) return "";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString();
}

// GET BLOG ID
function getBlogId(blog) {
  return blog.id || blog._id;
}

// CHECK BLOG OWNERSHIP
function isOwnBlog(blog) {
  return Boolean(
    currentUser &&
    blog.userId &&
    String(blog.userId) === String(currentUser.id)
  );
}

// CREATE BLOG CARD
function createBlogCard(blog, canManage = false) {
  const card = makeElement("article", "blog-card");
  const top = makeElement("div", "blog-card-top");

  top.appendChild(
    makeElement("span", "category", blog.category || "General")
  );

  top.appendChild(
    makeElement("span", "blog-date", formatDate(blog.createdAt))
  );

  card.appendChild(top);

  card.appendChild(
    makeElement("h3", "", blog.title || "Untitled")
  );

  const content = blog.content || "";

  const excerpt =
    content.length > 155
      ? content.slice(0, 155) + "…"
      : content;

  card.appendChild(makeElement("p", "", excerpt));

  // READ MORE BUTTON
  const readMoreButton = makeElement(
    "button",
    "text-button",
    "Read More →"
  );

  readMoreButton.type = "button";

  readMoreButton.addEventListener("click", () => {
    openBlogDetails(getBlogId(blog));
  });

  card.appendChild(readMoreButton);

  // BLOG META
  const meta = makeElement("div", "blog-meta");

  meta.appendChild(
    makeElement(
      "span",
      "",
      "By " + (blog.authorName || blog.author || "Guest")
    )
  );

  // EDIT AND DELETE BUTTONS FOR OWN BLOGS
  if (canManage && isOwnBlog(blog)) {

    // EDIT BUTTON
    const editButton = makeElement(
      "button",
      "card-edit",
      "Edit"
    );

    editButton.type = "button";

    editButton.addEventListener("click", () => {
      openEditBlog(getBlogId(blog));
    });

    meta.appendChild(editButton);

    // DELETE BUTTON
    const deleteButton = makeElement(
      "button",
      "card-delete",
      "Delete"
    );

    deleteButton.type = "button";

    deleteButton.addEventListener("click", async () => {
      if (!window.confirm("Delete this story? This cannot be undone.")) {
        return;
      }

      try {
        await apiRequest(
          `/blogs/${encodeURIComponent(getBlogId(blog))}`,
          { method: "DELETE" }
        );

        showToast("Story deleted.");

        await loadBlogs();
        await renderDashboard();

      } catch (error) {
        showToast(error.message);
      }
    });

    meta.appendChild(deleteButton);

  } else {
    meta.appendChild(
      makeElement("span", "", blog.category || "Story")
    );
  }

  card.appendChild(meta);

  return card;
}

// LOAD ALL BLOGS FROM MONGODB
async function loadBlogs() {
  allBlogs = await apiRequest("/blogs");
  return allBlogs;
}

// DISPLAY BLOGS WITH SEARCH AND CATEGORY FILTER
async function renderBlogs() {
  const list = $("blogList");

  if (!list) return;

  list.replaceChildren();

  try {
    await loadBlogs();

    const searchTerm = $("searchInput").value.trim().toLowerCase();
    const selectedCategory = $("categoryFilter").value;

    const filtered = [...allBlogs].filter((blog) => {
      const searchable = [
        blog.title,
        blog.content,
        blog.category,
        blog.authorName
      ].join(" ").toLowerCase();

      const matchesSearch = searchable.includes(searchTerm);

      const matchesCategory =
        selectedCategory === "all" ||
        blog.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    filtered.forEach((blog) => {
      list.appendChild(createBlogCard(blog));
    });

    $("emptyMessage").textContent =
      "No stories found. Try another search or category.";

    $("emptyMessage").classList.toggle(
      "hidden",
      filtered.length > 0
    );

  } catch (error) {
    $("emptyMessage").classList.remove("hidden");

    $("emptyMessage").textContent =
      "Could not load stories. Check that your backend is running.";

    showToast(error.message);
  }
}

// INDIVIDUAL BLOG DETAILS PAGE
async function openBlogDetails(blogId) {
  if (!blogId) {
    showToast("Invalid blog ID.");
    return;
  }

  showPage("blogDetails");

  $("detailTitle").textContent = "Loading blog...";
  $("detailMeta").textContent = "";
  $("detailCategory").textContent = "";
  $("detailContent").textContent = "Please wait while the blog loads.";

  try {
    const blog = await apiRequest(
      `/blogs/${encodeURIComponent(blogId)}`
    );

    $("detailTitle").textContent = blog.title || "Untitled";

    $("detailMeta").textContent =
      `By ${blog.authorName || blog.author || "Guest"} · ${formatDate(blog.createdAt)}`;

    $("detailCategory").textContent =
      blog.category || "General";

    $("detailContent").textContent =
      blog.content || "No content available.";

    $("detailContent").style.whiteSpace = "pre-wrap";

  } catch (error) {
    $("detailTitle").textContent = "Unable to load blog";
    $("detailMeta").textContent = "";
    $("detailCategory").textContent = "";
    $("detailContent").textContent = error.message;

    showToast(error.message);
  }
}

// BACK TO BLOG LIST
$("backToBlogs").addEventListener("click", () => {
  showPage("home");
});

// OPEN EDIT BLOG PAGE
async function openEditBlog(blogId) {
  if (!currentUser) {
    showToast("Please log in first.");
    showPage("login");
    return;
  }

  try {
    const blog = await apiRequest(
      `/blogs/${encodeURIComponent(blogId)}`
    );

    if (!isOwnBlog(blog)) {
      showToast("You can only edit your own stories.");
      return;
    }

    editingBlogId = getBlogId(blog);

    $("editBlogTitle").value = blog.title || "";
    $("editBlogCategory").value = blog.category || "Other";
    $("editBlogContent").value = blog.content || "";

    showPage("editBlog");

  } catch (error) {
    showToast(error.message);
  }
}

// UPDATE BLOG
$("editBlogForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!currentUser || !editingBlogId) {
    showToast("Unable to update this story.");
    return;
  }

  const title = $("editBlogTitle").value.trim();
  const category = $("editBlogCategory").value;
  const content = $("editBlogContent").value.trim();

  if (!title || !content) {
    showToast("Please enter a title and story content.");
    return;
  }

  try {
    const result = await apiRequest(
      `/blogs/${encodeURIComponent(editingBlogId)}`,
      {
        method: "PUT",
        body: JSON.stringify({
          title,
          category,
          content
        })
      }
    );

    editingBlogId = null;

    event.target.reset();

    showToast(result.message || "Story updated successfully.");

    await loadBlogs();
    await renderDashboard();

    showPage("dashboard");

  } catch (error) {
    showToast(error.message);
  }
});

// CANCEL EDITING
$("cancelEditButton").addEventListener("click", () => {
  editingBlogId = null;
  $("editBlogForm").reset();
  showPage("dashboard");
});

// DASHBOARD
async function renderDashboard() {
  $("welcomeMessage").textContent = currentUser
    ? `Welcome, ${currentUser.name}. Here are your published stories.`
    : "You are viewing the dashboard as a guest. Log in to manage your stories.";

  $("accountStatus").textContent = currentUser
    ? "Logged in"
    : "Guest";

  const list = $("myBlogs");
  list.replaceChildren();

  if (!currentUser) {
    $("myBlogCount").textContent = "0";

    $("myEmptyMessage").textContent =
      "Log in to view and manage your stories.";

    $("myEmptyMessage").classList.remove("hidden");
    return;
  }

  try {
    const ownBlogs = await apiRequest(
      `/users/${encodeURIComponent(currentUser.id)}/blogs`
    );

    $("myBlogCount").textContent = String(ownBlogs.length);

    ownBlogs.forEach((blog) => {
      list.appendChild(createBlogCard(blog, true));
    });

    $("myEmptyMessage").textContent =
      "You have not published any stories yet.";

    $("myEmptyMessage").classList.toggle(
      "hidden",
      ownBlogs.length > 0
    );

  } catch (error) {
    $("myEmptyMessage").textContent = error.message;
    $("myEmptyMessage").classList.remove("hidden");
  }
}

// UPDATE NAVIGATION
function updateNavigation() {
  const loggedIn = Boolean(currentUser);

  $("loginNav").classList.toggle("hidden", loggedIn);
  $("registerNav").classList.toggle("hidden", loggedIn);
  $("logoutButton").classList.toggle("hidden", !loggedIn);
}

// NAVIGATION BUTTONS
document.querySelectorAll("[data-page]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    showPage(button.dataset.page);
  });
});

// MOBILE MENU
$("menuToggle").addEventListener("click", () => {
  const open = $("mainNav").classList.toggle("open");

  $("menuToggle").setAttribute(
    "aria-expanded",
    String(open)
  );
});

// EXPLORE BLOGS
$("exploreButton").addEventListener("click", () => {
  $("blogsSection").scrollIntoView({
    behavior: "smooth"
  });
});

// SEARCH AND CATEGORY FILTERS
$("searchInput").addEventListener("input", renderBlogs);

$("categoryFilter").addEventListener("change", renderBlogs);

// REGISTRATION
$("registerForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = $("registerName").value.trim();
  const email = $("registerEmail").value.trim().toLowerCase();
  const password = $("registerPassword").value;

  try {
    const result = await apiRequest("/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password })
    });

    event.target.reset();

    showToast(result.message);
    showPage("login");

  } catch (error) {
    showToast(error.message);
  }
});

// LOGIN
$("loginForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = $("loginEmail").value.trim().toLowerCase();
  const password = $("loginPassword").value;

  try {
    const result = await apiRequest("/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });

    currentUser = result.user;

    event.target.reset();

    updateNavigation();

    showToast(`Welcome, ${currentUser.name}!`);
    showPage("dashboard");

  } catch (error) {
    showToast(error.message);
  }
});

// PUBLISH BLOG
$("blogForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!currentUser) {
    showToast("Please log in before publishing a story.");
    showPage("login");
    return;
  }

  const title = $("blogTitle").value.trim();
  const category = $("blogCategory").value;
  const content = $("blogContent").value.trim();

  if (!title || !content) {
    showToast("Please enter a title and story content.");
    return;
  }

  try {
    const result = await apiRequest("/blogs", {
      method: "POST",
      body: JSON.stringify({
        title,
        category,
        content
      })
    });

    event.target.reset();

    showToast(result.message);

    await loadBlogs();

    showPage("home");

  } catch (error) {
    showToast(error.message);
  }
});

// LOGOUT
$("logoutButton").addEventListener("click", () => {
  currentUser = null;
  editingBlogId = null;

  updateNavigation();

  showToast("You have logged out.");
  showPage("home");
});

// START APPLICATION
updateNavigation();
showPage("home");
