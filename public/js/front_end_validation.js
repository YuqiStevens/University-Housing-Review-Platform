(function () {
    // Register Form Validation
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        const firstNameInput = document.getElementById('firstName');
        const lastNameInput = document.getElementById('lastName');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const errorContainer = document.getElementById('errorContainer');

        registerForm.addEventListener('submit', (event) => {
            let errors = [];
            errorContainer.innerHTML = '';

            // Basic checks for empty fields and length
            if (firstNameInput.value.trim().length < 2 || firstNameInput.value.trim().length > 25) {
                errors.push("First name must be between 2 and 25 characters.");
            }
            if (lastNameInput.value.trim().length < 2 || lastNameInput.value.trim().length > 25) {
                errors.push("Last name must be between 2 and 25 characters.");
            }
            if (!/^\S+@\S+\.\S+$/.test(emailInput.value.trim())) {
                errors.push("Email must be a valid email address.");
            }
            if (passwordInput.value.length < 8) {
                errors.push("Password must be at least 8 characters.");
            }
            if (passwordInput.value !== confirmPasswordInput.value) {
                errors.push("Passwords do not match.");
            }

            // Display errors if any
            if (errors.length > 0) {
                event.preventDefault();
                errors.forEach(function (error) {
                    let li = document.createElement('li');
                    li.textContent = error;
                    errorContainer.appendChild(li);
                });
            }
        });
    }

    // Login Form Validation
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const errorContainer = document.getElementById('errorContainer');

        loginForm.addEventListener('submit', (event) => {
            let errors = [];
            errorContainer.innerHTML = '';

            if (!/^\S+@\S+\.\S+$/.test(emailInput.value.trim())) {
                errors.push("Please enter a valid email address.");
            }
            if (passwordInput.value.length < 8) {
                errors.push("Password must be at least 8 characters.");
            }

            if (errors.length > 0) {
                event.preventDefault();
                errors.forEach(function (error) {
                    let li = document.createElement('li');
                    li.textContent = error;
                    errorContainer.appendChild(li);
                });
            }
        });
    }

    // Profile Update Form Validation
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        const firstNameInput = document.getElementById('firstName');
        const lastNameInput = document.getElementById('lastName');
        const cityInput = document.getElementById('city');
        const stateInput = document.getElementById('state');
        const errorContainer = document.getElementById('errorContainer');

        profileForm.addEventListener('submit', (event) => {
            let errors = [];
            errorContainer.innerHTML = '';

            if (firstNameInput.value.trim().length < 2 || firstNameInput.value.trim().length > 25) {
                errors.push("First name must be between 2 and 25 characters.");
            }
            if (lastNameInput.value.trim().length < 2 || lastNameInput.value.trim().length > 25) {
                errors.push("Last name must be between 2 and 25 characters.");
            }
            if (cityInput.value.trim().length < 2 || cityInput.value.trim().length > 50) {
                errors.push("City name must be between 2 and 50 characters.");
            }
            // Adding basic state validation assuming the use of US states; adapt as necessary for international use
            const states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];
            if (!states.includes(stateInput.value.trim().toUpperCase())) {
                errors.push("Please select a valid state.");
            }

            if (errors.length > 0) {
                event.preventDefault();
                errors.forEach(function (error) {
                    let li = document.createElement('li');
                    li.textContent = error;
                    errorContainer.appendChild(li);
                });
            }
        });
    }

    // Password Change Form Validation
    const passwordForm = document.getElementById('password-form');
    if (passwordForm) {
        const currentPasswordInput = document.getElementById('currentPassword');
        const newPasswordInput = document.getElementById('newPassword');
        const confirmPasswordInput = document.getElementById('confirmNewPassword');
        const errorContainer = document.getElementById('errorContainer');

        passwordForm.addEventListener('submit', (event) => {
            let errors = [];
            errorContainer.innerHTML = '';

            if (newPasswordInput.value.length < 8) {
                errors.push("New password must be at least 8 characters.");
            }
            if (newPasswordInput.value !== confirmPasswordInput.value) {
                errors.push("New passwords do not match.");
            }

            if (errors.length > 0) {
                event.preventDefault();
                errors.forEach(function (error) {
                    let li = document.createElement('li');
                    li.textContent = error;
                    errorContainer.appendChild(li);
                });
            }
        });
    }

    // Add Housing Form Validation
    const addHousingForm = document.getElementById('add-housing-form');
    if (addHousingForm) {
        const addressInput = document.getElementById('address');
        const zipCodeInput = document.getElementById('zipCode');
        const cityInput = document.getElementById('city');
        const stateInput = document.getElementById('state');
        const homeTypeInput = document.getElementById('homeType');
        const rentalCostMinInput = document.getElementById('rentalCostMin');
        const rentalCostMaxInput = document.getElementById('rentalCostMax');
        const errorContainer = document.getElementById('errorContainer');

        addHousingForm.addEventListener('submit', (event) => {
            let errors = [];
            errorContainer.innerHTML = '';

            // Example validation, add more comprehensive checks as needed
            if (addressInput.value.trim().length < 3) {
                errors.push("Address must be at least 3 characters long.");
            }
            if (!/^\d{5}$/.test(zipCodeInput.value.trim())) {
                errors.push("Zip code must be exactly 5 digits.");
            }
            if (rentalCostMinInput.value.trim() === '' || rentalCostMaxInput.value.trim() === '' || parseInt(rentalCostMinInput.value) > parseInt(rentalCostMaxInput.value)) {
                errors.push("Invalid rental cost range.");
            }

            if (errors.length > 0) {
                event.preventDefault();
                errors.forEach(function (error) {
                    let li = document.createElement('li');
                    li.textContent = error;
                    errorContainer.appendChild(li);
                });
            }
        });
    }

    // Add Review Form Validation
    const addReviewForm = document.getElementById('add-review-form');
    if (addReviewForm) {
        const ratingInput = document.getElementById('rating');
        const titleInput = document.getElementById('title');
        const bodyInput = document.getElementById('body');
        const errorContainer = document.getElementById('errorContainer');

        addReviewForm.addEventListener('submit', (event) => {
            let errors = [];
            errorContainer.innerHTML = '';

            if (ratingInput.value < 1 || ratingInput.value > 5) {
                errors.push("Rating must be between 1 and 5.");
            }
            if (titleInput.value.trim().length < 3 || titleInput.value.trim().length > 50) {
                errors.push("Review title must be between 3 and 50 characters.");
            }
            if (bodyInput.value.trim().length < 25 || bodyInput.value.trim().length > 500) {
                errors.push("Review content must be between 25 and 500 characters.");
            }

            if (errors.length > 0) {
                event.preventDefault();
                errors.forEach(function (error) {
                    let li = document.createElement('li');
                    li.textContent = error;
                    errorContainer.appendChild(li);
                });
            }
        });
    }

    // Add Comment Form Validation
    const addCommentForm = document.getElementById('add-comment-form');
    if (addCommentForm) {
        const commentInput = document.getElementById('comment');
        const errorContainer = document.getElementById('errorContainer');

        addCommentForm.addEventListener('submit', (event) => {
            let errors = [];
            errorContainer.innerHTML = '';

            if (commentInput.value.trim().length < 3 || commentInput.value.trim().length > 200) {
                errors.push("Comment must be between 3 and 200 characters.");
            }

            if (errors.length > 0) {
                event.preventDefault();
                errors.forEach(function (error) {
                    let li = document.createElement('li');
                    li.textContent = error;
                    errorContainer.appendChild(li);
                });
            }
        });
    }

    // Edit Housing Form Validation
    const editHousingForm = document.getElementById('edit-housing-form');
    if (editHousingForm) {
        // Assume similar validation as Add Housing, customize as needed
    }

    // Edit Review Form Validation
    const editReviewForm = document.getElementById('edit-review-form');
    if (editReviewForm) {
        // Assume similar validation as Add Review, customize as needed
    }
})();
