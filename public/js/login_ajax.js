(function ($) {
    let loginForm = $('#login-form'),
        errorContainer = $('#errorContainer'),
        emailTerm = $('#email'),
        passwordTerm = $('#password');

    errorContainer.hide(); // Initially hide the error container.

    loginForm.submit(function (event) {
        event.preventDefault(); // Prevent the form from submitting via the browser's default action.

        let email = emailTerm.val().trim();
        let password = passwordTerm.val().trim();
        let errors = validateCredentials(email, password); // Validate inputs and collect errors.

        if (errors.length > 0) {
            displayErrors(errors); // Display errors if validation fails.
            return;
        }

        let requestConfig = {
            method: 'POST',
            url: '/apiForLogin',
            contentType: 'application/json',
            data: JSON.stringify({
                email: email,
                password: password
            })
        };

        // Perform the AJAX request.
        $.ajax(requestConfig).done(function (response) {
            handleLoginResponse(response); // Handle the server's response.
        }).fail(function (jqXHR, textStatus, errorThrown) {
            console.error("AJAX call failed: ", textStatus, errorThrown);
            errorContainer.empty().append("An error occurred during login. Please try again later.").show();
        });
    });

    function validateCredentials(email, password) {
        let errors = [];

        if (!/\S+@\S+\.\S+/.test(email)) {
            errors.push("Email address should be a valid email address format. example@example.com");
        }

        if (password.includes(' ')) {
            errors.push("Password should not contain any space");
        } else {
            const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9\s]).{8,}$/;
            if (!passwordRegex.test(password)) {
                errors.push("Password must have at least 8 characters, with at least 1 uppercase letter, 1 number, and 1 symbol");
            }
        }

        return errors;
    }

    function displayErrors(errors) {
        errorContainer.empty();
        errors.forEach(function (error) {
            errorContainer.append($('<div>').text(error));
        });
        errorContainer.show();
    }

    function handleLoginResponse(response) {
        if (response.login) {
            console.log("Login successful, redirecting to home");
            window.location.href = '/home'; // Redirect to home on successful login.
        } else {
            console.error("Login failed:", response.error);
            displayErrors(response.error || ["Login failed. Please check your credentials and try again."]);
        }
    }

})(window.jQuery);
