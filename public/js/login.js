document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the default form submission

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {

        const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                
            },
            body: JSON.stringify({ email, password })
        });


        const data = await response.json();
        //console.log(data)
        if (response.ok) {
            // Save the token to localStorage
            localStorage.setItem('token', data.token);

            // Redirect to the appropriate dashboard
            if (data.role === 'admin') {
                window.location.href = '/admin/home';
            } else if (data.role === 'doctor') {
                window.location.href = '/doctor/home';
            }
        } else {
            document.getElementById('error-message').innerText = data.message || 'Login failed. Please try again.';
        }
    } catch (error) {
        document.getElementById('error-message').innerText = 'An error occurred. Please try again later.';
    }
});
