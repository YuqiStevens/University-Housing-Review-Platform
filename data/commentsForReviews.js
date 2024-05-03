import { comment_collection } from '../config/mongoCollections.js';
import * as usersFunctions from './users.js';
import * as reviewsFunctions from './reviewsForHousing.js';
import { ObjectId } from 'mongodb';
import xss from 'xss';
import helpers from '../helpers.js';

const getAllCommentsByReviewId = async (review_id) => {
    review_id = xss(review_id);
    review_id = helpers.checkId(review_id, 'review_id');
    const commentsCollection = await comments();
    // Query to find all comments for a given review_id
    const comments = await commentsCollection.find({ review_id: new ObjectId(review_id) }).toArray();

    if (!comments || comments.length === 0) {
        throw new Error(`No comments found for review with id ${review_id}`);
    }
    return comments;  // Return the array of comments
};

const getAllCommentsByUserId = async (user_id) => {
    user_id = xss(user_id);
    user_id = helpers.checkId(user_id, "user_id");
    const commentsCollection = await comments(); // Assuming comments() returns the comments collection

    // Query to find all comments made by the specific user
    const comments = await commentsCollection.find({ userId: new ObjectId(user_id) }).toArray();

    if (!comments || comments.length === 0) {
        throw new Error(`No comments found for user with id ${user_id}`);
    }
    return comments; // Return the array of comments
};

const addComment = async (user_id, review_id, commentText) => {
    user_id = helpers.checkId(user_id, 'user_id');
    review_id = helpers.checkId(review_id, 'review_id');
    commentText = helpers.checkString(commentText, 'commentText');

    const commentsCollection = await comment_collection();

    // Ensure the user exists (assuming a getUserById function)
    const user = await usersFunctions.getUserById(user_id);
    if (!user) {
        throw new Error(`User with id ${user_id} does not exist.`);
    }

    // Ensure the review exists (assuming a getReviewById function)
    const review = await reviewsFunctions.getReviewById(review_id);
    if (!review) {
        throw new Error(`Review with id ${review_id} does not exist.`);
    }

    let newComment = {
        _id: new ObjectId(),
        reviewId: new ObjectId(review_id),
        userId: new ObjectId(user_id),
        comment: commentText,
        createdAt: new Date()
    };

    const insertResult = await commentsCollection.insertOne(newComment);
    if (insertResult.insertedCount === 0) {
        throw new Error('Failed to add the comment.');
    }

    return newComment; // Return the newly created comment object
};

const removeComment = async (comment_id) => {
    comment_id = helpers.checkId(comment_id, 'comment_id'); // Validate the comment ID
    const commentsCollection = await comment_collection(); // Assuming comments() returns the comments collection

    const deleteResult = await commentsCollection.deleteOne({ _id: new ObjectId(comment_id) });
    if (deleteResult.deletedCount === 0) {
        throw new Error(`Failed to delete the comment with id ${comment_id}`);
    }

    return { success: true, message: 'Comment successfully deleted.' };
};

const updateComment = async (comment_id, content) => {
    comment_id = helpers.checkId(comment_id, 'comment_id'); // Validate comment ID
    content = helpers.checkString(content, 'content'); // Validate content

    const commentsCollection = await comment_collection(); // Assuming comments() returns the comments collection

    // Update the comment in the database
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
    comment_id = helpers.checkId(comment_id, 'comment_id'); // Validate the comment ID

    const commentsCollection = await comment_collection(); // Assuming comments() returns the comments collection

    // Fetch the comment from the database
    const comment = await commentsCollection.findOne({ _id: new ObjectId(comment_id) });

    if (!comment) {
        throw new Error(`No comment found with id ${comment_id}`);
    }

    return comment; // Return the found comment
};

export {
    getAllCommentsByReviewId,
    getAllCommentsByUserId,
    addComment,
    removeComment,
    updateComment,
    getCommentById
};
