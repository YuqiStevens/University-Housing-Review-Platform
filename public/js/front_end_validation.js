(function () {
    const registerStaticForm = document.getElementById('registration-form');
    if (registerStaticForm) {
        const userNameInput = document.getElementById('userName')
        const firstNameInput = document.getElementById('firstName');
        const lastNameInput = document.getElementById('lastName');
        const emailAddressInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const roleInput = document.getElementById('role');
        const errorContainer = document.getElementById('errorContainer');

        registerStaticForm.addEventListener('submit', (event) => {
            let errors = [];
            errorContainer.innerHTML = '';

            const trimmedUserName = userNameInput.value.trim();
            const trimmedFirstName = firstNameInput.value.trim();
            const trimmedLastName = lastNameInput.value.trim();
            const trimmedEmail = emailAddressInput.value.trim();
            const trimmedPassword = passwordInput.value.trim();
            const trimmedConfirmPassword = confirmPasswordInput.value.trim();

            userNameInput.value = trimmedUserName;
            firstNameInput.value = trimmedFirstName;
            lastNameInput.value = trimmedLastName;
            emailAddressInput.value = trimmedEmail;
            passwordInput.value = trimmedPassword;
            confirmPasswordInput.value = trimmedConfirmPassword;

            if (!/^[a-zA-Z]+$/.test(trimmedUserName)) errors.push("User name must only contain letters");
            if (trimmedUserName.length < 2 || trimmedUserName.length > 25) errors.push("User name should have 2 - 25 characters");

            if (!/^[a-zA-Z]+$/.test(trimmedFirstName)) errors.push("First name must only contain letters");
            if (trimmedFirstName.length < 2 || trimmedFirstName.length > 25) errors.push("First name should have 2 - 25 characters");

            if (!/^[a-zA-Z]+$/.test(trimmedLastName)) errors.push("Last name must only contain letters");
            if (trimmedLastName.length < 2 || trimmedLastName.length > 25) errors.push("Last name should have 2 - 25 characters");

            if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
                errors.push("Email address should be a valid email address format. example@example.com");
            }

            if (trimmedPassword.includes(' ')) {
                errors.push("Password should not contain any space");
            } else {
                const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9\s]).{8,}$/;
                if (!passwordRegex.test(trimmedPassword)) {
                    errors.push("Password must have at least 8 characters, with at least 1 uppercase letter, 1 number, and 1 symbol");
                }
            }

            if (trimmedPassword !== trimmedConfirmPassword) {
                errors.push("Password is not the same");
            }

            if (roleInput.value !== 'admin' && roleInput.value !== 'user') {
                errors.push("The role should be admin or user");
            }

            if (errors.length > 0) {
                event.preventDefault();
                for (let i = 0; i < errors.length; i++) {
                    const addLi = document.createElement('li');
                    addLi.textContent = errors[i];
                    errorContainer.appendChild(addLi);
                }
            }
        });
    }

    const loginStaticForm = document.getElementById('login-form');
    if (loginStaticForm) {
        const emailAddressInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const errorContainer = document.getElementById('errorContainer');

        loginStaticForm.addEventListener('submit', (event) => {
            let errors = [];
            errorContainer.innerHTML = '';

            const trimmedEmail = emailAddressInput.value.trim();
            const trimmedPassword = passwordInput.value.trim();

            emailAddressInput.value = trimmedEmail;
            passwordInput.value = trimmedPassword;

            if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
                errors.push("Email address should be a valid email address format. example@example.com");
            }

            if (trimmedPassword.includes(' ')) {
                errors.push("Password should not contain any space");
            } else {
                const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9\s]).{8,}$/;
                if (!passwordRegex.test(trimmedPassword)) {
                    errors.push("Password must have at least 8 characters, with at least 1 uppercase letter, 1 number, and 1 symbol");
                }
            }

            if (errors.length > 0) {
                event.preventDefault();
                for (let i = 0; i < errors.length; i++) {
                    const addLi = document.createElement('li');
                    addLi.textContent = errors[i];
                    errorContainer.appendChild(addLi);
                }
            }
        });
    }
    const profileStaticForm = document.getElementById('profile-form');

    if (profileStaticForm) {
        const userNameInput = document.getElementById('userName')
        const firstNameInput = document.getElementById('firstName');
        const lastNameInput = document.getElementById('lastName');
        const emailAddressInput = document.getElementById('email');
        const errorContainer = document.getElementById('errorContainer');

        profileStaticForm.addEventListener('submit', (event) => {
            let errors = [];
            errorContainer.innerHTML = '';

            const trimmedUserName = userNameInput.value.trim();
            const trimmedFirstName = firstNameInput.value.trim();
            const trimmedLastName = lastNameInput.value.trim();
            const trimmedEmail = emailAddressInput.value.trim();

            userNameInput.value = trimmedUserName;
            firstNameInput.value = trimmedFirstName;
            lastNameInput.value = trimmedLastName;
            emailAddressInput.value = trimmedEmail;

            if (!/^[a-zA-Z]+$/.test(trimmedUserName)) errors.push("User name must only contain letters");
            if (trimmedUserName.length < 2 || trimmedUserName.length > 25) errors.push("User name should have 2 - 25 characters");

            if (!/^[a-zA-Z]+$/.test(trimmedFirstName)) errors.push("First name must only contain letters");
            if (trimmedFirstName.length < 2 || trimmedFirstName.length > 25) errors.push("First name should have 2 - 25 characters");

            if (!/^[a-zA-Z]+$/.test(trimmedLastName)) errors.push("Last name must only contain letters");
            if (trimmedLastName.length < 2 || trimmedLastName.length > 25) errors.push("Last name should have 2 - 25 characters");

            if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
                errors.push("Email address should be a valid email address format. example@example.com");
            }

            if (errors.length > 0) {
                event.preventDefault();
                for (let i = 0; i < errors.length; i++) {
                    const addLi = document.createElement('li');
                    addLi.textContent = errors[i];
                    errorContainer.appendChild(addLi);
                }
            }
        });
    }

    const passwordStaticForm = document.getElementById('password-change-form');

    if (passwordStaticForm) {
        const originalPasswordInput = document.getElementById('originalPassword');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');

        passwordStaticForm.addEventListener('submit', (event) => {
            let errors = [];
            errorContainer.innerHTML = '';

            const originalPassword = originalPasswordInput.value;
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            originalPasswordInput.value = originalPassword;
            passwordInput.value = password;
            confirmPasswordInput.value = confirmPassword;

            if (originalPassword.includes(' ')) {
                errors.push("Original password entered is wrong");
            } else {
                const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9\s]).{8,}$/;
                if (!passwordRegex.test(originalPassword)) {
                    errors.push("Original password entered is wrong");
                }
            }

            if (password.includes(' ')) {
                errors.push("Password should not contain any space");
            } else {
                const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9\s]).{8,}$/;
                if (!passwordRegex.test(password)) {
                    errors.push("Password must have at least 8 characters, with at least 1 uppercase letter, 1 number, and 1 symbol");
                }
            }
            if (password === originalPassword) {
                errors.push("New password should not be same as the old one")
            }
            if (password !== confirmPassword) {
                errors.push("Password doesn't match");
            }

            if (errors.length > 0) {
                event.preventDefault();
                for (let i = 0; i < errors.length; i++) {
                    const addLi = document.createElement('li');
                    addLi.textContent = errors[i];
                    errorContainer.appendChild(addLi);
                }
            }
        });
    }

    const addStoreStaticForm = document.getElementById('add-store-form');

    if (addStoreStaticForm) {
        const nameInput = document.getElementById('name');
        const addressInput = document.getElementById('address');
        const cityInput = document.getElementById('city');
        const stateInput = document.getElementById('state');
        const zipCodeInput = document.getElementById('zipCode');
        const phoneNumberInput = document.getElementById('phoneNumber');
        const emailAddressInput = document.getElementById('email');

        addStoreStaticForm.addEventListener('submit', (event) => {
            let errors = [];
            errorContainer.innerHTML = '';
            const name = nameInput.value.trim();
            const address = addressInput.value.trim();
            const city = cityInput.value.trim();
            const state = stateInput.value.trim();
            const zipCode = zipCodeInput.value.trim();
            const phoneNumber = phoneNumberInput.value.trim();
            const emailAddress = emailAddressInput.value.trim();

            nameInput.value = name;
            addressInput.value = address;
            cityInput.value = city;
            stateInput.value = state;
            zipCodeInput.value = zipCode;
            phoneNumberInput.value = phoneNumber;
            emailAddressInput.value = emailAddress;

            const storeNameRegex = /^[a-zA-Z0-9\s\-&',.()]{3,25}$/;
            if (!storeNameRegex.test(name)) {
                errors.push("Invalid store name (the store name should be 3 to 25 characters)");
            }

            const addressRegex = /^[a-zA-Z0-9\s\-,]+$/;
            if (!addressRegex.test(address)) {
                errors.push("Address contains invalid symbols");
            }
            if (address.length < 3) {
                errors.push("Address is less than 3 characters");
            }

            const cityRegex = /^[a-zA-Z\s\-]+$/;
            if (!cityRegex.test(city)) {
                errors.push("City contains invalid symbols");
            }
            if (city.length < 3) {
                errors.push("City is less than 3 characters");
            }

            const states = [
                "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
                "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
                "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
                "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
                "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
            ];
            if (!states.includes(state.toUpperCase())) {
                errors.push("State must be valid selected from the list");
            }

            if (zipCode.length !== 5) {
                throw "Zip must contain 5 numbers";
            }
            for (let i of zipCode) {
                if (i < '0' || i > '9') {
                    errors.push("Zip must contain only numbers!");
                }
            }

            const phoneRegex = /^\d{10}$/;
            if (!phoneRegex.test(phoneNumber)) {
                errors.push("US phone number must contain 10 digits numbers");
            }

            const emailAddressRegex = /\S+@\S+\.\S+/;
            if (!emailAddressRegex.test(emailAddress)) {
                errors.push("Email address should be a valid email address format. example@example.com");
            }

            if (errors.length > 0) {
                event.preventDefault();
                for (let i = 0; i < errors.length; i++) {
                    const addLi = document.createElement('li');
                    addLi.textContent = errors[i];
                    errorContainer.appendChild(addLi);
                }
            }
        });
    }

    const editStoreStaticForm = document.getElementById('edit-store-form');
    if (editStoreStaticForm) {
        const nameInput = document.getElementById('name');
        const addressInput = document.getElementById('address');
        const cityInput = document.getElementById('city');
        const stateInput = document.getElementById('state');
        const zipCodeInput = document.getElementById('zipCode');
        const phoneNumberInput = document.getElementById('phoneNumber');
        const emailAddressInput = document.getElementById('email');

        editStoreStaticForm.addEventListener('submit', (event) => {
            let errors = [];
            errorContainer.innerHTML = '';
            const name = nameInput.value.trim();
            const address = addressInput.value.trim();
            const city = cityInput.value.trim();
            const state = stateInput.value.trim();
            const zipCode = zipCodeInput.value.trim();
            const phoneNumber = phoneNumberInput.value.trim();
            const emailAddress = emailAddressInput.value.trim();

            nameInput.value = name;
            addressInput.value = address;
            cityInput.value = city;
            stateInput.value = state;
            zipCodeInput.value = zipCode;
            phoneNumberInput.value = phoneNumber;
            emailAddressInput.value = emailAddress;

            const storeNameRegex = /^[a-zA-Z0-9\s\-&',.()]{3,25}$/;
            if (!storeNameRegex.test(name)) {
                errors.push("Invalid store name (the store name should be 3 to 25 characters)");
            }

            const addressRegex = /^[a-zA-Z0-9\s\-,]+$/;
            if (!addressRegex.test(address)) {
                errors.push("Address contains invalid symbols");
            }
            if (address.length < 3) {
                errors.push("Address is less than 3 characters");
            }

            const cityRegex = /^[a-zA-Z\s\-]+$/;
            if (!cityRegex.test(city)) {
                errors.push("City contains invalid symbols");
            }
            if (city.length < 3) {
                errors.push("City is less than 3 characters");
            }

            const states = [
                "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
                "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
                "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
                "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
                "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
            ];
            if (!states.includes(state.toUpperCase())) {
                errors.push("State must be valid selected from the list");
            }

            if (zipCode.length !== 5) {
                throw "Zip must contain 5 numbers";
            }
            for (let i of zipCode) {
                if (i < '0' || i > '9') {
                    errors.push("Zip must contain only numbers!");
                }
            }

            const phoneRegex = /^\d{10}$/;
            if (!phoneRegex.test(phoneNumber)) {
                errors.push("US phone number must contain 10 digits numbers");
            }

            const emailAddressRegex = /\S+@\S+\.\S+/;
            if (!emailAddressRegex.test(emailAddress)) {
                errors.push("Email address should be a valid email address format. example@example.com");
            }

            if (errors.length > 0) {
                event.preventDefault();
                for (let i = 0; i < errors.length; i++) {
                    const addLi = document.createElement('li');
                    addLi.textContent = errors[i];
                    errorContainer.appendChild(addLi);
                }
            }
        });
    }
    const searchForm = document.getElementById('search-form')
    if (searchForm) {
        const searchTermInput = document.getElementById("searchTerm");
        const errorContainer = document.getElementById("errorContainer");
        searchForm.addEventListener('submit', (event) => {
            let errors = [];
            errorContainer.innerHTML = '';
            const searchTerm = searchTermInput.value.trim();
            if (typeof searchTerm !== "string") errors.push('The type of search term must be a string');
            if (searchTerm.length === 0) errors.push('A search term with only empty spaces is not valid');
            if (searchTerm.length > 25) errors.push('Search term is too long');

            if (errors.length > 0) {
                event.preventDefault();
                for (let i = 0; i < errors.length; i++) {
                    const addLi = document.createElement('li');
                    addLi.textContent = errors[i];
                    errorContainer.appendChild(addLi);
                }
            }
        })
    }

    const shareStaticForm = document.getElementById('share-form')
    if (shareStaticForm) {
        const sharedEmailInput = document.getElementById("friend-email");
        const shareNicknameInput = document.getElementById("user-nickname");
        const errorContainer = document.getElementById('errorContainer');

        shareStaticForm.addEventListener('submit', (event) => {
            let errors = [];
            errorContainer.innerHTML = '';
            const regexName = /^[a-zA-Z0-9]+$/
            const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            const shareEmail = sharedEmailInput.value.trim();
            if (!shareEmail || shareEmail.length === 0) errors.push('You must provide an email to share!');
            if (!shareEmail.toLowerCase().match(regexEmail)) errors.push('You must provide a valid email');

            const shareNickname = shareNicknameInput.value.trim();
            if (!shareNickname || shareNickname.length === 0) errors.push('You must provide a nick name');
            if (shareNickname.length <= 2 || shareNickname.length >= 20) errors.push('Nick name length should be between 2 and 20');
            if (!shareNickname.match(regexName)) errors.push('You must provide a valid nick name');


            if (errors.length > 0) {
                event.preventDefault();
                for (let i = 0; i < errors.length; i++) {
                    const addLi = document.createElement('li');
                    addLi.textContent = errors[i];
                    errorContainer.appendChild(addLi);
                }
            }
        })
    }

    const storecommentStaticForm = document.getElementById('storecomment-form');
    if (storecommentStaticForm) {
        const commentInput = document.getElementById("commentInput");
        const errorContainer = document.getElementById('errorContainer');
        storecommentStaticForm.addEventListener('submit', (event) => {
            let errors = [];
            errorContainer.innerHTML = '';

            const comment = commentInput.value.trim();
            commentInput.value = comment;
            if (!comment || comment.length < 25) errors.push('comment must more than 25 characters and not just space!');
            if (comment.length > 200) errors.push('comment cannot surpass 200 valid characters!');

            if (errors.length > 0) {
                event.preventDefault();
                for (let i = 0; i < errors.length; i++) {
                    const addLi = document.createElement('li');
                    addLi.textContent = errors[i];
                    errorContainer.appendChild(addLi);
                }
            }
        })
    }//addComment Page；

    const commentdetailStaticForm = document.getElementById('answer-form');
    if (commentdetailStaticForm) {
        const answerInput = document.getElementById("answerInput");
        const errorContainer = document.getElementById('errorContainer');
        commentdetailStaticForm.addEventListener('submit', (event) => {
            let errors = [];
            errorContainer.innerHTML = '';

            const answer = answerInput.value.trim();
            if (answer.length > 200) errors.push('answer cannot surpass 200 valid characters!');
            if (!answer) errors.push(`You must provide a answer`);
            if (answer.length === 0) errors.push(`answer cannot be an empty string or just spaces`);

            if (errors.length > 0) {
                event.preventDefault();
                for (let i = 0; i < errors.length; i++) {
                    const addLi = document.createElement('li');
                    addLi.textContent = errors[i];
                    errorContainer.appendChild(addLi);
                }
            }
        })
    }//add answer page

    const addReviewStaticForm = document.getElementById('add-review-form');
    if (addReviewStaticForm) {
        const errorContainer = document.getElementById('errorContainer');
        const reviewInput = document.getElementById("productReviews");
        const ratingInput = document.getElementById("productRating");
        addReviewStaticForm.addEventListener('submit', (event) => {
            let errors = [];
            errorContainer.innerHTML = '';

            const review = reviewInput.value.trim();
            const rating = ratingInput.value.trim();

            reviewInput.value = review;
            ratingInput.value = rating;

            if (review.length < 25 || review.length > 200) {
                errors.push("Review must be 25 - 200 characters")
            }

            if (rating !== '1' && rating !== '2' && rating !== '3' && rating !== '4' && rating !== '5') {
                errors.push("Rating should be 1 - 5");
            }
            if (errors.length > 0) {
                event.preventDefault();
                for (let i = 0; i < errors.length; i++) {
                    const addLi = document.createElement('li');
                    addLi.textContent = errors[i];
                    errorContainer.appendChild(addLi);
                }
            }
        })
    }

    const addProductStaticForm = document.getElementById('add-product-form');
    if (addProductStaticForm) {
        const productNameInput = document.getElementById('productName');
        const productCategoryInput = document.getElementById('productCategory');
        const productPriceInput = document.getElementById('productPrice');
        const manufactureDateInput = document.getElementById('manufactureDate');
        const expirationDateInput = document.getElementById('expirationDate');
        const errorContainer = document.getElementById('errorContainer');
        const stockInput = document.getElementById('stock');
        addProductStaticForm.addEventListener('submit', (event) => {
            let errors = [];
            errorContainer.innerHTML = '';
            const productName = productNameInput.value.trim();
            const productCategory = productCategoryInput.value.trim();
            const productPrice = productPriceInput.value.trim();
            const manufactureDate = manufactureDateInput.value.trim();
            const expirationDate = expirationDateInput.value.trim();
            let stock = stockInput.value.trim();

            productNameInput.value = productName;
            productCategoryInput.value = productCategory;
            productPriceInput.value = productPrice;
            manufactureDateInput.value = manufactureDate;
            expirationDateInput.value = expirationDate;
            stockInput.value = stock;

            if (!/^[a-zA-Z0-9\s\-&',.()]{3,25}$/.test(productName)) {
                errors.push("Invalid product name (the product name should be 3 to 25 characters)");
            }
            const categories = [
                "Fresh Produce",
                "Dairy Products",
                "Meat and Poultry",
                "Seafood",
                "Frozen Foods",
                "Bakery and Confectionery",
                "Beverages",
                "Snacks",
                "Canned and Jarred Goods",
                "Dry Goods and Staples"
            ];
            if (!categories.includes(productCategory)) {
                errors.push("The category should be valid selected from the list");
            }

            const reguExForPrice = /^[1-9][0-9]*(\.[0-9]{1,2})?$/;
            if (!reguExForPrice.test(productPrice.toString())) {
                errors.push("Product price should be a positive whole number, positive 2 decimal place float.");
            }
            if (manufactureDate.length === 0) {
                errors.push("Manufacture date should not be empty");
            }
            if (expirationDate.length === 0) {
                errors.push("Expiration date should not be empty");
            }
            const reguExForDate = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
            if (!manufactureDate.match(reguExForDate) ) {
                errors.push("Manufacture date should be in the format of MM/DD/YYYY");
            }
            if (!expirationDate.match(reguExForDate)) {
                errors.push("Expiration date should be in the format of MM/DD/YYYY");
            }
            const [month, day, year] = manufactureDate.split("/").map(Number); // split and convert string into number
            const dateObj = new Date(year, month - 1, day); // create a date object with the input date
            if (
                dateObj.getDate() !== day ||
                dateObj.getMonth() !== month - 1 ||
                dateObj.getFullYear() !== year
            ) {
                errors.push("Manufacture date should be a valid date");
            }
            const [month1, day1, year1] = expirationDate.split("/").map(Number); // split and convert string into number
            const dateObj1 = new Date(year1, month1 - 1, day1); // create a date object with the input date
            if (
                dateObj1.getDate() !== day1 ||
                dateObj1.getMonth() !== month1 - 1 ||
                dateObj1.getFullYear() !== year1
            ) {
                errors.push("Expiration date should be a valid date");
            }

            if (isNaN(dateObj.getTime()) || isNaN(dateObj1.getTime())) {
                errors.push("Manufacture date and expiration date should be a valid format");
            }

            const today = new Date();
            if (dateObj.getTime() > today.getTime()) {
                errors.push("Manufacture date should not be future date");
            }
            if (dateObj1.getTime() < today.getTime()) {
                errors.push("Expiration date should be future date");
            }

            if (dateObj > dateObj1) {
                errors.push("Manufacture date should be earlier than expiration date");
            }

            if (/^\d+$/.test(stock)) {
                stock = parseInt(stock, 10);
                if (stock < 1 || stock > 999) {
                    errors.push("Stock should be 1 - 999");
                }
            } else {
                errors.push('Stock should be a positive integer');
            }

            if (errors.length > 0) {
                event.preventDefault();
                for (let i = 0; i < errors.length; i++) {
                    const addLi = document.createElement('li');
                    addLi.textContent = errors[i];
                    errorContainer.appendChild(addLi);
                }
            }
        })
    }
    
})();
