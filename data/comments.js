import { comments } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

const getAllComments = async () => {
  const commentsCollection = await comments();
  const allComments = await commentsCollection.find({}).toArray();
  return allComments;
};
const getCommentById = async (id) => {
  const commentsCollection = await comments();
  const comment = await commentsCollection.findOne({ _id: new ObjectId(id) });
  if (!comment) throw "Comment not found";
  return comment;
};
const addComment = async (comment) => {
  const commentsCollection = await comments();
  const newInsertInformation = await commentsCollection.insertOne(comment);
  const newId = newInsertInformation.insertedId;
  return await getCommentById(newId.toString());
};
const removeComment = async (id) => {
  const commentsCollection = await comments();
  const deletionInfo = await commentsCollection.findOneAndDelete({
    _id: new ObjectId(id),
  });
  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete comment with id of ${id}`;
  }
  console.log(deletionInfo);
  return deletionInfo;
};
const updateComment = async (id, updatedComment) => {
  const commentsCollection = await comments();
  const updatedCommentData = {};
  if (updatedComment.user_id) {
    updatedCommentData.user_id = updatedComment.user_id;
  }
  if (updatedComment.store_id) {
    updatedCommentData.store_id = updatedComment.store_id;
  }
  if (updatedComment.comment) {
    updatedCommentData.comment = updatedComment.comment;
  }

  if (updatedComment.name) {
    updatedCommentData.name = updatedComment.name;
  }
  if (updatedComment.reply) {
    updatedCommentData.reply = updatedComment.reply;
  }

  let updateCommand = {
    $set: updatedCommentData,
  };
  const query = {
    _id: new ObjectId(id),
  };
  await commentsCollection.updateOne(query, updateCommand);
  return await getCommentById(id.toString());
};

export {
  getAllComments,
  getCommentById,
  addComment,
  removeComment,
  updateComment,
};
