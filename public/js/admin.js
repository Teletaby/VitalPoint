document.addEventListener('DOMContentLoaded', async () => {
/*     const response = await fetch('http://localhost:3000/admin/dashboard');
    const users = response.json();
    console.log(users) */
    try {
        // Fetch user data from the server
        const response = await fetch('http://localhost:3000/admin/dashboard');
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        const users = await response.json();
        console.log('Users:', users);

        // Get the table body element
        const tableBody = document.querySelector('#userTable tbody');

        // Populate the table with user data
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to load user data.');
    }
});
