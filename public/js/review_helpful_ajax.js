(function ($) {
    $(document).on('click', '.helpful-button', function() {
        const reviewId = $(this).data('review-id');
        $.ajax({
            url: '/reviews/helpful/' + reviewId,
            type: 'POST',
            success: function(response) {
                $('#helpful-count-' + reviewId).text(response.helpfulCounts);
            },
            error: function(error) {
                console.error('Error updating helpful count:', error);
            }
        });
    });
})(window.jQuery);
