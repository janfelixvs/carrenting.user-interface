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
      const currentTableBody = document
        .getElementById("currentReservationsTable")
        .querySelector("tbody");
      const pastTableBody = document
        .getElementById("pastReservationsTable")
        .querySelector("tbody");

      // Leeren Sie beide Tabellenkörper, bevor Sie neue Daten hinzufügen
      currentTableBody.innerHTML = "";
      pastTableBody.innerHTML = "";
      console.log("test");

      data.forEach((reservation) => {
        let tableBody;
        const endDate = new Date(reservation.endDate);

        // Überprüfen Sie, ob das Enddatum in der Vergangenheit liegt
        console.log(endDate);
        console.log(new Date());
        if (endDate < new Date()) {
          // Fügen Sie es in die Tabelle für vergangene Reservierungen ein
          tableBody = pastTableBody;
        } else {
          // Fügen Sie es in die Tabelle für aktuelle Reservierungen ein
          tableBody = currentTableBody;
        }

        const row = tableBody.insertRow();
        const cellStartDate = row.insertCell(0); // Startdatum an der ersten Position
        const cellEndDate = row.insertCell(1); // Enddatum an der zweiten Position
        const cellCarNumber = row.insertCell(2); // Fahrzeugnummer an der dritten Position

        cellStartDate.textContent = reservation.startDate
          ? new Date(reservation.startDate).toLocaleString("de-DE")
          : "N/A";
        cellEndDate.textContent = reservation.endDate
          ? new Date(reservation.endDate).toLocaleString("de-DE")
          : "N/A";
        cellCarNumber.textContent = reservation.carID || "N/A"; // Fahrzeugnummer hier
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

loadReservations();
