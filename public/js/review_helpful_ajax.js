(function ($) {
    $(document).on('click', '.helpful-button', function() {
        const reviewId = $(this).data('review-id');
        const $button = $(this);
        if ($button.data('clicked')) return; // Prevent multiple clicks

        $.ajax({
            url: '/reviews/helpful/' + reviewId,
            type: 'POST',
            success: function(response) {
                $('#helpful-count-' + reviewId).text(response.helpfulCounts);
                $button.data('clicked', true); // Mark as clicked
            },
            error: function(error) {
                console.error('Error updating helpful count:', error);
            }
        });
    });
})(window.jQuery);
