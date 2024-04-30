(function ($) {
    let updateReviewForm = $('#update-review-form'),
        deleteReviewForm = $('#delete-review-form'),
        errorContainer = $('#errorContainer'),
        review = $('#productReviews'),
        rating = $('#productRating');

    errorContainer.hide();
    updateReviewForm.submit((event) => {
        let reviewTerm = review.val().trim();
        let ratingTerm = rating.val().trim();
        let errors = [];

        if (reviewTerm.length < 25) {
            errors.push(`This product's review ${reviewTerm} should not be less than 25 characters.`)
        }

        const ratingRange = ['1', '2', '3', '4', '5'];
        if (!ratingRange.includes(ratingTerm)) {
            errors.push('Rating must be between 1 and 5');
        }

        if (errors.length > 0) {
            event.preventDefault();
            errorContainer.empty();
            for (let error of errors) {
                errorContainer.append(error);
            }
            errorContainer.show();
            return;
        }

    });

    deleteReviewForm.submit(async (event) => {
        const currentLink = window.location.href;
        let requestConfig = {
            method: 'DELETE',
            url: currentLink,
        }
        await $.ajax(requestConfig).then((responseMessage) => {
            if (responseMessage.deleteReview) {
                window.location.href = '/profile';
                return;
            }
            errorContainer.empty();
            errorContainer.append('Delete review fail');
            errorContainer.show();
        })
    });
})(window.jQuery);
