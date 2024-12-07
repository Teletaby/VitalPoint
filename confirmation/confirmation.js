window.onload = function() {
    const name = localStorage.getItem('nameData');
    const address = localStorage.getItem('addressData');
    const email = localStorage.getItem('emailData');
    const age = localStorage.getItem('ageData');
    const gender = localStorage.getItem('genderData');
    const date = localStorage.getItem('dateData');
    const appt = localStorage.getItem('apptData');

    // Display patient data
    if (name) {
        document.getElementById('patient-name').textContent = name;
    }
    if (address) {
        document.getElementById('patient-address').textContent = address;
    }
    if (email) {
        document.getElementById('patient-email').textContent = email;
    }
    if (age) {
        document.getElementById('patient-age').textContent = age;
    }
    if (gender) {
        document.getElementById('patient-gender').textContent = gender;
    }
    if (date) {
        document.getElementById('patient-date').textContent = date;
    }
    if (appt) {
        document.getElementById('patient-appt').textContent = appt;
    }

    // Display doctor data
    const doctorData = JSON.parse(localStorage.getItem('doctorData'));
    if (doctorData) {
        document.getElementById('doctor-name').textContent = doctorData.name || "Unknown";
        document.getElementById('doctor-specialty').textContent = doctorData.specialty || "N/A";
        document.getElementById('clinic-hours').textContent = doctorData.allowedDays.length > 0
            ? `${doctorData.allowedDays.join(', ')} (${doctorData.startHour}:00 - ${doctorData.endHour}:00)`
            : "Not Available";

        const doctorImage = document.getElementById('doctor-image');
        if (doctorData.gender.toLowerCase() === "male") {
            doctorImage.src = "../resources/male.jpg";
            doctorImage.alt = "Male Doctor";
        } else if (doctorData.gender.toLowerCase() === "female") {
            doctorImage.src = "../resources/female.png";
            doctorImage.alt = "Female Doctor";
        } else {
            doctorImage.src = "../resources/default.png"; 
            doctorImage.alt = "Unknown Gender";
        }
    }
};
