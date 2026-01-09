// Global Execution Context (GEC) is created when this script starts running.
// Variables and functions are hoisted, then line-by-line execution begins.

// 🔹 Selecting all required DOM elements
const inputs = document.querySelectorAll(".input");
const form = document.querySelector("#register-form");
const passwordInput = document.querySelector("#password");
const errorMessage = document.querySelector("#error-message"); // Ensure this exists in HTML

// 🧩 Function to add 'focus' class when input is active
function addcl() {
    let parent = this.parentNode.parentNode;
    parent.classList.add("focus");
}

// 🧩 Function to remove 'focus' class when input is empty and loses focus
function remcl() {
    let parent = this.parentNode.parentNode;
    if (this.value === "") {
        parent.classList.remove("focus");
    }
}

// 🔹 Adding focus and blur event listeners to each input field
inputs.forEach((input) => {
    input.addEventListener("focus", addcl);
    input.addEventListener("blur", remcl);
});

// 🧩 Validation functions
function validateUsername(username) {
    return /^[a-zA-Z0-9_-]{3,20}$/.test(username);
}

function validatePassword(password) {
    return /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/.test(password);
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // Allows any domain
}

function validateMobile(mobile) {
    return /^\d{10}$/.test(mobile);
}

// 🔹 Real-time validation as user types
inputs.forEach((input) => {
    input.addEventListener("input", function() {
        const value = this.value.trim();
        let errorText = "";

        switch (this.name) {
            case "username":
                if (!validateUsername(value) && value !== "") {
                    errorText = "Username: 3-20 chars (letters, numbers, _, - only)";
                }
                break;
            case "password":
                if (!validatePassword(value) && value !== "") {
                    errorText = "Password: 8+ chars, 1 upper, 1 number, 1 symbol";
                }
                break;
            case "email":
                if (!validateEmail(value) && value !== "") {
                    errorText = "Invalid email format";
                }
                break;
            case "mobile":
                if (!validateMobile(value) && value !== "") {
                    errorText = "Mobile must be exactly 10 digits";
                }
                break;
        }

        if (errorMessage) {
            errorMessage.textContent = errorText;
            errorMessage.style.display = errorText ? 'block' : 'none';
        }
    });

    input.addEventListener('focus', function() {
        if (errorMessage) {
            errorMessage.textContent = "";
            errorMessage.style.display = 'none';
        }
    });
});

// 🔹 Form submission validation
form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent default submission

    const username = form.querySelector("input[name='username']").value.trim();
    const password = passwordInput.value.trim();
    const email = form.querySelector("input[name='email']").value.trim();
    const mobile = form.querySelector("input[name='mobile']").value.trim();
    const role = form.querySelector("select[name='role']").value;

    // Client-side validation
    let errorText = "";
    if (!validateUsername(username)) {
        errorText = "Invalid username format";
    } else if (!validatePassword(password)) {
        errorText = "Invalid password format";
    } else if (!validateEmail(email)) {
        errorText = "Invalid email format";
    } else if (!validateMobile(mobile)) {
        errorText = "Mobile number must be exactly 10 digits";
    } else if (!role) {
        errorText = "Please select a role";
    }

    if (errorText) {
        if (errorMessage) {
            errorMessage.textContent = errorText;
            errorMessage.style.display = 'block';
        } else {
            alert(errorText);
        }
        return;
    }

    if (errorMessage) {
        errorMessage.textContent = "";
        errorMessage.style.display = 'none';
    }

    const data = { username, password, role, email, mobile };

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            window.location.href = '/login';
        } else {
            const errorData = await response.text();
            if (errorMessage) {
                errorMessage.textContent = errorData || 'Registration failed';
                errorMessage.style.display = 'block';
            } else {
                alert(errorData || 'Registration failed');
            }
        }
    } catch (error) {
        console.error('Registration error:', error);
        if (errorMessage) {
            errorMessage.textContent = 'Server error during registration';
            errorMessage.style.display = 'block';
        } else {
            alert('Server error during registration');
        }
    }
});
