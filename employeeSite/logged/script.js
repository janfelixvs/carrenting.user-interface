"use strict"

/* ==================== Variables ==================== */

var stompClient = null;

var exampleCars = [
    { make: 'Toyota', model: 'Corolla', year: 2020, color: 'Red' },
    { make: 'Honda', model: 'Civic', year: 2019, color: 'Blue' },
];

/* ==================== EventListener ==================== */

document.addEventListener("DOMContentLoaded", (event) => {
    updateEmployeeName();

    document.getElementById("DashboardLink").addEventListener('click', function (event) {
        event.preventDefault();
        hideAllTables();
        showDashboard();
    });

    document.getElementById("carsLink").addEventListener('click', function (event) {
        event.preventDefault();
        hideAllTables();
        showCarTable();
    });

    document.getElementById("addCarForm").addEventListener('submit', function (event) {
        event.preventDefault();
        addNewCarToFleet();
    });

    document.getElementById("customersLink").addEventListener('click', function (event) {
        event.preventDefault();
        hideAllTables();
        showCustomerTable();
    });

    document.getElementById("gps-trackingLink").addEventListener('click', function (event) {
        event.preventDefault();
        hideAllTables();
        showGpsTable();
    });


    document.getElementById("maintenanceLink").addEventListener('click', function (event) {
        event.preventDefault();
        hideAllTables();
        showMaintenanceTable();
    });

    document.getElementById("scheduleMaintenanceForm").addEventListener('submit', function (event) {
        event.preventDefault();
        scheduleMaintenance();
    });

    document.getElementById("reservationsLink").addEventListener('click', function (event) {
        event.preventDefault();
        hideAllTables();
        showReservationTable();
    });

});

/* ==================== Functions ==================== */

/* -------------------- other fuctions -------------------- */

function toggleSidebar() {
    document.querySelector('.main-area').classList.toggle('sidebar-hidden');
}

function hideAllTables() {
    document.querySelector('.dashboard').style.display = 'none';
    document.querySelector('.car-table').style.display = 'none';
    document.querySelector('.customer-table').style.display = 'none';
    document.querySelector('.gps-table').style.display = 'none';
    document.querySelector('.maintenance-table').style.display = 'none';
    document.querySelector('.reservations-table').style.display = 'none';
}

/* -------------------- Dashboard -------------------- */

function showDashboard() {
    document.querySelector('.dashboard').style.display = 'block';
}

// Example data
let carData = {
    rented: 50, // Number of cars currently rented
    available: 100, // Number of cars available for rent
    maintenance: 20 // Number of cars in maintenance
};

document.addEventListener("DOMContentLoaded", function () {
    var ctx = document.getElementById('carStatusChart').getContext('2d');
    var carStatusChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Available', 'Rented', 'Maintenance'],
            datasets: [{
                label: 'Car Status',
                data: [carData.available, carData.rented, carData.maintenance],
                backgroundColor: [
                    'white',
                    'green',
                    'black'
                ],
                borderColor: [
                    'black', // Add border color if white is not visible
                    'black',
                    'black'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true
        }
    });
});

/* -------------------- Cars -------------------- */

function addNewCarToFleet() {
    const model = document.getElementById('model').value;
    const brand = document.getElementById('brand').value;
    const mileage = document.getElementById('mileage').value;
    const licensePlate = document.getElementById('licensePlate').value;

    const newCar = { model, brand, mileage, licensePlate };

    postNewCarData(newCar)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            showBanner('Car added successfully', true); // Show success banner
            // Clear the form
            document.getElementById('addCarForm').reset();
            // Optionally refresh the car list
            fetchCarData();
        })
        .catch(error => {
            console.error('Error adding new car:', error);
            showBanner('Failed to add car', false); // Show error banner
        });
}

function postNewCarData(car) {
    return fetch('http://localhost:8081/api/employee/car', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(car),
    });
}

function showCarTable() {
    fetchCarData();
    document.querySelector('.car-table').style.display = 'block';
}

