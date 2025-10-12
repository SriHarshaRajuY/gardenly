// ✅ Global Execution Context (GEC) is created when this script starts running.
//    - Variables and functions are hoisted.
//    - Then line-by-line execution begins.

// 🔹 Selecting all required DOM elements
const inputs = document.querySelectorAll(".input");
const form = document.querySelector("#register-form");
const passwordInput = document.querySelector("#password");
const errorMessage = document.querySelector("#error-message");

// 🧩 Function to add 'focus' class when input is active
function addcl() {
    // 'this' refers to the input field that triggered the event
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
    // ✅ Each event listener creates its own small function execution context
    input.addEventListener("focus", addcl);
    input.addEventListener("blur", remcl);
});

// 🧩 Validation functions (pure functions - return boolean)
function validateUsername(username) {
    // 3-20 characters, can include letters, numbers, underscore, or hyphen
    return /^[a-zA-Z0-9_-]{3,20}$/.test(username);
}

function validatePassword(password) {
    // Must have 1 uppercase, 1 special symbol, 1 number, min 8 chars
    return /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/.test(password);
}

function validateEmail(email) {
    // Simple rule: must end with .com and have @
    return /^[^\s@]+@[^\s@]+\.com$/.test(email);
}

function validateMobile(mobile) {
    // Exactly 10 digits only
    return /^\d{10}$/.test(mobile);
}

// 🔹 Real-time validation as user types
inputs.forEach((input) => {
    input.addEventListener("input", function() {
        // 'this' refers to the input currently being typed in
        const value = this.value;

        // 🧩 Check which input is being typed (by its name attribute)
        switch (this.name) {
            case "username":
                if (!validateUsername(value) && value !== "") {
                    errorMessage.textContent = "Username: 3-20 chars (letters, numbers, _, - only)";
                } else {
                    errorMessage.textContent = "";
                }
                break;

            case "password":
                if (!validatePassword(value) && value !== "") {
                    errorMessage.textContent = "Password: 8+ chars, 1 upper, 1 number, 1 symbol";
                } else {
                    errorMessage.textContent = "";
                }
                break;

            case "email":
                if (!validateEmail(value) && value !== "") {
                    errorMessage.textContent = "Email must be valid and end with .com";
                } else {
                    errorMessage.textContent = "";
                }
                break;

            case "mobile":
                if (!validateMobile(value) && value !== "") {
                    errorMessage.textContent = "Mobile must be exactly 10 digits";
                } else {
                    errorMessage.textContent = "";
                }
                break;
        }
    });
});

// 🔹 Form submission validation
form.addEventListener("submit", (e) => {
    // ✅ Execution context for this callback is created only on form submission
    const username = form.querySelector("input[name='username']").value;
    const password = passwordInput.value;
    const email = form.querySelector("input[name='email']").value;
    const mobile = form.querySelector("input[name='mobile']").value;
    const role = form.querySelector("select[name='role']").value;

    // 🧩 Validate each field before allowing submission
    if (!validateUsername(username)) {
        e.preventDefault(); // Stop form submission
        errorMessage.textContent = "Invalid username format";
        return;
    }

    if (!validatePassword(password)) {
        e.preventDefault();
        errorMessage.textContent = "Invalid password format";
        return;
    }

    if (!validateEmail(email)) {
        e.preventDefault();
        errorMessage.textContent = "Email must be valid and end with .com";
        return;
    }

    if (!validateMobile(mobile)) {
        e.preventDefault();
        errorMessage.textContent = "Mobile number must be exactly 10 digits";
        return;
    }

    if (!role) {
        e.preventDefault();
        errorMessage.textContent = "Please select a role";
        return;
    }

    // ✅ If all validations pass, form submits normally
});

// ✅ End of script
// Global Execution Context remains in memory until page is closed or reloaded.
