// public/js/review_helpful_ajax.js
(function ($) {
    // Attach event handler using jQuery for better handling of JavaScript outside HTML
    $(document).on('click', '.helpful-button', function() {
        const reviewId = $(this).data('review-id');  // Assuming data-review-id attribute is added to the button
        $.ajax({
            url: '/reviews/helpful/' + reviewId,
            type: 'POST',
            success: function(response) {
                // Update the count on the button directly without reloading
                $('#helpful-count-' + reviewId).text(response.helpfulCounts);
            },
            error: function(error) {
                console.error('Error updating helpful count:', error);
            }
        });
    });
})(window.jQuery);
