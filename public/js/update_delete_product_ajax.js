(function ($) {
    let deleteProductForm = $('#delete-product-form'),
        updateProductForm = $('#edit-product-form'),
        productNameInput = $('#productName'),
        productCategoryInput = $('#productCategory'),
        productPriceInput = $('#productPrice'),
        manufactureDateInput = $('#manufactureDate'),
        expirationDateInput = $('#expirationDate'),
        stockInput = $('#stock'),
        errorContainer = $('#errorContainer');

    errorContainer.hide();

    updateProductForm.submit((event) => {
        let productNameTerm = productNameInput.val().trim();
        let productCategoryTerm = productCategoryInput.val().trim();
        let productPriceTerm = productPriceInput.val().trim();
        let manufactureDateTerm = manufactureDateInput.val().trim();
        let expirationDateTerm = expirationDateInput.val().trim();
        let stockTerm = stockInput.val().trim();
        let errors = [];

        if (!/^[a-zA-Z0-9\s\-&',.()]{3,25}$/.test(productNameTerm)) {
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
        if (!categories.includes(productCategoryTerm)) {
            errors.push("The category should be valid selected from the list");
        }

        const reguExForPrice = /^[1-9][0-9]*(\.[0-9]{1,2})?$/;
        if (!reguExForPrice.test(productPriceTerm.toString())) {
            errors.push("Product price should be a positive whole number, positive 2 decimal place float.");
        }
        if (manufactureDateTerm.length === 0) {
            errors.push("Manufacture date should not be empty");
        }
        if (expirationDateTerm.length === 0) {
            errors.push("Expiration date should not be empty");
        }
        const reguExForDate = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
        if (!manufactureDateTerm.match(reguExForDate) ) {
            errors.push("Manufacture date should be in the format of MM/DD/YYYY");
        }
        if (!expirationDateTerm.match(reguExForDate)) {
            errors.push("Expiration date should be in the format of MM/DD/YYYY");
        }
        const [month, day, year] = manufactureDateTerm.split("/").map(Number); // split and convert string into number
        const dateObj = new Date(year, month - 1, day); // create a date object with the input date
        if (
            dateObj.getDate() !== day ||
            dateObj.getMonth() !== month - 1 ||
            dateObj.getFullYear() !== year
        ) {
            errors.push("Manufacture date should be a valid date");
        }
        const [month1, day1, year1] = expirationDateTerm.split("/").map(Number); // split and convert string into number
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

        if (/^\d+$/.test(stockTerm)) {
            stockTerm = parseInt(stockTerm, 10);
            if (stockTerm < 0 || stockTerm > 999) {
                errors.push("Stock should be 0 - 999");
            }
        } else {
            errors.push('Stock should be a positive integer');
        }

        if (errors.length > 0) {
            event.preventDefault();
            errorContainer.empty();
            for (let error of errors) {
                errorContainer.append(error);
                errorContainer.append('<br>')
            }
            errorContainer.show();
            return;
        }
    });

    deleteProductForm.submit(async (event) => {
        event.preventDefault()
        const currentLink = window.location.href;
        let requestConfig = {
            method: 'DELETE',
            url: currentLink,
        }
        await $.ajax(requestConfig).then((responseMessage) => {
            if (responseMessage.deleteReview) {
                console.log(responseMessage.deleteReview);
                window.location.href = `/store/${responseMessage.store_id}`;
                return;
            }
            errorContainer.empty();
            errorContainer.append('Delete product fail');
            errorContainer.show();
        })
    });

})(window.jQuery);