(function ($) {
    let loginForm = $('#login-form'),
        errorContainer = $('#errorContainer'),
        emailTerm = $('#email'),
        passwordTerm = $('#password')

    errorContainer.hide();
    loginForm.submit(async function (event) {
        event.preventDefault();
        let email = emailTerm.val().trim();
        let password = passwordTerm.val().trim();
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

        if (errors.length > 0) {
            errorContainer.empty();
            for (let error of errors) {
                errorContainer.append(error);
            }
            errorContainer.show();
            return;
        }

        let requestConfig = {
            method: 'POST',
            url: '/apiForLogin',
            data: {
                email: email,
                password: password
            }
        }

        await $.ajax(requestConfig).then(function(responseMessage) {
            console.log(responseMessage);
            errorContainer.empty();
            errorContainer.hide();
            if (!responseMessage.login) {
                for (let error of responseMessage.error) {
                    errorContainer.append(error);
                }
                errorContainer.show();
                return;
            }
            if (responseMessage.login) {
                window.location.href = '/home';
            }
        })

        await $.ajax(requestConfig).done(function(responseMessage) {
            if (responseMessage.login) {
                console.log("Login successful, redirecting to home");
                window.location.href = '/home';
            } else {
                errorContainer.empty().append("Login failed. Please check your credentials and try again.").show();
            }
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.error("AJAX call failed: ", textStatus, errorThrown);
            errorContainer.empty().append("An error occurred during login. Please try again later.").show();
        });

    })

})(window.jQuery);
