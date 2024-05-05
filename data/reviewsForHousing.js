import {ObjectId} from "mongodb";
import validation from '../helpers.js';
import validator from "validator";
import {review_collection} from '../config/mongoCollections.js';


const getAllReviewsByHouseId = async (house_id) => {
    house_id = validation.checkId(house_id, 'house_id');  // Validate house ID

    const reviewsCollection = await review_collection();  // Assuming reviews() returns the reviews collection
    const reviews = await reviewsCollection.find({houseId: new ObjectId(house_id)}).toArray();

    // if (reviews.length === 0) {
    //     throw new Error(`No reviews found for house with id ${house_id}`);
    // }

    return reviews;  // Return the list of reviews
};




const getAllReviewsByUserId = async (user_id) => {
  // Validate user ID
  user_id = validation.checkId(user_id, 'user_id');

  // Assuming reviews() returns the reviews collection
  const reviewsCollection = await review_collection();

  // Find reviews where the userId matches the provided user_id
  const res = await reviewsCollection.find({userId: new ObjectId(user_id)}).toArray();

  // Check if any reviews are found
  if (res.length === 0) {
      throw new Error(`No reviews found for user with id ${user_id}`);
  }

  // Return the list of reviews
  return res;
};



const getReviewById = async (review_id) => {
    review_id = validation.checkId(review_id, 'review_id');  // Validate review ID

    const reviewsCollection = await review_collection();  // Assuming reviews() returns the reviews collection
    const review = await reviewsCollection.findOne({_id: new ObjectId(review_id)});

    if (!review) {
        throw new Error(`No review found with id ${review_id}`);
    }

    return review;  // Return the review
};

const addReview = async (review) => {
    // Validate each part of the review object
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

    // Create a new review with updated timestamps
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

    return newReview;  // Return the newly created review object
};

const removeReviewById = async (review_id) => {
    review_id = validation.checkId(review_id, 'review_id');  // Validate review ID

    const reviewsCollection = await review_collection();  // Assuming reviews() returns the reviews collection
    const deleteResult = await reviewsCollection.deleteOne({_id: new ObjectId(review_id)});

    if (deleteResult.deletedCount === 0) {
        throw new Error(`Failed to delete the review with id ${review_id}`);
    }

    return {success: true, message: 'Review successfully deleted.'};
};

const updateReview = async (review_id, updates) => {
    review_id = validation.checkId(review_id, 'review_id');  // Validate review ID

    // Ensure there is something to update
    if (Object.keys(updates).length === 0) {
        throw new Error("No updates provided");
    }

    const reviewsCollection = await review_collection();  // Assuming reviews() returns the reviews collection

    // Prepare update object
    const updateData = {};
    if (updates.rating) updateData.rating = helpers.checkNumber(updates.rating, 'rating');
    if (updates.title) updateData.title = helpers.checkString(updates.title, 'title');
    if (updates.body) updateData.body = helpers.checkString(updates.body, 'body');
    if (updates.images) updateData.images = updates.images; // Assuming images are an array of strings

    updateData.updatedAt = new Date(); // Update the updatedAt timestamp

    // Perform the update
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

    // Increment the helpfulCounts field
    const updateResult = await reviewsCollection.updateOne(
        { _id: new ObjectId(review_id) },
        { $inc: { helpfulCounts: 1 } }  // Use $inc to increment helpfulCounts by 1
    );

    if (!updateResult.matchedCount) {
        console.log("No review found with ID:", review_id);
        return null;
    }

    if (!updateResult.modifiedCount) {
        console.log("The helpful count was not updated.");
        return null;
    }

    // Return the new helpful count
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
    updateReviewHelpfulCount
};
