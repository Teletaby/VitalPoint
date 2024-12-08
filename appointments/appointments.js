// Function to search the doctor table based on the name
function searchTable() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const table = document.getElementById('doctor-table');
    const rows = table.querySelectorAll('tbody tr'); // Select only rows in the table body

    rows.forEach(row => {
        const nameCell = row.querySelector('td:nth-child(2)'); // Select the 2nd cell (Name)
        if (nameCell) {
            const name = nameCell.textContent.toLowerCase();
            if (name.indexOf(searchInput) > -1) {
                row.style.display = ''; // Show row if it matches
            } else {
                row.style.display = 'none'; // Hide row if it doesn't match
            }
        }
    });
}

// Function to fetch appointments from the server and populate the table
async function fetchAppointments() {
    try {
        const response = await fetch('/appointments');
        const appointments = await response.json();
        console.log(appointments); // Log to check the data returned

        const tableBody = document.getElementById('appointments-table-body');
        tableBody.innerHTML = '';  // Clear the table before inserting new rows

        if (appointments.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7">No appointments found.</td></tr>';
            return;
        }

        appointments.forEach(appointment => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${appointment.patientId}</td>
                <td>${appointment.name}</td>
                <td>${appointment.doctor}</td>
                <td>${appointment.contact}</td>
                <td>${appointment.email}</td>
                <td>${appointment.dateTime}</td>
                <td class="no-hover"><button class="delete-btn" onclick="deleteAppointment('${appointment._id}')">Delete</button></td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching appointments:', error);
    }
}

// Function to delete an appointment
async function deleteAppointment(id) {
    try {
        const response = await fetch(`/appointments/${id}`, { method: 'DELETE' });

        if (response.ok) {
            alert('Appointment deleted successfully');
            fetchAppointments();  // Refresh the table after deletion
        } else {
            alert('Error deleting appointment');
        }
    } catch (error) {
        console.error('Error deleting appointment:', error);
    }
}

window.onload = fetchAppointments;
