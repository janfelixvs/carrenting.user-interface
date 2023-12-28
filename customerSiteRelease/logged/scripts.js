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
document.addEventListener("DOMContentLoaded", (event) => {
  loadReservations();
});
