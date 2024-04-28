document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('signin-form');
    const registerForm = document.getElementById('signup-form');

    function displayError(input, message) {
        let errorDiv = input.nextElementSibling;
        if (errorDiv && !errorDiv.classList.contains('error-message')) {
            errorDiv = null;
        }
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.classList.add('error-message');
            input.parentElement.insertBefore(errorDiv, input.nextSibling);
        }
        errorDiv.textContent = message;
    }

    function clearError(input) {
        const errorDiv = input.nextElementSibling;
        if (errorDiv && errorDiv.classList.contains('error-message')) {
            input.parentElement.removeChild(errorDiv);
        }
    }

    function validateInput(input, regex, minLength, maxLength, errorMessage) {
        const inputValue = input.value.trim();
        if (!inputValue || !inputValue.match(regex) || inputValue.length < minLength || inputValue.length > maxLength) {
            displayError(input, errorMessage);
            return false;
        }
        clearError(input);
        return true;
    }

    function validatePasswords(password, confirmPassword) {
        if (password.value !== confirmPassword.value) {
            displayError(confirmPassword, 'Passwords do not match.');
            return false;
        }
        clearError(confirmPassword);
        return true;
    }

    function validatePasswordRequirements(password) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return validateInput(password, passwordRegex, 8, undefined, 'Password must be at least 8 characters long and include at least one uppercase letter, one number, and one special character.');
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const username = loginForm.querySelector('#username');
            const password = loginForm.querySelector('#password');

            const isUsernameValid = validateInput(username, /^[a-zA-Z0-9_]+$/, 5, 10, 'Username must be 5-10 characters long.');
            const isPasswordValid = validatePasswordRequirements(password);

            if (isUsernameValid && isPasswordValid) {
                loginForm.submit();
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const firstName = registerForm.querySelector('#firstName');
            const lastName = registerForm.querySelector('#lastName');
            const username = registerForm.querySelector('#username');
            const password = registerForm.querySelector('#password');
            const confirmPassword = registerForm.querySelector('#confirmPassword');
            const favoriteQuote = registerForm.querySelector('#favoriteQuote');
            const themePreference = registerForm.querySelector('#themePreference');
            const role = registerForm.querySelector('#role');

            const isFirstNameValid = validateInput(firstName, /^[a-zA-Z]+$/, 2, 25, 'First name must be 2-25 characters long, and must only contain letters.');
            const isLastNameValid = validateInput(lastName, /^[a-zA-Z]+$/, 2, 25, 'Last name must be 2-25 characters long, and must only contain letters.');
            const isUsernameValid = validateInput(username, /^[a-zA-Z]+$/, 5, 10, 'Username must be 5-10 characters long, and must only contain letters.');
            const isPasswordValid = validatePasswordRequirements(password);
            const isPasswordsMatch = validatePasswords(password, confirmPassword);
            const isFavoriteQuoteValid = validateInput(favoriteQuote, /^(?! *$)[\s\S]{20,255}$/, 20, 255, 'Favorite quote must be 20-255 characters long and not just spaces.');
            const isThemePreferenceValid = themePreference.value === 'light' || themePreference.value === 'dark';
            const isRoleValid = role.value === 'admin' || role.value === 'user';

            if (!isThemePreferenceValid) {
                displayError(themePreference, 'Theme preference must be "light" or "dark".');
            } else {
                clearError(themePreference);
            }

            if (!isRoleValid) {
                displayError(role, 'Role must be "admin" or "user".');
            } else {
                clearError(role);
            }

            if (isFirstNameValid && isLastNameValid && isUsernameValid && isPasswordValid && isPasswordsMatch && isFavoriteQuoteValid && isThemePreferenceValid && isRoleValid) {
                firstName.value = firstName.value.trim();
                lastName.value = lastName.value.trim();
                username.value = username.value.trim();
                password.value = password.value.trim();
                confirmPassword.value = confirmPassword.value.trim();
                favoriteQuote.value = favoriteQuote.value.trim();

                registerForm.submit();
            }
        });
    }
});
