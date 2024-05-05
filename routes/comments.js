import express from 'express';
import {addComment, addCommentToReview, getCommentById, removeComment, removeCommentFromReview} from '../data/commentsForReviews.js';
const router = express.Router();
import helpers from '../helpers.js';
import xss from 'xss';
import { getReviewById } from '../data/reviewsForHousing.js';

router.post('/add/:reviewId', async (req, res) => {
    const reviewId = req.params.reviewId;
    const comment = xss(req.body.comment);
    const review= await getReviewById(reviewId);
    if (!helpers.checkId(reviewId, 'Review ID')) {
        return res.status(400).send('Invalid Review ID');
    }

    if (!comment) {
        return res.status(400).send("Comment field is required.");
    }

    try {
        const newComment = {
            reviewId: reviewId,
            text: comment,
            firstName : req.session.user.firstName,
            lastName : req.session.user.lastName,
            userId: req.session.user.id,
            createdAt: new Date()
        };
        const updatedReview = await addCommentToReview(reviewId, newComment);
        const housingId= review.houseId.toString();
        await addComment(newComment);
        res.redirect(`/housing/${housingId}`);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).send('Failed to add comment due to server error.');
    }
});

router.get('/:commentId', async (req, res) => {
    const commentId = req.params.commentId;

    if (!helpers.checkId(commentId, 'Comment ID')) {
        return res.status(400).send('Invalid Comment ID');
    }

    try {
        const comment = await getCommentById(commentId);
        if (!comment) {
            return res.status(404).send("Comment not found.");
        }

        const cleanComment = {
            ...comment,
            text: xss(comment.text)
        };

        // 假设你有一个对应的模板来显示评论详情
        // 如果你需要显示评论回复或相关信息，确保模板和数据适配这一需求
        res.render('commentDetail', {
            title: `Comment by ${comment.userId}`,
            comment: cleanComment
        });
    } catch (error) {
        console.error('Error fetching comment:', error);
        res.status(500).send('Server error occurred while fetching the comment.');
    }
});

router.get('/addComment/:reviewId', async (req, res) => {
    try {
        if (!req.session.user) {
            res.status(403).render('error', { title: "Forbidden", error: "You are not authorized to add comments" });
            return;
        }
        
        const reviewId = req.params.reviewId;
        const review = await getReviewById(reviewId);
        res.render('addComment', { title: "Add Comments" ,
                                review : review
                            });
    } catch (error) {
        console.error('Error rendering add reviews page:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/delete/:commentId', async (req, res) => {
    const commentId = req.params.commentId;

    // First, find the review that contains the comment
    const comment = await getCommentById(commentId);
    const reviewId= comment.reviewId;
    const review= await getReviewById(reviewId);
    const housingId= review.houseId.toString();
    // Validate the commentId before attempting to delete
    if (!helpers.checkId(commentId, 'Comment ID')) {
        return res.status(400).send('Invalid Comment ID');
    }

    try {
        // Proceed to delete the comment from the review
        const updatedReview = await removeCommentFromReview(reviewId, commentId);
        await removeComment(commentId);
        res.redirect(`/housing/${housingId}`);  // Redirecting back to the review page or to another appropriate page
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).send('Failed to delete comment due to server error.');
    }
});

router.post('/delete/:commentId', async (req, res) => {
    const commentId = req.params.commentId;

    try {
        await deleteComment(commentId, reviewId);
        
        await removeCommentfromReview(commen)
        res.send('Comment deleted successfully');
    } catch (error) {
        console.error('Failed to delete comment:', error);
        res.status(500).send('Error deleting comment');
    }
});

export default router;
