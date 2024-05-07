(function () {
    function displayErrors(errors, errorContainer) {
        errorContainer.innerHTML = '';
        errors.forEach(function (error) {
            let li = document.createElement('li');
            li.textContent = error;
            errorContainer.appendChild(li);
        });
        errorContainer.style.display = 'block';
    }

    function validateForm(event, fields, validations, errorContainer) {
        let errors = [];
        validations.forEach(function(validation) {
            const inputValue = fields[validation.field].value.trim();
            const result = validation.rule(inputValue);
            if (result !== true) {
                errors.push(result);
            }
        });

        if (errors.length > 0) {
            event.preventDefault();
            displayErrors(errors, errorContainer);
        }
    }

    // Register form validation setup
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        const fields = {
            firstName: document.getElementById('firstName'),
            lastName: document.getElementById('lastName'),
            email: document.getElementById('email'),
            password: document.getElementById('password'),
            confirmPassword: document.getElementById('confirmPassword')
        };
        const errorContainer = document.getElementById('errorContainer');

        registerForm.addEventListener('submit', function (event) {
            validateForm(event, fields, [
                { field: 'firstName', rule: value => value.length >= 2 && value.length <= 25 ? true : "First name must be between 2 and 25 characters." },
                { field: 'lastName', rule: value => value.length >= 2 && value.length <= 25 ? true : "Last name must be between 2 and 25 characters." },
                { field: 'email', rule: value => /^\S+@\S+\.\S+$/.test(value) ? true : "Email must be a valid email address." },
                { field: 'password', rule: value => value.length >= 8 ? true : "Password must be at least 8 characters." },
                { field: 'confirmPassword', rule: value => value === fields.password.value ? true : "Passwords do not match." }
            ], errorContainer);
        });
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        const fields = {
            email: document.getElementById('email'),
            password: document.getElementById('password')
        };
        const errorContainer = document.getElementById('errorContainer');

        loginForm.addEventListener('submit', function (event) {
            validateForm(event, fields, [
                { field: 'email', rule: value => /^\S+@\S+\.\S+$/.test(value) ? true : "Please enter a valid email address." },
                { field: 'password', rule: value => value.length >= 8 ? true : "Password must be at least 8 characters." }
            ], errorContainer);
        });
    }

})();
