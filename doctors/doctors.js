// Fetch and display doctors in the table
async function fetchDoctors() {
    // Dynamically set the API URL based on the environment
    const apiUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:5000/doctors'  // Local development server
        : 'https://vitalpoint.onrender.com/doctors'; // Production server

    console.log("Using API URL:", apiUrl);  // Log the API URL to the console

    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Failed to fetch doctors. Status: ${response.status}`);
        }

        const doctors = await response.json();
        console.log('Doctors fetched from backend:', doctors);

        const doctorTableBody = document.getElementById('doctor-table').getElementsByTagName('tbody')[0];
        doctorTableBody.innerHTML = '';

        doctors.forEach(doctor => {
            const row = document.createElement('tr');

            const nameCell = document.createElement('td');
            nameCell.textContent = doctor.name;
            row.appendChild(nameCell);

            const specialtyCell = document.createElement('td');
            specialtyCell.textContent = doctor.specialty || 'N/A';
            row.appendChild(specialtyCell);

            const hoursCell = document.createElement('td');
            const days = doctor.days ? doctor.days.join(', ') : 'N/A';
            const hours = `${doctor.start_time || 'N/A'} - ${doctor.end_time || 'N/A'}`;
            hoursCell.textContent = `${days} ${hours}`;
            row.appendChild(hoursCell);

            row.addEventListener('click', () => handleRowClick(doctor));
            doctorTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching doctors:', error);
    }
}

function handleRowClick(doctor) {
    console.log("Redirecting with:", doctor);

    // Ensure the doctorData object matches what forms.js expects
    const doctorData = {
        name: doctor.name,
        specialty: doctor.specialty,
        days: doctor.days,
        start_time: doctor.start_time,
        end_time: doctor.end_time,
        gender: doctor.gender
    };

    // Store the doctor data in localStorage
    localStorage.setItem('doctorData', JSON.stringify(doctorData));

    // Redirect to the forms.html page
    window.location.href = '../forms/forms.html';
}

document.addEventListener('DOMContentLoaded', fetchDoctors);

// Handle row click to store doctor details in localStorage and redirect
function handleRowClick(doctor) {
    console.log("Redirecting with:", doctor);

    // Store doctor data in localStorage as an object
    const doctorData = {
        name: doctor.name,
        specialty: doctor.specialty,
        hours: `${doctor.days.join(', ')} ${doctor.start_time} - ${doctor.end_time}`,
        gender: doctor.gender,
        allowedDays: doctor.days,
        startHour: parseInt(doctor.start_time.split(':')[0]),
        endHour: parseInt(doctor.end_time.split(':')[0])
    };

    localStorage.setItem('doctorData', JSON.stringify(doctorData));

    // Redirect to the forms.html page
    window.location.href = '../forms/forms.html';
}

// Filter and search functionality
const specialtySelect = document.getElementById('specialty-select');
const searchInput = document.getElementById('doctor-search');
const doctorTable = document.getElementById('doctor-table');
const doctorRows = doctorTable.getElementsByTagName('tr');

// Specialty dropdown change
specialtySelect.addEventListener('change', filterDoctors);
searchInput.addEventListener('input', filterDoctors);

// Filter doctors
function filterDoctors() {
    const selectedSpecialty = specialtySelect.value.toLowerCase();
    const searchTerm = searchInput.value.toLowerCase();

    // Loop through all rows (except the header) to filter them
    for (let i = 1; i < doctorRows.length; i++) {
        const row = doctorRows[i];
        const name = row.cells[0].textContent.toLowerCase();
        const specialty = row.cells[1].textContent.toLowerCase();

        // Check if the row matches the filter criteria
        const matchesSpecialty = selectedSpecialty === 'all' || specialty.includes(selectedSpecialty);
        const matchesSearchTerm = name.includes(searchTerm);

        // Show or hide the row based on the filters
        if (matchesSpecialty && matchesSearchTerm) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    }
}

document.addEventListener('DOMContentLoaded', fetchDoctors);