function fetchCarData() {
    fetch('http://localhost:8081/api/employee/car') // endpoint updated
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => populateCarTable(data))
        .catch(error => console.error('Fetch operation error:', error));
}

function populateCarTable(cars) {
    var table = document.getElementById("carsTable").getElementsByTagName('tbody')[0];
    table.innerHTML = ""; // Clear existing table rows

    cars.forEach(function (car) {
        var row = table.insertRow();
        var carIdCell = row.insertCell(0);
        var modelCell = row.insertCell(1);
        var brandCell = row.insertCell(2);
        var mileageCell = row.insertCell(3);
        var licensePlateCell = row.insertCell(4);


        carIdCell.textContent = car.carID;
        modelCell.textContent = car.model;
        brandCell.textContent = car.brand;
        mileageCell.textContent = car.mileage;
        licensePlateCell.textContent = car.licensePlate;

        var deleteCell = row.insertCell(5);
        var deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = function () { deleteCar(car.licensePlate); };
        deleteCell.appendChild(deleteButton);
    });
}


function deleteCar(carId) {
    fetch(`http://localhost:8081/api/employee/car/${carId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Assuming the response is JSON
        })
        .then(data => {
            showBanner('Car deleted successfully', true); // Show success banner
            fetchCarData(); // Refresh the car data after deletion
        })
        .catch(error => {
            console.error('Error:', error);
            showBanner('Failed to delete car', false); // Show error banner
        });
}




/* -------------------- Customer -------------------- */

function showCustomerTable() {
    fetchCustomerData();
    document.querySelector('.customer-table').style.display = 'block';
}

function fetchCustomerData() {
    fetch('http://localhost:8081/api/employee/customer') // Adjust the endpoint as needed
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => populateCustomerTable(data))
        .catch(error => console.error('Fetch operation error:', error));
}

function populateCustomerTable(customers) {
    var table = document.getElementById("customerTable").getElementsByTagName('tbody')[0];
    table.innerHTML = ""; // Clear existing table rows

    customers.forEach(function (customer) {
        var row = table.insertRow();
        var customerIdCell = row.insertCell(0);
        var firstNameCell = row.insertCell(1);
        var lastNameCell = row.insertCell(2);
        var emailCell = row.insertCell(3);
        var passwordCell = row.insertCell(4);

        customerIdCell.textContent = customer.customerId;
        firstNameCell.textContent = customer.firstName;
        lastNameCell.textContent = customer.lastName;
        emailCell.textContent = customer.email;
        passwordCell.textContent = customer.password; // Consider security implications
    });
}

/* -------------------- GPS -------------------- */

function showGpsTable() {
    fetchGpsData();
    document.querySelector('.gps-table').style.display = 'block';
}

function fetchGpsData() {
    fetch('http://localhost:8081/api/employee/gps/current') // Adjust the endpoint as needed
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => populateGpsTable(data))
        .catch(error => console.error('Fetch operation error:', error));
}

function populateGpsTable(gpsData) {
    var table = document.getElementById("gpsTable").getElementsByTagName('tbody')[0];
    table.innerHTML = ""; // Clear existing table rows

    gpsData.forEach(function (gps) {
        var row = table.insertRow();
        var trackingIdCell = row.insertCell(0);
        var carIdCell = row.insertCell(1);
        var timestampCell = row.insertCell(2);
        var locationCell = row.insertCell(3);

        trackingIdCell.textContent = gps.trackingId;
        carIdCell.textContent = gps.carId;
        timestampCell.textContent = gps.timestamp; // Format date if necessary
        locationCell.textContent = gps.location;
    });
}

/* -------------------- Maintenance -------------------- */

function scheduleMaintenance() {
    const carId = document.getElementById('maintenanceCarId').value;
    const startDate = document.getElementById('maintenanceStartDate').value;
    const endDate = document.getElementById('maintenanceEndDate').value;

    const maintenanceData = {
        carID: parseInt(carId),
        startDate: new Date(startDate),
        endDate: new Date(endDate)
        //status: 'Scheduled'
    };

    postMaintenanceData(maintenanceData)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            showBanner('Maintenance scheduled successfully', true); // Show success banner
            // Clear the form
            document.getElementById('scheduleMaintenanceForm').reset();
            showMaintenanceTable();
        })
        .catch(error => {
            console.error('Error scheduling maintenance:', error);
            showBanner('Failed to schedule maintenance', false); // Show error banner

        });
}


function postMaintenanceData(maintenance) {
    return fetch('http://localhost:8081/api/employee/maintenance', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(maintenance),
    });
}


function showMaintenanceTable() {
    fetchMaintenanceData();
    document.querySelector('.maintenance-table').style.display = 'block';
}

function fetchMaintenanceData() {
    fetch('http://localhost:8081/api/employee/maintenance/all')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => populateMaintenanceTable(data))
        .catch(error => console.error('Fetch operation error:', error));
}

function populateMaintenanceTable(maintenances) {
    var table = document.getElementById("maintenanceTable").getElementsByTagName('tbody')[0];
    table.innerHTML = ""; // Clear existing table rows

    maintenances.forEach(function (maintenance) {
        var row = table.insertRow();

        // Maintenance ID Cell
        var maintenanceIdCell = row.insertCell(0);
        maintenanceIdCell.textContent = maintenance.maintenanceID;

        // Car ID Cell
        var carIdCell = row.insertCell(1);
        carIdCell.textContent = maintenance.carID;

        // Start Date Cell
        var startDateCell = row.insertCell(2);
        startDateCell.textContent = maintenance.startDate;

        // End Date Cell
        var endDateCell = row.insertCell(3);
        endDateCell.textContent = maintenance.endDate;

        // Status Cell
        var statusCell = row.insertCell(4);
        statusCell.textContent = maintenance.status;

        // Delete Button Cell
        var deleteCell = row.insertCell(5);
        var deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = function () { deleteMaintenance(maintenance.maintenanceID); };
        deleteCell.appendChild(deleteButton);
    });
}

function deleteMaintenance(maintenanceId) {
    fetch(`http://localhost:8081/api/employee/maintenance/delete/${maintenanceId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            fetchMaintenanceData(); // Refresh the table
        })
        .catch(error => console.error('Error deleting maintenance:', error));
}

