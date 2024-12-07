let doctorName = sessionStorage.getItem('doctorName');

// If doctorName is not set (e.g., if the user is not logged in), redirect to login
if (!doctorName) {
    window.location.href = '../login/admin.html';
} else {
    // doc greeting
    document.querySelector('.greet h1').textContent = `Welcome, Dr. ${doctorName}`;
}

// Fetch all appointments
fetch('http://localhost:5000/appointments')
  .then(response => response.json())
  .then(appointments => {
    const tbody = document.querySelector('#doctor-table tbody');
    
    // Filter appointments for this doctor using the doctor's name
    const doctorAppointments = appointments.filter(appointment => appointment.doctor === `Dr. ${doctorName}`);

    // Loop through the appointments and add rows to the table
    doctorAppointments.forEach(appointment => {
      const row = document.createElement('tr');
      
      row.innerHTML = `
        <td>${appointment.patientId}</td>
        <td>${appointment.name}</td>
        <td>${appointment.doctor}</td>
        <td>${appointment.contact}</td>
        <td>${appointment.email}</td>
        <td>${appointment.dateTime}</td>
        <td><button class="delete-btn" data-id="${appointment._id}">Delete</button></td>
      `;
      
      tbody.appendChild(row);

      // Attach delete button event handler
      row.querySelector('.delete-btn').addEventListener('click', function() {
        selectedRow = row; // Set the row to be deleted
        modal.style.display = "block"; // Show the delete confirmation modal
      });
    });
  })
  .catch(error => {
    console.error('Error fetching appointments:', error);
  });

// Modal
var modal = document.getElementById("myModal");
var confirmBtn = document.getElementById("confirmBtn");
var cancelBtn = document.getElementById("cancelBtn");
var selectedRow = null;

// Confirm deletion
confirmBtn.onclick = function() {
    if (selectedRow) {
        // Remove the row from the table
        selectedRow.remove();
        modal.style.display = "none"; // Close the modal
        
        // Optionally, send a request to delete the appointment from the server
        const appointmentId = selectedRow.querySelector('.delete-btn').dataset.id;
        fetch(`http://localhost:5000/appointments/${appointmentId}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            console.log('Appointment deleted', data);
        })
        .catch(error => {
            console.error('Error deleting appointment:', error);
        });
    }
};

// Close modal on Cancel
cancelBtn.onclick = function() {
    modal.style.display = "none";
};

// Close modal on 'x'
document.querySelector('.close').onclick = function() {
    modal.style.display = "none";
};
