"use strict"

/* ==================== Variables ==================== */

var stompClient = null;
var carStatusChart = null;

/* ==================== EventListener ==================== */

document.addEventListener("DOMContentLoaded", (event) => {
    updateEmployeeName();
    updateDashboardData();

    document.getElementById("DashboardLink").addEventListener('click', function (event) {
        event.preventDefault();
        hideAllTables();
        showDashboard();
        updateDashboardData();
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

    document.getElementById("notifyLink").addEventListener('click', function (event) {
        event.preventDefault();
        hideAllTables();
        showNotify();
        fetchCustomersAndPopulateDropdown();
    });

    document.getElementById("reportLink").addEventListener('click', function (event) {
        event.preventDefault();
        hideAllTables();
        showReport();
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
    document.querySelector('.notify').style.display = 'none';
    document.querySelector('.report').style.display = 'none';
}

/* -------------------- Dashboard -------------------- */

function showDashboard() {
    document.querySelector('.dashboard').style.display = 'block';
}

function updateDashboardData() {
    Promise.all([
        fetch('http://localhost:8081/api/employee/reservation').then(res => res.json()),
        fetch('http://localhost:8081/api/employee/maintenance/all').then(res => res.json()),
        fetch('http://localhost:8081/api/employee/reservation/availableVehicle').then(res => res.json())
    ]).then(([reservations, maintenances, availableCars]) => {
        const reservedCount = reservations.length;
        const maintenanceCount = maintenances.length;
        const availableCount = availableCars.length;

        renderPieChart(reservedCount, maintenanceCount, availableCount);
    }).catch(error => console.error('Error:', error));
}

function renderPieChart(reservedCount, maintenanceCount, availableCount) {
    const ctx = document.getElementById('carStatusChart').getContext('2d');

    // Destroy the existing chart instance if it exists
    if (carStatusChart != null) {
        carStatusChart.destroy();
    }

    // Create a new chart instance
    carStatusChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Reserved', 'In Maintenance', 'Available'],
            datasets: [{
                label: 'Car Status',
                data: [reservedCount, maintenanceCount, availableCount],
                backgroundColor: [
                    'rgba(0, 128, 0, 0.2)', // Green
                    'rgba(0, 0, 0, 0.2)',   // Black 
                    'rgba(255, 255, 255, 0.2)'  // White
                ],
                borderColor: [
                    'rgba(0, 128, 0, 1)', // Green 
                    'rgba(0, 0, 0, 1)',   // Black
                    'rgba(255, 255, 255, 1)'  // White
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: 'white' // legend text color white
                    }
                }
            }
        }
    });
}

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
            showBanner('Car added successfully', true);
            document.getElementById('addCarForm').reset();
            fetchCarData();
        })
        .catch(error => {
            console.error('Error adding new car:', error);
            showBanner('Failed to add car', false);
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
    fetch('http://localhost:8081/api/employee/car')
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
    table.innerHTML = "";

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
        deleteButton.classList.add("delete-button");
        deleteButton.onclick = function () { deleteCar(car.licensePlate); };
        deleteCell.appendChild(deleteButton);
    });
}



