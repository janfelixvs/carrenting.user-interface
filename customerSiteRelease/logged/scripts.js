document
  .getElementById("addReservationForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const customerID = document.getElementById("customerID").value;
    const carID = document.getElementById("carID").value;

    fetch("http://localhost:8080/api/reservation", {
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
  });

document.getElementById("updateEmailForm").addEventListener("submit", function (event) {
  event.preventDefault();

  var oldEmail = document.getElementById("oldEmail").value;
  var newEmail = document.getElementById("newEmail").value;

  updateEmail(oldEmail, newEmail);
});

document.getElementById("changePasswordForm").addEventListener("submit", function (event) {
  event.preventDefault();

  var email = document.getElementById("email").value;
  var oldPassword = document.getElementById("oldPassword").value;
  var newPassword = document.getElementById("newPassword").value;

  changePassword(email, oldPassword, newPassword);
});


function loadReservations() {
  fetch("http://localhost:8080/api/reservation")
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
}

function updateEmail(oldEmail, newEmail) {
  var payload = {
    oldEmail: oldEmail,
    newEmail: newEmail
  };

  fetch(`http://localhost:8082/api/customer/update-email`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
    .then(response => {
      if (response.ok) {
        // Handle successful email update
      } else {
        throw new Error('Email update failed');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      // Handle errors here
    });
}

function changePassword(email, oldPassword, newPassword) {
  var payload = {
    email: email,
    oldPassword: oldPassword,
    newPassword: newPassword
  };

  fetch(`http://localhost:8082/api/customer/change-password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
    .then(response => {
      if (response.ok) {
        // Handle successful password change
      } else {
        throw new Error('Password change failed');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      // Handle errors here
    });
}

function deleteAccount(email, password) {
  var payload = {
    email: email,
    password: password
  };

  fetch('http://localhost:8082/api/customer/delete', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
    .then(response => {
      if (response.ok) {
        // Handle successful account deletion
      } else {
        throw new Error('Account deletion failed');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      // Handle errors here
    });
}

function logout() {
  // Redirect to the desired logout URL
  window.location.href = '../welcome/welcome.html'; // Replace with the path to your logout page
}

document.addEventListener("DOMContentLoaded", (event) => {
  loadReservations();
});
