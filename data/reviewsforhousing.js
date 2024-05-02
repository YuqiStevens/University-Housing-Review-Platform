import { reviewsforstores } from "../config/mongoCollections.js";
import validation from "../validation.js";
import { ObjectId } from "mongodb";
import { reviews } from '../config/mongoCollections.js';

const getAllReviewsByHouseId = async (house_id) => {
  house_id = helpers.checkId(house_id, 'house_id');  // Validate house ID

  const reviewsCollection = await reviews();  // Assuming reviews() returns the reviews collection
  const reviews = await reviewsCollection.find({ houseId: new ObjectId(house_id) }).toArray();

  if (reviews.length === 0) {
      throw new Error(`No reviews found for house with id ${house_id}`);
  }

  return reviews;  // Return the list of reviews
};

const getReviewById = async (review_id) => {
  review_id = helpers.checkId(review_id, 'review_id');  // Validate review ID

  const reviewsCollection = await reviews();  // Assuming reviews() returns the reviews collection
  const review = await reviewsCollection.findOne({ _id: new ObjectId(review_id) });

  if (!review) {
      throw new Error(`No review found with id ${review_id}`);
  }

  return review;  // Return the review
};

const addReview = async (house_id, user_id, rating, title, body, images = [], helpfulCounts = 0, comments = []) => {
  house_id = helpers.checkId(house_id, 'house_id');
  user_id = helpers.checkId(user_id, 'user_id');
  rating = helpers.checkNumber(rating, 'rating');
  title = helpers.checkString(title, 'title');
  body = helpers.checkString(body, 'body');

  const reviewsCollection = await reviews();  // Assuming reviews() returns the reviews collection

  const newReview = {
      houseId: new ObjectId(house_id),
      userId: new ObjectId(user_id),
      rating,
      title,
      body,
      images,
      helpfulCounts,
      comments,
      createdAt: new Date(),
      updatedAt: new Date()
  };

  const insertResult = await reviewsCollection.insertOne(newReview);
  if (insertResult.insertedCount === 0) {
      throw new Error('Failed to add the review.');
  }

  return newReview;  // Return the newly created review object
};

const removeReviewById = async (review_id) => {
  review_id = helpers.checkId(review_id, 'review_id');  // Validate review ID

  const reviewsCollection = await reviews();  // Assuming reviews() returns the reviews collection
  const deleteResult = await reviewsCollection.deleteOne({ _id: new ObjectId(review_id) });

  if (deleteResult.deletedCount === 0) {
      throw new Error(`Failed to delete the review with id ${review_id}`);
  }

  return { success: true, message: 'Review successfully deleted.' };
};

const updateReview = async (review_id, updates) => {
  review_id = helpers.checkId(review_id, 'review_id');  // Validate review ID

  // Ensure there is something to update
  if (Object.keys(updates).length === 0) {
      throw new Error("No updates provided");
  }

  const reviewsCollection = await reviews();  // Assuming reviews() returns the reviews collection

  // Prepare update object
  const updateData = {};
  if (updates.rating) updateData.rating = helpers.checkNumber(updates.rating, 'rating');
  if (updates.title) updateData.title = helpers.checkString(updates.title, 'title');
  if (updates.body) updateData.body = helpers.checkString(updates.body, 'body');
  if (updates.images) updateData.images = updates.images; // Assuming images are an array of strings

  updateData.updatedAt = new Date(); // Update the updatedAt timestamp

  // Perform the update
  const updateResult = await reviewsCollection.updateOne(
      { _id: new ObjectId(review_id) },
      { $set: updateData }
  );

  if (updateResult.modifiedCount === 0) {
      throw new Error(`No review updated for review id ${review_id}`);
  }

  return { success: true, message: 'Review successfully updated.' };
};

export  {
  getAllReviewsByHouseId,
  getReviewById,
  addReview,
  removeReviewById,
  updateReview,
};
