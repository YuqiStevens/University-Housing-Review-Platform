import {ObjectId} from "mongodb";
import validation from '../helpers.js';
import validator from "validator";
import {review_collection} from '../config/mongoCollections.js';
import { housing_collection } from "../config/mongoCollections.js";

const getAllReviewsByHouseId = async (house_id) => {
    house_id = validation.checkId(house_id, 'house_id');  // Validate house ID

    const reviewsCollection = await review_collection();
    const reviews = await reviewsCollection.find({houseId: new ObjectId(house_id)}).toArray();


    return reviews;
};

const updateAverageRating = async (housingId) => {
    const reviews = await getAllReviewsByHouseId(housingId);
    if (reviews.length === 0) return;

    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    await updateHousingRating(housingId, averageRating);
};

const updateHousingRating = async (housingId, newRating) => {
    const housingsCollection = await housing_collection();

    const updateInfo = await housingsCollection.updateOne(
        {_id: new ObjectId(housingId)},
        {$set: {rating: newRating}}
    );

    if (updateInfo.modifiedCount === 0) {
        throw new Error("Failed to update the housing rating.");
    }
};

const getAllReviewsByUserId = async (user_id) => {
  user_id = validation.checkId(user_id, 'user_id');

  const reviewsCollection = await review_collection();

  const res = await reviewsCollection.find({userId: new ObjectId(user_id)}).toArray();

  if (res.length === 0) {
      throw new Error(`No reviews found for user with id ${user_id}`);
  }

  return res;
};

const getReviewById = async (review_id) => {
    review_id = validation.checkId(review_id, 'review_id');  // Validate review ID

    const reviewsCollection = await review_collection();
    const review = await reviewsCollection.findOne({_id: new ObjectId(review_id)});

    if (!review) {
        throw new Error(`No review found with id ${review_id}`);
    }

    return review;
};

const addReview = async (review) => {
    review.houseId = validation.checkId(review.houseId, 'house_id');
    review.userId = validation.checkId(review.userId, 'user_id');
    if (!Number.isInteger(review.rating)) {
        throw new Error("Rating must be an integer.");
    }
    review.title = validation.checkString(review.title, 'title');
    review.body = validation.checkString(review.body, 'body');
    review.images = review.images || [];
    review.helpfulCounts = review.helpfulCounts || 0;
    review.comments = review.comments || [];

    const reviewsCollection = await review_collection();  // Assuming review_collection() returns the reviews collection
    const newReview = {
        ...review,
        houseId: new ObjectId(review.houseId),
        userId: new ObjectId(review.userId),
        createdAt: new Date(),
        updatedAt: new Date()
    };

    // Insert the new review into the database
    const insertResult = await reviewsCollection.insertOne(newReview);
    if (insertResult.insertedCount === 0) {
        throw new Error('Failed to add the review.');
    }

    return newReview;
};

const removeReviewById = async (review_id) => {
    review_id = validation.checkId(review_id, 'review_id');  // Validate review ID

    const reviewsCollection = await review_collection();
    const deleteResult = await reviewsCollection.deleteOne({_id: new ObjectId(review_id)});

    if (deleteResult.deletedCount === 0) {
        throw new Error(`Failed to delete the review with id ${review_id}`);
    }

    return {success: true, message: 'Review successfully deleted.'};
};

const updateReview = async (review_id, updates) => {
    review_id = validation.checkId(review_id, 'review_id');

    if (Object.keys(updates).length === 0) {
        throw new Error("No updates provided");
    }

    const reviewsCollection = await review_collection();

    const updateData = {};
    if (!Number.isInteger(updates.rating)) {
        throw new Error("Rating must be an integer.");
    }
    updateData.rating = updates.rating;

    if (updates.title) updateData.title = validation.checkString(updates.title, 'title');
    if (updates.body) updateData.body = validation.checkString(updates.body, 'body');
    if (updates.images) updateData.images = updates.images;

    updateData.updatedAt = new Date();

    const updateResult = await reviewsCollection.updateOne(
        {_id: new ObjectId(review_id)},
        {$set: updateData}
    );

    if (updateResult.modifiedCount === 0) {
        throw new Error(`No review updated for review id ${review_id}`);
    }

    return {success: true, message: 'Review successfully updated.'};
};

const updateReviewHelpfulCount = async (review_id) => {
    review_id = validation.checkId(review_id, 'review_id');
    const reviewsCollection = await review_collection();

    const updateResult = await reviewsCollection.updateOne(
        { _id: new ObjectId(review_id) },
        { $inc: { helpfulCounts: 1 } }
    );

    if (!updateResult.matchedCount) {
        console.log("No review found with ID:", review_id);
        return null;
    }

    if (!updateResult.modifiedCount) {
        console.log("The helpful count was not updated.");
        return null;
    }

    const updatedReview = await reviewsCollection.findOne({ _id: new ObjectId(review_id) });
    return updatedReview;
};

export {
    getAllReviewsByUserId,
    getAllReviewsByHouseId,
    getReviewById,
    addReview,
    removeReviewById,
    updateReview,
    updateReviewHelpfulCount,
    updateAverageRating
};