function deleteCar(licensePlate) {
    fetch(`http://localhost:8081/api/employee/car/${licensePlate}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return null;
        })
        .then(data => {
            showBanner('Car deleted successfully', true);
            fetchCarData();
        })
        .catch(error => {
            console.error('Error:', error);
            showBanner('Failed to delete car', false);
        });
}




/* -------------------- Customer -------------------- */

function showCustomerTable() {
    fetchCustomerData();
    document.querySelector('.customer-table').style.display = 'block';
}

function fetchCustomerData() {
    fetch('http://localhost:8081/api/employee/customer')
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
    table.innerHTML = "";

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
        passwordCell.textContent = customer.password;
    });
}

/* -------------------- GPS -------------------- */

function showGpsTable() {
    fetchGpsData();
    document.querySelector('.gps-table').style.display = 'block';
}

function fetchGpsData() {
    fetch('http://localhost:8081/api/employee/gps/current')
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
    table.innerHTML = "";

    gpsData.forEach(function (gps) {
        var row = table.insertRow();
        var trackingIdCell = row.insertCell(0);
        var carIdCell = row.insertCell(1);
        var timestampCell = row.insertCell(2);
        var locationCell = row.insertCell(3);

        trackingIdCell.textContent = gps.trackingId;
        carIdCell.textContent = gps.carId;
        timestampCell.textContent = gps.timestamp;
        locationCell.textContent = gps.location;
    });
}

/* -------------------- Maintenance -------------------- */

function scheduleMaintenance() {
    const carId = document.getElementById('maintenanceCarId').value;
    const startDate = document.getElementById('maintenanceStartDate').value;
    const endDate = document.getElementById('maintenanceEndDate').value;
    const status = document.getElementById('maintenanceStatus').value;
    const maintenanceData = {
        carID: parseInt(carId),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: status
    };


    postMaintenanceData(maintenanceData)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            showBanner('Maintenance scheduled successfully', true);
            document.getElementById('scheduleMaintenanceForm').reset();
            showMaintenanceTable();
        })
        .catch(error => {
            console.error('Error scheduling maintenance:', error);
            showBanner('Failed to schedule maintenance', false);

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
    fetchAvailableCarsForMaintenance(); // New function to populate dropdown
    document.querySelector('.maintenance-table').style.display = 'block';
}

function fetchAvailableCarsForMaintenance() {
    fetch('http://localhost:8081/api/employee/reservation/availableVehicle')
        .then(response => response.json())
        .then(cars => {
            const dropdown = document.getElementById('maintenanceCarId');
            dropdown.innerHTML = '<option value="">Select a Car</option>'; // Reset dropdown
            cars.forEach(car => {
                let option = document.createElement('option');
                option.value = car.carID;
                option.text = `${car.brand} ${car.model} (ID: ${car.carID})`;
                dropdown.appendChild(option);
            });
        })
        .catch(error => console.error('Error:', error));
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
    table.innerHTML = "";

    maintenances.forEach(function (maintenance) {
        var row = table.insertRow();

        var maintenanceIdCell = row.insertCell(0);
        maintenanceIdCell.textContent = maintenance.maintenanceID;

        var carIdCell = row.insertCell(1);
        carIdCell.textContent = maintenance.carID;

        var startDateCell = row.insertCell(2);
        startDateCell.textContent = maintenance.startDate;

        var endDateCell = row.insertCell(3);
        endDateCell.textContent = maintenance.endDate;

        var statusCell = row.insertCell(4);
        statusCell.textContent = maintenance.status;

        var deleteCell = row.insertCell(5);
        var deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-button");
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
            fetchMaintenanceData();
        })
        .catch(error => console.error('Error deleting maintenance:', error));
}

/* -------------------- Reservations -------------------- */

function showReservationTable() {
    fetchReservationData();
    document.querySelector('.reservations-table').style.display = 'block';
}

function fetchReservationData() {
    fetch('http://localhost:8081/api/employee/reservation')
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
    table.innerHTML = "";

    reservations.forEach(function (reservation) {
        var row = table.insertRow();
        var reservationIdCell = row.insertCell(0);
        var startDateCell = row.insertCell(1);
        var endDateCell = row.insertCell(2);
        var customerIdCell = row.insertCell(3);
        var carIdCell = row.insertCell(4);

        reservationIdCell.textContent = reservation.reservationID;
        startDateCell.textContent = reservation.startDate;
        endDateCell.textContent = reservation.endDate;
        customerIdCell.textContent = reservation.customerID;
        carIdCell.textContent = reservation.carID;

        // Add delete button
        var deleteCell = row.insertCell(5);
        var deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-button');
        deleteButton.onclick = function () { deleteReservation(reservation.reservationID); };
        deleteCell.appendChild(deleteButton);
    });
}

function deleteReservation(reservationId) {
    fetch(`http://localhost:8081/api/employee/reservation/${reservationId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            showBanner('Reservation deleted successfully', true);
            fetchReservationData(); // Refresh the reservation table
        })
        .catch(error => {
            console.error('Error:', error);
            showBanner('Failed to delete reservation', false);
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

/* -------------------- Notify -------------------- */

function showNotify() {
    document.querySelector('.notify').style.display = 'block';
}

function fetchCustomersAndPopulateDropdown() {
    fetch('http://localhost:8081/api/employee/customer')
        .then(response => response.json())
        .then(customers => {
            const dropdown = document.getElementById('customerDropdown');
            customers.forEach(customer => {
                let option = document.createElement('option');
                option.value = customer.customerId; // Access the correct property here
                option.text = `Customer ID: ${customer.customerId}`; // And here
                dropdown.appendChild(option);
            });
        })
        .catch(error => console.error('Error:', error));
}


function sendMessage() {
    const customerId = document.getElementById('customerDropdown').value;
    const messageText = document.getElementById('messageText').value;

    fetch('http://localhost:8081/api/employee/sendMessage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId, messageText }),
    })
        .then(response => {
            if (response.ok) {
                showBanner('Message sent successfully', true);
            } else {
                throw new Error('Failed to send message');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showBanner(error.message, false);
        });
}

/* -------------------- Report -------------------- */

function showReport() {
    document.querySelector('.report').style.display = 'block';
}

function downloadReport() {
    var reportType = document.getElementById("reportType").value;
    fetch(`http://localhost:8081/api/employee/exportData?reportType=${reportType}`)
        .then(response => response.text())
        .then(data => {
            var a = document.createElement("a");
            a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(data);
            a.download = `${reportType}-Report.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        })
        .catch(error => console.error('Error:', error));
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
    banner.style.backgroundColor = isSuccess ? "#4CAF50" : "#f44336";
    banner.textContent = message;
    banner.style.display = "block";

    setTimeout(function () {
        banner.style.display = "none";
    }, 3000);
}