/* -------------------- Reservations -------------------- */

function showReservationTable() {
    fetchReservationData();
    document.querySelector('.reservations-table').style.display = 'block';
}

function fetchReservationData() {
    fetch('http://localhost:8081/api/employee/reservation') // Adjust the endpoint as needed
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => populateReservationTable(data))
        .catch(error => console.error('Fetch operation error:', error));
}

function populateReservationTable(reservations) {
    var table = document.getElementById("reservationTable").getElementsByTagName('tbody')[0];
    table.innerHTML = ""; // Clear existing table rows

    reservations.forEach(function (reservation) {
        var row = table.insertRow();
        var reservationIdCell = row.insertCell(0);
        var startDateCell = row.insertCell(1);
        var endDateCell = row.insertCell(2);
        var customerIdCell = row.insertCell(3);
        var carIdCell = row.insertCell(4);

        reservationIdCell.textContent = reservation.reservationID;
        startDateCell.textContent = reservation.startDate; // Format date if necessary
        endDateCell.textContent = reservation.endDate; // Format date if necessary
        customerIdCell.textContent = reservation.customerID;
        carIdCell.textContent = reservation.carID;
    });
}

/* -------------------- Cookies -------------------- */

function updateEmployeeName() {
    var employeeID = getCookie("employeeID");
    if (employeeID) {
        document.getElementById("employeeID").textContent = "Employee ID: " + employeeID;
    } else {
        document.getElementById("employeeID").textContent = "Unbekannter Nutzer";
    }
}

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

/* -------------------- Logout -------------------- */

function logout() {
    if (stompClient !== null) {
        stompClient.disconnect();
        console.log("Disconnected");
    }
    window.location.href = "../welcome/welcome.html";
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
