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
    const gender = doctorData.gender ? doctorData.gender.toLowerCase() : 'unknown';  // Default to 'unknown' if gender is undefined

    if (gender === "male") {
        doctorImage.src = "../resources/male.jpg"; // Male image
    } else if (gender === "female") {
        doctorImage.src = "../resources/female.png"; // Female image
    } else {
        doctorImage.src = "../resources/default.png"; // Default image for non-binary or undefined genders
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

    console.log('Submit button clicked');  // Check if the event is triggered

    if (validateForm()) {
        // Disable the submit button to prevent multiple submissions
        btn.disabled = true;

        // Capture form data and prepare it
        const appointmentDate = document.getElementById('date').value;
        const appointmentTime = document.getElementById('appt').value;
        const appointmentDateTime = `${new Date(appointmentDate).toLocaleDateString('en-US', { weekday: 'short' })}, ${appointmentTime}`;

        formData = {
            name: document.getElementById('name').value,
            address: document.getElementById('address').value,
            email: document.getElementById('email').value,
            age: document.getElementById('age').value,
            gender: document.getElementById('gender').value,
            dateTime: appointmentDateTime,
            doctor: document.getElementById('doctor-name').textContent
        };

        console.log('Form data captured:', formData); // Debugging line

        // Store patient data in localStorage
        localStorage.setItem('nameData', formData.name);
        localStorage.setItem('addressData', formData.address);
        localStorage.setItem('emailData', formData.email);
        localStorage.setItem('ageData', formData.age);
        localStorage.setItem('genderData', formData.gender);
        localStorage.setItem('dateData', formData.dateTime.split(',')[0]);  // Date part only
        localStorage.setItem('apptData', formData.dateTime.split(',')[1]);  // Time part only

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
        return;  // Prevent double submission
    }

    isSubmitting = true;  // Set flag to true to indicate submission is in progress

    try {
        const response = await fetch('/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert('Appointment successfully scheduled!');
            window.location.href = "../confirmation/confirmation.html";
        } else {
            const errorMessage = await response.text();  // Get error message from response
            alert(`Failed to schedule appointment: ${errorMessage}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error submitting appointment request.');
    } finally {
        isSubmitting = false;  // Reset flag to allow future submissions
    }
}

document.addEventListener('DOMContentLoaded', displayDetails);
