async function secureFetch(url, options = {}) {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage

    if (!token) {
        alert('Unauthorized access. Please log in.');
        window.location.href = '/login'; // Redirect to login if no token
        return;
    }

    // Add the Authorization header to the request
    const headers = options.headers || {};
    headers['Authorization'] = `Bearer ${token}`;
    options.headers = headers;

    const response = await fetch(url, options);
    return response;
}

// I have no idea how make this work for the routing