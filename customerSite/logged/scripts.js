"use strict"

/* ==================== Variables ==================== */

var stompClient = null;

/* ==================== EventListener ==================== */


// Start der Seite - was soll geleaden werden
document.addEventListener("DOMContentLoaded", (event) => {

  updateCustomerName();

  var customerId = getCookie("customerId");
  connectWebSocket(getCookie("customerId"));
});

document.getElementById("homeLink").addEventListener('click', function (event) {
  event.preventDefault();
  hideAllTables();
  showHome();
});

document.getElementById("reservationLink").addEventListener('click', function (event) {
  event.preventDefault();
  hideAllTables();
  showReservation();
});

document.getElementById("accountLink").addEventListener('click', function (event) {
  event.preventDefault();
  hideAllTables();
  showAccount();
});

document.getElementById("updateEmailForm").addEventListener("submit", function (event) {
  event.preventDefault();
  var oldEmail = document.getElementById("oldEmail").value;
  var newEmail = document.getElementById("newEmail").value;
  updateEmail(oldEmail, newEmail);
});

document
  .getElementById("changePasswordForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    var email = document.getElementById("email").value;
    var oldPassword = document.getElementById("oldPassword").value;
    var newPassword = document.getElementById("newPassword").value;
    changePassword(email, oldPassword, newPassword);
  });

document.getElementById("deleteAccountForm").addEventListener("submit", function (event) {
  event.preventDefault();
  var mail = document.getElementById("deleteEmail").value;
  var pass = document.getElementById("deletePassword").value;
  deleteAccount(mail, pass);
});

document.getElementById("createReservationForm").addEventListener("submit", function (event) {
  event.preventDefault();
  var carId = document.getElementById("carSelect").value;
  var startTime = document.getElementById("startTime").value;
  var endTime = document.getElementById("endTime").value;
  createReservation(carId, startTime, endTime);
});


/* ==================== Functions ==================== */

/* -------------------- other fuctions -------------------- */

function toggleSidebar() {
  document.querySelector('.main-area').classList.toggle('sidebar-hidden');
}

function hideAllTables() {
  document.querySelector('.home-menu').style.display = 'none';
  document.querySelector('.reservation-menu').style.display = 'none';
  document.querySelector('.account-menu').style.display = 'none';
}

function updateCustomerName() {
  var customerId = getCookie("customerId"); // Annahme, dass die Kunden-ID im Cookie 'customerId' gespeichert ist
  if (customerId) {
    document.getElementById("customerName").textContent = "Customer ID: " + customerId;
  } else {
    document.getElementById("customerName").textContent = "Unbekannter Nutzer";
  }
}

function logout() {
  if (stompClient !== null) {
    stompClient.disconnect();
    console.log("Disconnected");
  }
  deleteCookie("customerId");
  window.location.href = "../welcome/welcome.html";
}

/* -------------------- Cookies -------------------- */

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

function deleteCookie(name) {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
}

/* -------------------- Websocket Verbindung -------------------- */

function connectWebSocket(customerId) {
  var socket = new SockJS("http://localhost:8085/websocket");
  stompClient = Stomp.over(socket);
  stompClient.connect({}, function (frame) {
    console.log("Connected: " + frame);
    stompClient.subscribe("/topic/messages/" + customerId, function (message) {
      alert("Neue Nachricht: " + message.body);
    });
  });
}


/* -------------------- Home -------------------- */

function showHome() {
  document.querySelector('.home-menu').style.display = 'block';
}

/* -------------------- Reservation -------------------- */



function showReservation() {
  fetchAvailableCars();
  //loadReservations();

  //document.querySelector('.reservation-menu').style.display = 'block';
  // Make an API call to fetch reservations based on the user's ID
  var customerId = getCookie("customerId");

  fetch(`http://localhost:8082/api/customer/reservation/user/${customerId}`)
    .then((response) => response.json())
    .then((reservations) => {
      // Populate the reservation table with the received data
      populateReservationTable(reservations);

      // Make an API call to fetch available cars
      fetch(`http://localhost:8082/api/customer/reservation/availableVehicle`)
        .then((response) => response.json())
        .then((availableCars) => {
          // Populate the available cars table with the received data
          populateAvailableCarsTable(availableCars);

          // Display the reservation menu
          document.querySelector('.reservation-menu').style.display = 'block';
        })
        .catch((error) => {
          console.error("Error fetching available cars:", error);
        });
    })
    .catch((error) => {
      console.error("Error fetching reservations:", error);
    });
}

