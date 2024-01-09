document.getElementById('addRandomCarButton').addEventListener('click', addRandomCar);
document.getElementById('addRandomCustomerButton').addEventListener('click', addRandomCustomer);
document.getElementById('addRandomReservationButton').addEventListener('click', addRandomReservation);

function addRandomCar() {
    var licensePlate = 'XYZ' + Math.floor(Math.random() * 999);
    var mileage = Math.floor(Math.random() * 50000);
    var brands = ['Toyota', 'Ford', 'Honda', 'Peugeot', 'Chevrolet'];
    var models = ['Prius', 'Zonda', 'Focus', 'CL500', 'Fiesta'];
    var brand = brands[Math.floor(Math.random() * brands.length)];
    var model = models[Math.floor(Math.random() * models.length)];

    fetch('http://localhost:8081/api/employee/car', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            licensePlate: licensePlate,
            mileage: mileage,
            brand: brand,
            model: model
        }),
    })
        .then(response => response.json())
        .then(data => console.log("Car added:", data))
        .catch((error) => console.error('Error:', error));
}
function addRandomCustomer() {
    var firstNames = ["Alice", "Bob", "Charlie", "Diana", "Edward"];
    var lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones"];
    var domains = ["example.com", "mail.com", "test.com"];

    var firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    var lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    var email = firstName.toLowerCase() + "." + lastName.toLowerCase() + "@" + domains[Math.floor(Math.random() * domains.length)];
    var password = "Pass123";

    fetch('http://localhost:8082/api/customer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        }),
    })
        .then(response => response.json())
        .then(data => console.log("Customer added:", data))
        .catch((error) => console.error('Error:', error));
}

function addRandomReservation() {
    Promise.all([
        fetch('http://localhost:8081/api/employee/car').then(response => response.json()), // Fetch all cars
        fetch('http://localhost:8082/api/customer').then(response => response.json())    // Fetch all customers
    ])
        .then(([cars, customers]) => {
            if (cars.length === 0 || customers.length === 0) {
                console.error("No cars or customers available to make a reservation.");
                return;
            }

            // Select random car and customer
            var randomCar = cars[Math.floor(Math.random() * cars.length)];
            var randomCustomer = customers[Math.floor(Math.random() * customers.length)];

            // Generate random dates for the reservation
            var startDate = new Date();
            var endDate = new Date();
            endDate.setDate(startDate.getDate() + Math.floor(Math.random() * 10) + 1); // Random end date between 1 and 10 days from start

            fetch('http://localhost:8081/api/employee/reservation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    carID: randomCar.id, // Assuming the car object has an 'id' field
                    customerID: randomCustomer.id, // Assuming the customer object has an 'id' field
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString()
                }),
            })
                .then(response => response.json())
                .then(data => console.log("Reservation added:", data))
                .catch((error) => console.error('Error:', error));
        })
        .catch((error) => console.error('Error fetching cars or customers:', error));
}

