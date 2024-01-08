
"use strict"

var stompClient = null;

document.addEventListener("DOMContentLoaded", (event) => {
    updateEmployeeName();
});

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

function addCar() {
    var marke = document.getElementById('marke').value;
    var modell = document.getElementById('modell').value;
    var kennzeichen = document.getElementById('kennzeichenEinfuegen').value;

    fetch('http://localhost:8080/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            marke: marke,
            modell: modell,
            kennzeichen: kennzeichen,
            reserved: false,
            kilometerstand: 0
        })
    })
        .then(response => response.json())
        .then(data => {
            alert('Car added successfully!');
            console.log(data);
        })
        .catch(error => console.error('Error:', error));
}

function removeCar() {
    var kennzeichen = document.getElementById('kennzeichenEntfernen').value;

    fetch(`http://localhost:8080/api/cars/${kennzeichen}`, {
        method: 'DELETE'
    })
        .then(() => {
            alert('Car removed successfully!');
        })
        .catch(error => console.error('Error:', error));
}

function updateCar() {
    var kennzeichen = document.getElementById('kennzeichenUpdate').value;
    var reserved = document.getElementById('reserved').checked;
    var kilometerstand = parseInt(document.getElementById('kilometerstand').value);

    fetch(`http://localhost:8080/api/cars/${kennzeichen}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            reserved: reserved,
            kilometerstand: kilometerstand
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            alert('Car updated successfully!');
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error updating car');
        });
}



function logout() {
    if (stompClient !== null) {
        stompClient.disconnect();
        console.log("Disconnected");
    }
    window.location.href = "../welcome/welcome.html";
}