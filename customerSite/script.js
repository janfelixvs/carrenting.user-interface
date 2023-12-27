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
      const tableBody = document
        .getElementById("reservationsTable")
        .querySelector("tbody");
      tableBody.innerHTML = "";
      data.forEach((reservation) => {
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

loadReservations();
