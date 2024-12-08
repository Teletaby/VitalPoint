// Display doctor details from localStorage
function displayDetails() {
    const doctorData = JSON.parse(localStorage.getItem('doctorData'));
    console.log("Doctor data retrieved from localStorage:", doctorData);

    // Validate required fields
    if (!doctorData) {
        console.error("No doctor data found in localStorage.");
        return;
    }

    const missingFields = [];
    if (!doctorData.name) missingFields.push("name");
    if (!doctorData.specialty) missingFields.push("specialty");
    if (!doctorData.allowedDays || !Array.isArray(doctorData.allowedDays)) missingFields.push("allowedDays");
    if (doctorData.startHour == null) missingFields.push("startHour");
    if (doctorData.endHour == null) missingFields.push("endHour");

    if (missingFields.length > 0) {
        console.error(`Doctor data is missing required fields: ${missingFields.join(', ')}`, doctorData);
        alert("Doctor data is incomplete. Please check your localStorage data.");
        return;
    }

    // Update with doctor details
    document.getElementById('doctor-name').textContent = doctorData.name || "Unknown";
    document.getElementById('doctor-specialty').textContent = doctorData.specialty || "N/A";
    document.getElementById('clinic-hours').textContent =
        doctorData.allowedDays.length > 0
            ? `${doctorData.allowedDays.join(', ')} (${doctorData.startHour}:00 - ${doctorData.endHour}:00)`
            : "Not Available";

    // Gender image display
    const doctorImage = document.getElementById('doctor-image');
    const gender = doctorData.gender ? doctorData.gender.toLowerCase() : 'unknown';

    if (gender === "male") {
        doctorImage.src = "../resources/male.jpg"; // Male image
    } else if (gender === "female") {
        doctorImage.src = "../resources/female.png"; // Female image
    } else {
        doctorImage.src = "../resources/default.png"; // Default image
    }

    // Enable date input and set minimum to today
    const dateInput = document.getElementById('date');
    const timeInput = document.getElementById('appt');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
    dateInput.disabled = false;

    // Date validation logic
    dateInput.addEventListener('change', function () {
        const selectedDate = new Date(this.value);
        const selectedDay = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });

        const isDayAvailable = doctorData.allowedDays
            .map(day => day.toLowerCase())
            .includes(selectedDay.toLowerCase());

        if (!isDayAvailable) {
            alert(`The doctor is only available on: ${doctorData.allowedDays.join(', ')}`);
            this.value = '';
            timeInput.disabled = true;
        } else {
            timeInput.disabled = false;
        }
    });

    // Generate time slots
    const generateTimeSlots = (startHour, endHour) => {
        const times = [];
        for (let hour = startHour; hour < endHour; hour++) {
            times.push(`${hour.toString().padStart(2, '0')}:00`, `${hour.toString().padStart(2, '0')}:30`);
        }
        return times;
    };

    const timeSlots = generateTimeSlots(doctorData.startHour, doctorData.endHour);

    // Populate time slots in dropdown
    timeInput.innerHTML = '';
    timeSlots.forEach((time) => {
        const option = document.createElement('option');
        option.value = time;
        option.textContent = time;
        timeInput.appendChild(option);
    });
}

// Modal logic for form submission
const modal = document.getElementById("myModal");
const btn = document.getElementById("submit");
const span = document.getElementsByClassName("close")[0];
let formData = {}; // Temporary store data

// When the submit button is clicked
btn.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent form submission

    if (validateForm()) {
        // Disable the submit button to prevent multiple submissions
        btn.disabled = true;

        // Capture form data and prepare it
        const appointmentDate = document.getElementById('date').value; // Actual date selected
        const appointmentTime = document.getElementById('appt').value; // Time selected

        if (!appointmentDate) {
            alert("Please select a valid appointment date.");
            btn.disabled = false;
            return;
        }

        const formattedDate = new Date(appointmentDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }); // e.g., December 12, 2024

        const appointmentDateTime = `${formattedDate}, ${appointmentTime}`; // Combine date and time

        formData = {
            name: document.getElementById('name').value,
            address: document.getElementById('address').value,
            email: document.getElementById('email').value,
            age: document.getElementById('age').value,
            gender: document.getElementById('gender').value,
            dateTime: appointmentDateTime, // Pass the full date and time
            doctor: document.getElementById('doctor-name').textContent,
        };

        console.log('Form data captured:', formData); // Debugging line

        modal.style.display = "block"; // Show the confirmation modal
    } else {
        alert("Please fill in all the fields.");
    }
});

// Close the modal when the user clicks the "x"
span.onclick = function () {
    modal.style.display = "none";
};

// Confirm button in modal to submit the appointment
document.getElementById("confirmBtn").addEventListener("click", async function () {
    await storeData();
    modal.style.display = "none";
});

// Validate the form
function validateForm() {
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const email = document.getElementById('email').value;
    const age = document.getElementById('age').value;
    const gender = document.getElementById('gender').value;
    const date = document.getElementById('date').value;
    const appt = document.getElementById('appt').value;

    return name && address && email && age && gender && date && appt;
}

let isSubmitting = false; // Add this flag to control duplicate submissions

async function storeData() {
    if (isSubmitting) {
        alert('Your appointment is already being submitted.');
        return;
    }

    isSubmitting = true;

    try {
        // Save all patient data in localStorage before submitting
        const patientData = {
            name: formData.name,
            address: formData.address,
            email: formData.email,
            age: formData.age,
            gender: formData.gender,
            date: formData.dateTime,
            appt: document.getElementById('appt').value,
        };

        localStorage.setItem('patientData', JSON.stringify(patientData)); // Save as a single object

        const response = await fetch('/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            alert('Appointment successfully scheduled!');
            window.location.href = "../confirmation/confirmation.html";
        } else {
            const errorMessage = await response.text();
            alert(`Failed to schedule appointment: ${errorMessage}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error submitting appointment request.');
    } finally {
        isSubmitting = false;
    }
}


document.addEventListener('DOMContentLoaded', displayDetails);