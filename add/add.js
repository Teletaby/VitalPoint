// Get the base URL depending on the environment
const baseURL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://vitalpoint.onrender.com';

// Get elements
var modal = document.getElementById("myModal");
var btn = document.getElementById("submit");
var span = document.getElementsByClassName("close")[0];
var confirmBtn = document.getElementById("confirmBtn");

// Show the modal when the submit button is clicked
btn.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent form submission
    modal.style.display = "block"; // Show the modal
});

// Close the modal when the 'x' is clicked
span.addEventListener("click", function () {
    modal.style.display = "none";
});

// Close the modal when clicking outside the modal content
window.addEventListener("click", function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

// Submit form after confirmation
confirmBtn.addEventListener("click", async function () {
    // Gather the form data
    const form = document.getElementById("addDoctorForm");
    const formData = new FormData(form);

    // Log the gender value to check what is being retrieved
    const gender = formData.get("gender");
    console.log("Selected gender:", gender);

    // Prepare doctor data
    const doctorData = {
        name: formData.get("name"),
        specialty: formData.get("specialty"),
        gender: gender,
        days: formData.getAll("days[]"),
        start_time: formData.get("start_time"),
        end_time: formData.get("end_time"),
        email: formData.get("email"),
        password: formData.get("password"),
    };
    
    const userData = {
        username: formData.get("email"),
        password: formData.get("password"),
        name: formData.get("name"),
    };
    
    try {
        console.log('Sending doctor data:', doctorData);
        console.log('Sending user data:', userData);

        const response = await fetch(`${baseURL}/addDoctor`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ doctor: doctorData, user: userData }),
        });

        const result = await response.json();
        if (response.ok) {
            alert('Doctor added successfully!');
            window.location.href = '../add_confirmed/confirmed.html';
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error submitting the form.');
    }

    // Close modal after confirming
    modal.style.display = "none";
});

// Fetch doctors for display
async function fetchDoctors() {
    try {
        const response = await fetch(`${baseURL}/doctors`);
        const doctors = await response.json();

        console.log('Doctors fetched:', doctors);

        const doctorTableBody = document.getElementById('doctor-table').getElementsByTagName('tbody')[0];

        // Clear the table body before adding new rows
        doctorTableBody.innerHTML = '';

        // Add rows for each doctor
        doctors.forEach((doctor) => {
            const row = document.createElement('tr');

            // Create cells for the doctor's name, specialty, clinic hours, and gender
            const nameCell = document.createElement('td');
            nameCell.textContent = doctor.name; // Add 'Dr.' prefix to the name
            const specialtyCell = document.createElement('td');
            specialtyCell.textContent = doctor.specialty;
            const hoursCell = document.createElement('td');
            hoursCell.textContent = `${doctor.days ? doctor.days.join(', ') : ''} ${doctor.start_time || ''} - ${doctor.end_time || ''}`;
            const genderCell = document.createElement('td'); // Add gender cell
            genderCell.textContent = doctor.gender || 'Not specified';
            // Append cells to the row
            row.appendChild(nameCell);
            row.appendChild(specialtyCell);
            row.appendChild(hoursCell);
            row.appendChild(genderCell); // Append the gender cell to the row

            // Add click event listener for each row to redirect to the form
            row.onclick = function () {
                handleRowClick(doctor); // Pass entire doctor object
            };

            // Append the row to the table body
            doctorTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching doctors:', error);
    }
}