function populateAvailableCarsTable(availableCars) {
  var tableBody = document.getElementById("available-cars").getElementsByTagName('tbody')[0];
  tableBody.innerHTML = ""; // Clear existing rows

  availableCars.forEach(function (car) {
    var row = tableBody.insertRow();
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);

    cell1.innerHTML = car.carID;
    cell2.innerHTML = car.brand; // Populate with brand
    cell3.innerHTML = car.model; // Populate with model
  });
}

function populateReservationTable(reservations) {
  var tableBody = document.getElementById("currentReservationsTable").getElementsByTagName('tbody')[0];
  tableBody.innerHTML = "";  // Clear existing rows

  reservations.forEach(function (reservation) {
    var row = tableBody.insertRow();
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3); // New cell for delete button

    cell1.innerHTML = reservation.carID;
    cell2.innerHTML = reservation.startDate;
    cell3.innerHTML = reservation.endDate;

    // Create a delete button
    var deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";
    deleteButton.className = "delete-reservation-button";
    deleteButton.onclick = function () {
      deleteReservation(reservation.reservationID); // Assuming each reservation has a unique 'id'
    };
    cell4.appendChild(deleteButton);
  });
}

function deleteReservation(reservationId) {
  // Make an API call to delete the reservation
  fetch(`http://localhost:8082/api/customer/reservation/${reservationId}`, {
    method: "DELETE"
  })
    .then((response) => {
      if (response.ok) {
        console.log("Reservation deleted");
        showReservation(); // Ruft die Funktion auf, um die Tabelle zu aktualisieren
      } else {
        console.error("Failed to delete reservation");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

/* -------------------- Account -------------------- */

function showAccount() {
  document.querySelector('.account-menu').style.display = 'block';
}

function updateEmail(oldEmail, newEmail) {
  var payload = {
    oldEmail: oldEmail,
    newEmail: newEmail,
  };

  fetch(`http://localhost:8082/api/customer/update-email`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (response.ok) {
        showBanner("change successful!", true);
      } else {
        showBanner(error.message + ": something went wrong", false);
        throw new Error("Email update failed");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      showBanner(error.message + ": something went wrong", false);
    });
}

function changePassword(email, oldPassword, newPassword) {
  var payload = {
    email: email,
    oldPassword: oldPassword,
    newPassword: newPassword,
  };

  fetch(`http://localhost:8082/api/customer/change-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (response.ok) {
        showBanner("change successful!", true);
      } else {
        showBanner(error.message + ": something went wrong", false);
        throw new Error("Password change failed");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      showBanner(error.message + ": something went wrong", false);
    });
}

function deleteAccount(email, password) {
  var payload = {
    email: email,
    password: password,
  };

  fetch("http://localhost:8082/api/customer/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (response.ok) {
        logout();
      } else {
        throw new Error("Account deletion failed");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      showBanner(error.message + ": Email or Password wrong", false);
    });
}

/* -------------------- Banner -------------------- */

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

function createReservation(carId, startTime, endTime) {
  var customerId = getCookie("customerId");
  var reservationData = {
    reservationID: null, // Assuming the server assigns this
    startDate: startTime,
    endDate: endTime,
    customerID: customerId,
    carID: carId
  };

  fetch(`http://localhost:8082/api/customer/reservation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reservationData)
  })
    .then((response) => {
      if (response.ok) {
        showBanner("Reservation successful!", true);
        showReservation(); // Reload reservations
      } else {
        throw new Error("Reservation failed");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      showBanner(error.message + ": Reservation failed", false);
    });
}

function fetchAvailableCars() {
  fetch(`http://localhost:8082/api/customer/reservation/availableVehicle`)
    .then((response) => response.json())
    .then((cars) => {
      const carSelect = document.getElementById("carSelect");
      let options = cars.map(car => `<option value="${car.carID}">${car.carID}</option>`).join('');
      carSelect.innerHTML = options;
    })
    .catch((error) => {
      console.error("Error fetching cars:", error);
    });
}

