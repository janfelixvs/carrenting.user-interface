"use strict"

/* ==================== Variables ==================== */

var stompClient = null;

/* ==================== EventListener ==================== */

document.addEventListener("DOMContentLoaded", (event) => {
  updateCustomerName();
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

function logout() {
  if (stompClient !== null) {
    stompClient.disconnect();
    console.log("Disconnected");
  }
  window.location.href = "../welcome/welcome.html";
}

/* -------------------- Home -------------------- */

function showHome() {
  document.querySelector('.home-menu').style.display = 'block';
}

/* -------------------- Reservation -------------------- */

function showReservation() {
  //loadReservations();
  document.querySelector('.reservation-menu').style.display = 'block';
}

/* function loadReservations() {
  fetch("http://localhost:8081/api/employee/reservation")
    .then((response) => response.json())
    .then((data) => {
      const currentReservationsTableBody = document
        .getElementById("currentReservationsTable")
        .querySelector("tbody");
      const pastReservationsTableBody = document
        .getElementById("pastReservationsTable")
        .querySelector("tbody");

      // Leeren Sie beide Tabellenkörper, bevor Sie neue Daten hinzufügen
      currentReservationsTableBody.innerHTML = "";
      pastReservationsTableBody.innerHTML = "";

      data.forEach((reservation) => {
        let tableBody;
        const endDate = new Date(reservation.endDate);

        // Überprüfen Sie, ob das Enddatum in der Vergangenheit liegt
        if (endDate < new Date()) {
          // Fügen Sie es in die Tabelle für vergangene Reservierungen ein
          tableBody = pastReservationsTableBody;
        } else {
          // Fügen Sie es in die Tabelle für aktuelle Reservierungen ein
          tableBody = currentReservationsTableBody;
        }

        const row = tableBody.insertRow();
        const cellCarID = row.insertCell(0);
        const cellStartDate = row.insertCell(1);
        const cellEndDate = row.insertCell(2);

        cellCarID.textContent = reservation.carID || "N/A";
        cellStartDate.textContent = reservation.startDate
          ? new Date(reservation.startDate).toLocaleString("de-DE")
          : "N/A";
        cellEndDate.textContent = reservation.endDate
          ? new Date(reservation.endDate).toLocaleString("de-DE")
          : "N/A";
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
} */

/* document
  .getElementById("addReservationForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const customerID = document.getElementById("customerID").value;
    const carID = document.getElementById("carID").value;

    fetch("http://localhost:8083/api/reservation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startDate,
        endDate,
        customerID,
        carID,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        loadReservations();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }); */

/* -------------------- Account -------------------- */

function showAccount() {
  document.querySelector('.account-menu').style.display = 'block';
}

document
  .getElementById("change-mail-button")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    var oldEmail = document.getElementById("oldEmail").value;
    var newEmail = document.getElementById("newEmail").value;

    updateEmail(oldEmail, newEmail);
  });

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
        // Handle successful email update
      } else {
        throw new Error("Email update failed");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      // Handle errors here
    });
}

document
  .getElementById("changePasswordForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    var email = document.getElementById("email").value;
    var oldPassword = document.getElementById("oldPassword").value;
    var newPassword = document.getElementById("newPassword").value;

    changePassword(email, oldPassword, newPassword);
  });

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
        // Handle successful password change
      } else {
        throw new Error("Password change failed");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      // Handle errors here
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
        // Handle successful account deletion
      } else {
        throw new Error("Account deletion failed");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      // Handle errors here
    });
}

/* -------------------- Cookies -------------------- */

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

document.addEventListener("DOMContentLoaded", (event) => {
  loadReservations();
  updateCustomerName();

  // Nehmen Sie an, dass die Kunden-ID verfügbar ist (z.B. aus einer Session oder einem Login-System)
  // Dies sollte durch Ihre eigene Logik ersetzt werden, um die Kunden-ID des aktuellen Benutzers zu erhalten
  var customerId = document.getElementById("customerID").value;

  connectWebSocket(getCookie("customerId"));
});

function updateCustomerName() {
  var customerId = getCookie("customerId"); // Annahme, dass die Kunden-ID im Cookie 'customerId' gespeichert ist
  if (customerId) {
    document.getElementById("customerName").textContent = "Customer ID: " + customerId;
  } else {
    document.getElementById("customerName").textContent = "Unbekannter Nutzer";
  }
}

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
