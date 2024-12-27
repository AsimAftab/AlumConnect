// script.js
function submitForm(event) {
    // Get the form element
    const form = document.getElementById("loginForm");

    // Check if the form is valid (HTML5 form validation)
    if (form.checkValidity()) {
        // If valid, submit the form
        form.submit();
    } else {
        // If invalid, trigger form validation (HTML5 will show errors)
        form.reportValidity();
    }
}
