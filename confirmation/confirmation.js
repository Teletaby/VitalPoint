window.onload = function () {
    const patientData = JSON.parse(localStorage.getItem('patientData'));
    if (patientData) {
        document.getElementById('patient-name').textContent = patientData.name || "Unknown";
        document.getElementById('patient-address').textContent = patientData.address || "Unknown";
        document.getElementById('patient-email').textContent = patientData.email || "Unknown";
        document.getElementById('patient-age').textContent = patientData.age || "Unknown";
        document.getElementById('patient-gender').textContent = patientData.gender || "Unknown";
        document.getElementById('patient-date').textContent = patientData.date || "Unknown";
        document.getElementById('patient-appt').textContent = patientData.appt || "Unknown";
    }

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
