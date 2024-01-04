// Function to sign up a new user
function signUp() {
    var firstName = document.getElementById('first-name').value;
    var lastName = document.getElementById('last-name').value;
    var newEmail = document.getElementById('new-email').value;
    var newPassword = document.getElementById('new-password').value;

    // Constructing the request payload
    var payload = {
        firstName: firstName,
        lastName: lastName,
        email: newEmail,
        password: newPassword
    };

    // Sending a POST request to the signup endpoint
    fetch('http://localhost:8082/api/customer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Signup failed');
            }
        })
        .then(data => {
            console.log('Signup successful:', data);
            showBanner('Signup successful!', true);
        })
        .catch((error) => {
            console.error('Error:', error);
            showBanner('Signup failed: ' + error.message, false);
        });
}

// Add click event listener to the signup button
//document.querySelector('.create-account').addEventListener('click', signUp);

// Function to log in a user
function login() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    // Constructing the request payload
    var payload = {
        email: email,
        password: password
    };

    // Sending a POST request to the login endpoint
    fetch('http://localhost:8082/api/customer/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Login failed');
            }
        })
        .then(data => {
            console.log('Login successful:', data);
            window.location.href = '../logged/logged.html';
        })
        .catch((error) => {
            console.error('Error:', error);
            showBanner(error.message + ': E-Mail or Password incorrect', false);
        });
}

function showBanner(message, isSuccess) {
    var banner = document.getElementById('notification-banner');
    banner.style.backgroundColor = isSuccess ? '#4CAF50' : '#f44336'; // Green for success, red for failure
    banner.textContent = message;
    banner.style.display = 'block';

    // Automatically hide the banner after 3 seconds
    setTimeout(function () {
        banner.style.display = 'none';
    }, 3000);
}

