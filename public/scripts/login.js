
const inputs = document.querySelectorAll(".input");


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


inputs.forEach(input => {
    input.addEventListener("focus", addcl);
    input.addEventListener("blur", remcl);
});

// HTML for dynamic 
const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('error-message'); 


loginForm.addEventListener('submit', async function(event) {
    event.preventDefault(); 


    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const role = document.getElementById('role').value;

    // Client-side validation using DOM
    if (!username || !password || !role) {
        
        if (errorMessage) {
            errorMessage.textContent = 'Please fill all fields';
            errorMessage.style.display = 'block'; 
        } else {
            alert('Please fill all fields'); // Fallback to alert if no error element
        }
        return; 
    }

    
    if (errorMessage) {
        errorMessage.textContent = '';
        errorMessage.style.display = 'none';
    }

    
    const data = { username, password, role };

    try {
        // Use fetch for asynchronous data handling to POST /login
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        
        if (response.ok) {
           
            window.location.href = '/';
        } else {
            
            const errorData = await response.json();
            if (errorMessage) {
                errorMessage.textContent = errorData.error || 'Invalid credentials';
                errorMessage.style.display = 'block';
            } else {
                alert(errorData.error || 'Invalid credentials');
            }
        }
    } catch (error) {
        console.error('Login error:', error);
        if (errorMessage) {
            errorMessage.textContent = 'Server error during login';
            errorMessage.style.display = 'block';
        } else {
            alert('Server error during login');
        }
    }
});