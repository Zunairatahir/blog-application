document.addEventListener("DOMContentLoaded", function () {

    /* REGISTER */

    const registerForm = document.getElementById("registerForm");
    if (registerForm) {

        registerForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const name = document.getElementById("registerName").value;
            const email = document.getElementById("registerEmail").value;
            const password = document.getElementById("registerPassword").value;
            const confirmPassword = document.getElementById("confirmPassword").value;

            if (password !== confirmPassword) {
                alert("Passwords do not match.");
                return;
            }

            const user = {
                name: name,
                email: email,
                password: password
            };

            localStorage.setItem("blogUser", JSON.stringify(user));

            alert("Account created successfully!");

            window.location.href = "login.html";
        });
    }


    /* LOGIN */

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {

        loginForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const email = document.getElementById("loginEmail").value;
            const password = document.getElementById("loginPassword").value;

            const storedUser = JSON.parse(
                localStorage.getItem("blogUser")
            );

            if (
                storedUser &&
                storedUser.email === email &&
                storedUser.password === password
            ) {

                localStorage.setItem("isLoggedIn", "true");

                alert("Login successful!");

                window.location.href = "dashboard.html";

            } else {

                alert("Invalid email or password.");

            }

        });
    }


    /* CREATE BLOG */

    const blogForm = document.getElementById("blogForm");

    if (blogForm) {

        blogForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const title = document.getElementById("blogTitle").value;
            const category = document.getElementById("blogCategory").value;
            const content = document.getElementById("blogContent").value;

            const blog = {
                title: title,
                category: category,
                content: content,
                date: new Date().toLocaleDateString()
            };

            let blogs = JSON.parse(
                localStorage.getItem("blogs")
            ) || [];

            blogs.push(blog);

            localStorage.setItem(
                "blogs",
                JSON.stringify(blogs)
            );

            alert("Blog published successfully!");

            window.location.href = "dashboard.html";
        });
    }

});
