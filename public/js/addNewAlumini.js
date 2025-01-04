
document.getElementById('alumini-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = {
        name: document.getElementById('fullname').value.trim(),
        usn: document.getElementById('usn').value.trim(),
        company: document.getElementById('company').value.trim(),
        batch: document.getElementById('batch').value.trim(),
        status: document.getElementById('status').value.trim(),
    };
    

    try {
        const response = await fetch('/settings/addNewAlumni', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message || 'Alumni added successfully!');
            // Optionally reset the form after success
            document.getElementById('alumini-form').reset();
        } else {
            alert(data.error || 'Failed to add alumni');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Network error occurred');
    }
});
