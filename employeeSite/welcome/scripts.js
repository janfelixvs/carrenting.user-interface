// Function to sign up a new user

// Function to log in a user
// Funktion zum Setzen eines Cookies
function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Modifizierte Login-Funktion
function login() {
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;

  var payload = {
    email: email,
    password: password,
  };

  fetch("http://localhost:8081/api/employee/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Login failed");
      }
    })
    .then((data) => {
      console.log("Login successful:", data);
      // Setzen des Cookies mit der Kundennummer
      setCookie("employeeID", data.employeeID, 7); // Setzt den Cookie für 7 Tage
      window.location.href = "../logged/logged.html";
    })
    .catch((error) => {
      console.error("Error:", error);
      showBanner(error.message + ": E-Mail or Password incorrect", false);
    });
}


function showBanner(message, isSuccess) {
  var banner = document.getElementById("notification-banner");
  banner.style.backgroundColor = isSuccess ? "#4CAF50" : "#f44336"; // Green for success, red for failure
  banner.textContent = message;
  banner.style.display = "block";

  // Automatically hide the banner after 3 seconds
  setTimeout(function () {
    banner.style.display = "none";
  }, 3000);
}
