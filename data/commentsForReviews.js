import { comment_collection, review_collection } from '../config/mongoCollections.js';
import * as usersFunctions from './users.js';
import * as reviewsFunctions from './reviewsForHousing.js';
import { ObjectId } from 'mongodb';
import xss from 'xss';
import helpers from '../helpers.js';
import validation from '../helpers.js';

const getAllCommentsByReviewId = async (review_id) => {
    review_id = xss(review_id);
    review_id = helpers.checkId(review_id, 'review_id');
    const commentsCollection = await comments();
    const comments = await commentsCollection.find({ review_id: new ObjectId(review_id) }).toArray();

    if (!comments || comments.length === 0) {
        throw new Error(`No comments found for review with id ${review_id}`);
    }
    return comments;
};

const getAllCommentsByUserId = async (user_id) => {
    user_id = xss(user_id);
    user_id = helpers.checkId(user_id, "user_id");
    const commentsCollection = await comments();

    const comments = await commentsCollection.find({ userId: new ObjectId(user_id) }).toArray();

    if (!comments || comments.length === 0) {
        throw new Error(`No comments found for user with id ${user_id}`);
    }
    return comments;
};

const addComment = async (comment) => {
    const user_id = helpers.checkId(comment.userId, 'user_id');
    const review_id = helpers.checkId(comment.reviewId, 'review_id');
    const commentText = helpers.checkString(comment.text, 'commentText');
    const firstName = helpers.checkString(comment.firstName, 'firstName');
    const lastName = helpers.checkString(comment.lastName, 'lastName');

    const commentsCollection = await comment_collection();

    const user = await usersFunctions.getUserById(user_id);
    if (!user) {
        throw new Error(`User with id ${user_id} does not exist.`);
    }

    const review = await reviewsFunctions.getReviewById(review_id);
    if (!review) {
        throw new Error(`Review with id ${review_id} does not exist.`);
    }

    let newComment = {
        reviewId: new ObjectId(review_id),
        userId: new ObjectId(user_id),
        firstName: firstName,
        lastName: lastName,
        comment: commentText,
        createdAt: new Date()
    };

    const insertResult = await commentsCollection.insertOne(newComment);
    if (insertResult.insertedCount === 0) {
        throw new Error('Failed to add the comment.');
    }

    return newComment;
};

const removeComment = async (comment_id) => {
    comment_id = helpers.checkId(comment_id, 'comment_id');
    const commentsCollection = await comment_collection();

    const deleteResult = await commentsCollection.deleteOne({ _id: new ObjectId(comment_id) });
    if (deleteResult.deletedCount === 0) {
        throw new Error(`Failed to delete the comment with id ${comment_id}`);
    }

    return { success: true, message: 'Comment successfully deleted.' };
};

const updateComment = async (comment_id, content) => {
    comment_id = helpers.checkId(comment_id, 'comment_id');
    content = helpers.checkString(content, 'content');

    const commentsCollection = await comment_collection();

    const updateResult = await commentsCollection.updateOne(
        { _id: new ObjectId(comment_id) },
        { $set: { comment: content } }
    );

    if (updateResult.modifiedCount === 0) {
        throw new Error(`No comment updated for comment id ${comment_id}`);
    }

    return { success: true, message: 'Comment successfully updated.' };
};

const getCommentById = async (comment_id) => {
    comment_id = helpers.checkId(comment_id, 'comment_id');

    const commentsCollection = await comment_collection();

    const comment = await commentsCollection.findOne({ _id: new ObjectId(comment_id) });

    if (!comment) {
        throw new Error(`No comment found with id ${comment_id}`);
    }

    return comment;
};

const addCommentToReview = async (reviewId, comment) => {
    reviewId = validation.checkId(reviewId, 'review_id');

    const reviewCollection = await review_collection();

    const updateResult = await reviewCollection.updateOne(
        { _id: new ObjectId(reviewId) },
        { $push: { comments: comment } }
    );

    if (updateResult.matchedCount === 0) {
        throw new Error('No review found with the provided ID.');
    }
    if (updateResult.modifiedCount === 0) {
        throw new Error('Failed to add comment to the review.');
    }

    return updateResult;
};

const removeCommentFromReview = async (reviewId, commentId) => {
    reviewId = validation.checkId(reviewId, 'review_id');
    commentId = validation.checkId(commentId, 'comment_id');

    const reviewCollection = await review_collection();

    const updateResult = await reviewCollection.updateOne(
        { _id: new ObjectId(reviewId) },
        { $pull: { comments: { _id: new ObjectId(commentId) } } }
    );

    if (updateResult.matchedCount === 0) {
        throw new Error('No review found with the provided ID.');
    }
    if (updateResult.modifiedCount === 0) {
        throw new Error('Failed to remove comment from the review.');
    }

    return updateResult;
};

export {
    getAllCommentsByReviewId,
    getAllCommentsByUserId,
    addComment,
    removeComment,
    updateComment,
    getCommentById,
    addCommentToReview,
    removeCommentFromReview
};
