import express from 'express';
import {addReview, updateReview, updateReviewHelpfulCount, updateAverageRating, getReviewById, removeReviewById, checkUserReviewExists} from '../data/reviewsForHousing.js';
import {getHousingById, addReviewIdToHousing, removeReviewIdFromHousing} from '../data/housing.js';
const router = express.Router();
import helpers from '../helpers.js';
import xss from 'xss';
import {ObjectId} from "mongodb";

router.get('/edit/:reviewId', async (req, res) => {
    try {
        const reviewId = req.params.reviewId;

        if (!helpers.checkId(reviewId, 'Review ID')) {
            return res.status(400).send('Invalid Review ID');
        }

        const review = await getReviewById(reviewId);
        if (!review) {
            return res.status(404).send("Review not found.");
        }

        review.id = review._id;

        const cleanReview = {
            ...review,
            title: xss(review.title),
            body: xss(review.body)
        };

        res.render('editReview', {
            review: cleanReview,
            housing: {id: review.housingId}
        });
    } catch (error) {
        console.error('Error fetching review:', error);
        res.status(500).send('Server error occurred while fetching the review.');
    }
});

router.post('/add/:housingId', async (req, res) => {
    const housingId = req.params.housingId;

    if (!helpers.checkId(housingId, 'Housing ID')) {
        return res.status(400).send('Invalid Housing ID');
    }

    const userId = req.session.user.id;

    // Check if the user has already reviewed this housing
    const existingReview = await checkUserReviewExists(housingId, userId);
    if (existingReview) {
        res.status(400).render('error', {title: "Error", error: "You have already reviewed this housing."});
        return;
    }

    const title = xss(req.body.title);
    const rating = xss(req.body.rating);
    const body = xss(req.body.body);
    const images = req.body.images ? req.body.images : "";

    if (!title || !rating || !body) {
        return res.status(400).send("All required fields must be filled.");
    }

    const cleanRating = parseInt(rating);
    if (isNaN(cleanRating) || cleanRating < 1 || cleanRating > 5) {
        return res.status(400).send("Rating must be an integer between 1 and 5.");
    }

    const imageUrls = images.split(',').map(url => xss(url.trim()));

    const review = {
        houseId: housingId,
        userId: userId,
        title: title,
        rating: cleanRating,
        body: body,
        images: imageUrls,
        helpfulCounts: 0,
        comments: []
    };

    try {
        const newReview = await addReview(review);
        await addReviewIdToHousing(housingId, newReview._id.toString());
        await updateAverageRating(housingId); // Update average rating after adding a review
        res.redirect(`/housing/${housingId}`);
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).send('Failed to add review due to server error.');
    }
});

router.post('/edit/:reviewId', async (req, res) => {
    const reviewId = req.params.reviewId;

    if (!helpers.checkId(reviewId, 'Review ID')) {
        return res.status(400).send('Invalid Review ID');
    }

    try {
        const title = xss(helpers.checkString(req.body.title, 'Title'));
        const rating = xss(req.body.rating);
        const body = xss(helpers.checkString(req.body.body, 'Body'));
        const images = req.body.images ? req.body.images : "";

        if (!title || !rating || !body) {
            return res.status(400).send("All required fields must be filled.");
        }

        const cleanRating = parseInt(rating);
        if (isNaN(cleanRating) || cleanRating < 1 || cleanRating > 5) {
            return res.status(400).send("Rating must be an integer between 1 and 5.");
        }

        const imageUrls = images.split(',').map(url => xss(url.trim()));

        const updatedReview = {
            title,
            rating: cleanRating,
            body,
            images: imageUrls
        };

        const review= await getReviewById(reviewId);
        if (!helpers.checkId(reviewId, 'Review ID')) {
            return res.status(400).send('Invalid Review ID');
        }
        const housingId = review.houseId;

        if (!ObjectId.isValid(housingId)) {
            res.status(400).send('Invalid housing ID');
            return;
        }

        await updateReview(reviewId, updatedReview);
        await updateAverageRating(housingId.toString()); // Update average rating after adding a review

        res.redirect(`/housing/${housingId}`);
    } catch (error) {
        console.error('Failed to update review:', error);

        res.status(500).send('Failed to update review due to server error.');
    }
});

router.get('/delete/:reviewId', async (req, res) => {
    const reviewId = req.params.reviewId;

    if (!helpers.checkId(reviewId, 'Review ID')) {
        return res.status(400).send('Invalid Review ID');
    }

    try {
        const review= await getReviewById(reviewId);
        if (!helpers.checkId(reviewId, 'Review ID')) {
            return res.status(400).send('Invalid Review ID');
        }
        const housingId = review.houseId;
        if (!ObjectId.isValid(housingId)) {
            res.status(400).send('Invalid housing ID');
            return;
        }
        await removeReviewIdFromHousing(housingId.toString(), reviewId);
        const result = await removeReviewById(reviewId);
        if (result.deletedCount === 0) {
            return res.status(404).send("No review found with that ID.");
        }

        await updateAverageRating(housingId.toString()); // Update average rating after adding a review
        res.redirect(`/housing/${housingId}`);
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).send('Server error occurred while deleting the review.');
    }
});

router.get('/addReview/:housingId', async (req, res) => {
    try {
        if (!req.session.user) {
            res.status(403).render('error', {title: "Forbidden", error: "You are not authorized to add reviews"});
            return;
        }

        const housingId = req.params.housingId;
        const house = await getHousingById(housingId);
        res.render('addReview', {
            title: "Add Reviews",
            housing: house
        });
    } catch (error) {
        console.error('Error rendering add reviews page:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/helpful/:reviewId', async (req, res) => {
    try {
        const reviewId = req.params.reviewId;
        const userId = req.session.user.id; // Assuming user ID is stored in session

        if (!helpers.checkId(reviewId, 'Review ID') || !helpers.checkId(userId, 'User ID')) {
            return res.status(400).send('Invalid IDs provided');
        }

        const updatedReview = await updateReviewHelpfulCount(reviewId, userId);
        if (!updatedReview) {
            return res.status(404).send('Review not found, already marked as helpful, or update failed');
        }

        res.json({ helpfulCounts: updatedReview.helpfulCounts });
    } catch (error) {
        console.error('Failed to mark review as helpful:', error);
        res.status(500).send('Internal Server Error');
    }
});

export default router;
