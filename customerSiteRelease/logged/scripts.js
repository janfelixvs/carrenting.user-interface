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

document.getElementById('deleteAccountForm').addEventListener('submit', function (event) {
  event.preventDefault(); // Prevent the form from submitting the default way

  var email = document.getElementById('deleteEmail').value;
  var password = document.getElementById('deletePassword').value;

  deleteAccount(email, password);
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

function deleteAccount(email, password) {
  // Construct the request payload
  var payload = {
    email: email,
    password: password
  };

  // Send a DELETE request to your API
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
        // Maybe redirect to home page or show a success message
      } else {
        throw new Error('Account deletion failed');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      // Handle errors here
      // Show an error message to the user
    });
}

function logout() {
  // Redirect to the desired logout URL
  window.location.href = '../welcome/welcome.html'; // Replace with the path to your logout page
}

document.addEventListener("DOMContentLoaded", (event) => {
  loadReservations();
});
