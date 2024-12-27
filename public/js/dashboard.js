// Wait for DOM content to be fully loaded before attaching the event listener
document.addEventListener("DOMContentLoaded", function() {
    const logoutButton = document.getElementById('logoutButton');

    if (logoutButton) {
        logoutButton.addEventListener('click', function(event) {
            event.preventDefault();  // Prevent the default anchor behavior

            // Send a POST request to the /logout route
            fetch('/logout', {
                method: 'POST',
                credentials: 'same-origin',  // Ensure session cookie is sent
            })
            .then((response) => response.json())
            .then((data) => {
                if (data.message === 'Logged out successfully') {
                    // Clear the session storage or local storage as needed
                    window.localStorage.clear();
                    window.sessionStorage.clear();
                    console.log('Logged out successfully');
                    window.location.href = '/login';  // Redirect to login page after successful logout
                } else {
                    console.error('Logout failed');
                }
            })
            .catch((error) => {
                console.error('Error logging out:', error);
            });
        });
    }
});
