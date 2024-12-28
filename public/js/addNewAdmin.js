document.getElementById('adminForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent default form submission
  
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    const formData = {
      name: name,
      email: email,
      password: password
    };
  
    try {
      // Send the form data to the server using the fetch API
      const response = await fetch('/addNewAdmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Indicate the content type as JSON
        },
        body: JSON.stringify(formData) // Convert the form data to JSON
      });
  
      // Handle the response from the server
      const data = await response.json();
  
      if (response.ok) {
        // Success message
        document.getElementById('message').innerText = 'Admin added successfully!';
        document.getElementById('adminForm').reset(); // Reset the form after successful submission
      } else {
        // Display error message
        document.getElementById('message').innerText = 'Error: ' + data.message;
      }
    } catch (error) {
      // Handle any network or other errors
      document.getElementById('message').innerText = 'Network Error: ' + error.message;
    }
  });
  