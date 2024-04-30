import { reviewsforstores } from "../config/mongoCollections.js";
import validation from "../validation.js";
import { ObjectId } from "mongodb";

const getAllReviews = async () => {
  const reviewsCollection = await reviewsforstores();
  const reviews = await reviewsCollection.find({}).toArray();
  return reviews;
};
const getReviewById = async (id) => {
  validation.checkId(id);
  const reviewsCollection = await reviewsforstores();
  const review = await reviewsCollection.findOne({ _id: new ObjectId(id) });
  if (!review) throw "Review not found";
  return review;
};
const addReview = async (review) => {
  const reviewsCollection = await reviewsforstores();
  const newInsertInformation = await reviewsCollection.insertOne(review);
  const newId = newInsertInformation.insertedId;
  return await getReviewById(newId.toString());
};
const removeReview = async (id) => {
  const reviewsCollection = await reviewsforstores();
  const deletionInfo = await reviewsCollection.findOneAndDelete({
    _id: new ObjectId(id),
  });
  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete review with id of ${id}`;
  }
  console.log(deletionInfo);
  return deletionInfo;
};
const updateReview = async (id, updatedReview) => {
  const reviewsCollection = await reviewsforstores();
  const updatedReviewData = {};
  if (updatedReview.user_id) {
    updatedReviewData.user_id = updatedReview.user_id;
  }
  if (updatedReview.store_id) {
    updatedReviewData.store_id = updatedReview.store_id;
  }
  if (updatedReview.review) {
    updatedReviewData.review = updatedReview.review;
  }
  if (updatedReview.rating) {
    updatedReviewData.rating = updatedReview.rating;
  }
  let updateCommand = {
    $set: updatedReviewData,
  };
  const query = {
    _id: new ObjectId(id),
  };
  await reviewsCollection.updateOne(query, updateCommand);
  return await getReviewById(id.toString());
};
export  {
  getAllReviews,
  getReviewById,
  addReview,
  removeReview,
  updateReview,
};
