(function ($) {
    // Selecting DOM elements
    const loginForm = $('#login-form');
    const errorContainer = $('#errorContainer');
    const emailTerm = $('#email');
    const passwordTerm = $('#password');

    // Hide error container initially
    errorContainer.hide();

    // Handle form submission
    loginForm.submit(async function (event) {
        event.preventDefault();

        // Retrieve input values
        const email = emailTerm.val().trim();
        const password = passwordTerm.val().trim();
        const errors = [];

        // Validate email format
        if (!/\S+@\S+\.\S+/.test(email)) {
            errors.push("Please enter a valid email address (e.g., example@example.com).");
        }

        // Validate password format
        if (password.includes(' ')) {
            errors.push("Password should not contain spaces.");
        } else {
            const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9\s]).{8,}$/;
            if (!passwordRegex.test(password)) {
                errors.push("Password must have at least 8 characters, including 1 uppercase letter, 1 number, and 1 symbol.");
            }
        }

        // Display validation errors, if any
        if (errors.length > 0) {
            errorContainer.empty().append(errors.join('<br>'));
            errorContainer.show();
            return;
        }

        // Prepare AJAX request
        const requestConfig = {
            method: 'POST',
            url: '/apiForLogin',
            data: {
                email: email,
                password: password
            }
        };

        // Send AJAX request
        try {
            const responseMessage = await $.ajax(requestConfig);

            // Handle server response
            if (!responseMessage.login) {
                errorContainer.empty().append(responseMessage.error.join('<br>'));
                errorContainer.show();
            } else {
                // Redirect user to home page upon successful login
                window.location.href = '/home';
            }
        } catch (error) {
            console.error('An error occurred during login:', error);
            // Display a generic error message
            errorContainer.empty().text('An error occurred during login. Please try again later.');
            errorContainer.show();
        }
    });

})(window.jQuery);
