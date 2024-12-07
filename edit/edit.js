// modal
var modal = document.getElementById("myModal");
var btn = document.getElementById("submitbtn");
var span = document.getElementsByClassName("close")[0];
var doctorTableBody = document.getElementById("doctor-table-body");

// Fetch doctors from the server and display them in the table
async function fetchDoctors() {
    try {
        const response = await fetch('/doctors');
        const doctors = await response.json();
        doctors.forEach(doctor => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${doctor.doctorId}</td>
                <td>${doctor.name}</td>
                <td>${doctor.specialty}</td>
                <td>${doctor.days}, ${doctor.start_time} - ${doctor.end_time}</td>
                <td>${doctor.email}</td>
            `;
            doctorTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching doctors:', error);
    }
}

// Show modal when del button clicked
btn.onclick = function() {
    modal.style.display = "block";
}

// Close the modal when the 'x' is clicked
span.onclick = function() {
    modal.style.display = "none";
}

document.getElementById("confirmBtn").onclick = async function() {
    var doctorID = document.getElementById("doctorID").value;
    if (doctorID) {
        try {
            const response = await fetch(`/deleteDoctor/${doctorID}`, { method: 'DELETE' });
            if (response.ok) {
                alert("Doctor deleted successfully.");
                modal.style.display = "none";
                location.reload(); // Reload the page to update the table
            } else {
                alert("Doctor not found.");
            }
        } catch (error) {
            alert("Error deleting doctor.");
            console.error(error);
        }
    } else {
        alert("Please enter a doctor ID.");
    }
}

window.onload = fetchDoctors;
