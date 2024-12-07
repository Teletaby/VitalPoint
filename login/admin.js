async function validateLogin() {
    const username = document.getElementById('user').value;
    const password = document.getElementById('pass').value;

    // Send login request to the server
    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    if (response.ok) {
        // Login successful, process the response to check if the user is a doctor based on email
        const userData = await response.json();  // Assuming response contains user data

        console.log(userData); 

        // Checks if the username contains "_doctor"
        if (userData.username.includes('_doctor')) {
            // Store the doctor's details in sessionStorage
            sessionStorage.setItem('doctorName', userData.name); 
            sessionStorage.setItem('doctorId', userData._id);  

            // User is doctor
            window.location.href = '../doc_admin/doc.html';
        } else {
            // User not doctor
            window.location.href = '/appointments/appointments.html';
        }
    } else {
        alert('Invalid username or password');
        
        // clear when wrong
        document.getElementById('user').value = '';
        document.getElementById('pass').value = '';
    }
}
