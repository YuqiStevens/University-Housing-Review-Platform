import { commentsforstores } from "../config/mongoCollections.js";
import validation from "../validation.js";
import { ObjectId } from "mongodb"; 
import xss from "xss";
import { storesData } from "./index.js";

const getAllComments = async (storeId) => {
  let storeid = xss(storeId).trim();
  try{
    validation.checkId(storeid)
  }catch(e){
    throw e;
  }
  const commentsCollection = await commentsforstores();
  const comments = await commentsCollection.find({store_id: storeid}).project({_id:1, comment:1, Answer: 1}).toArray();
  return comments;
};

const getCommentById = async (Id) => {

  let id = xss(Id).trim();
  try{
    validation.checkId(id)
  }catch(e){
    throw e;
  }
  const commentsCollection = await commentsforstores();
  const storecomment = await commentsCollection.findOne({ _id: new ObjectId(id) })
  if (!storecomment) throw "comment cannot found";
  return storecomment;
};


const addComment = async (storeComment) => {
  let user_id = xss(storeComment.user_id).trim();
  let store_id = xss(storeComment.store_id).trim();

  let comment = xss(storeComment.comment).trim();
  const store= await storesData.getStoreById(store_id)

  try{
    if(comment.length < 25) throw 'comment must more than 25 characters!';
    if(comment.length > 200) throw 'comment cannot surpass 200 valid characters! '
    validation.checkId(user_id);
    validation.checkId(store_id);
    validation.checkString(comment, "comment");
  }catch(e){
    throw e;
  }

   let newstorecomment = {
      user_id: user_id,
      store_id: store_id,
      comment: comment,
      Answer:[],
  }
  const commentsCollection = await commentsforstores();
  const newInsertInformation = await commentsCollection.insertOne(newstorecomment);
  if(!newInsertInformation.acknowledged || !newInsertInformation.insertedId) throw "Could not add this comment"
  const newId = newInsertInformation.insertedId;

  return await getCommentById(newId.toString());
};
 

const addAnswer = async(Id,  Answer) => {
  let id = xss(Id).trim();
  let answer = xss(Answer).trim();
  try{
    validation.checkId(id);
  }catch(e){
    throw e;
  }
  try{
    validation.checkString(answer)
  }catch(e){
    throw e;
  }

  const comment = await getCommentById(id);
  if(comment.Answer.length !== 0 ) throw "Already answered this comment"
  
  comment.Answer.push(answer);
  const commentsCollection = await commentsforstores()
  const updateComment = {
      user_id: comment.user_id,
      store_id: comment.store_id,
      comment: comment.comment,
      Answer: comment.Answer,
  }
  const updateInfo = await commentsCollection.updateOne({_id: new ObjectId(id)}, {$set: updateComment})
  if(!updateInfo.acknowledged) throw 'Could not add this answer!';

  return await getCommentById(id);
};


const getAnswerById = async(Id) => {
  let id = xss(Id).trim();
  try{
    validation.checkId(id)
  }catch(e){
    throw e;
  }
  const commentsCollection = await commentsforstores();
  const commentAnswer = await commentsCollection.find({ _id: new ObjectId(id) }).project({Answer:1}).toArray();
  if (!commentAnswer) throw "no answer from owner for now";
  return commentAnswer;
}

const deleteAnswer = async(Id) =>{
  let id = xss(Id).trim();
  try{
    validation.checkId(id)
  }catch(e){
    throw e;
  }
  const commentsCollection = await commentsforstores();
  const comment = await getCommentById(id);

  const updateComment = {
      user_id: comment.user_id,
      store_id: comment.store_id,
      comment: comment.comment,
      Answer: [],
  }

  const updateInfo = await commentsCollection.updateOne({_id: new ObjectId(id)}, {$set: updateComment})
  if(!updateInfo.acknowledged) throw 'Could not delete this answer!';
  return await getCommentById(id);
}
//   
const removeComment= async (Id) => {
  let id = xss(Id).trim();
  try{
    validation.checkId(id)
  }catch(e){
    throw e;
  }

  const commentsCollection = await commentsforstores();
  const deletionInfo = await commentsCollection.deleteOne({
    _id: new ObjectId(id),
  });
  if (!deletionInfo.acknowledged) {
    throw `Could not delete comment with id of ${id}`;
  }
  console.log(deletionInfo);
  return deletionInfo;
};

export  {
  getAllComments,
  getCommentById,
  addComment,
  removeComment,
  addAnswer,
  getAnswerById,
  deleteAnswer
};
