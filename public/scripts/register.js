
const inputs = document.querySelectorAll(".input");
const form = document.querySelector("#register-form");
const passwordInput = document.querySelector("#password");
const errorMessage = document.querySelector("#error-message"); // Ensure this exists in HTML: <div id="error-message" style="color: red;"></div>


function addcl() {
    let parent = this.parentNode.parentNode;
    parent.classList.add("focus");
}

function remcl() {
    let parent = this.parentNode.parentNode;
    if (this.value === "") {
        parent.classList.remove("focus");
    }
}

// Add event listeners for focus and blur to all inputs
inputs.forEach((input) => {
    input.addEventListener("focus", addcl);
    input.addEventListener("blur", remcl);
});

// Validation functions 
function validateUsername(username) {
    return /^[a-zA-Z0-9_-]{3,20}$/.test(username);
}

function validatePassword(password) {
    return /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/.test(password);
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // Updated to match server's emailRegex (allows any domain, not just .com)
}

function validateMobile(mobile) {
    return /^\d{10}$/.test(mobile);
}


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

        // Dynamically update error message in DOM
        if (errorMessage) {
            errorMessage.textContent = errorText;
            errorMessage.style.display = errorText ? 'block' : 'none';
        }
    });
});


form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent default form submission to handle asynchronously

    
    const username = form.querySelector("input[name='username']").value.trim();
    const password = passwordInput.value.trim();
    const email = form.querySelector("input[name='email']").value.trim();
    const mobile = form.querySelector("input[name='mobile']").value.trim();
    const role = form.querySelector("select[name='role']").value;

    // Client-side validation using DOM
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

    // Dynamically show error if validation fails
    if (errorText) {
        if (errorMessage) {
            errorMessage.textContent = errorText;
            errorMessage.style.display = 'block';
        } else {
            alert(errorText); 
        }
        return; 
    }

    // Clear error message if valid
    if (errorMessage) {
        errorMessage.textContent = "";
        errorMessage.style.display = 'none';
    }

    
    const data = { username, password, role, email, mobile };

    try {
        // Use fetch for asynchronous data handling to POST /register
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
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


inputs.forEach(input => {
    input.addEventListener('focus', function() {
        if (errorMessage) {
            errorMessage.textContent = "";
            errorMessage.style.display = 'none';
        }
    });
});