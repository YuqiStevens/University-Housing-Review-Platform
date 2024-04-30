import express from 'express';
import xss from 'xss'
import { ObjectId } from "mongodb";
import { commentsforstoresData, storesData } from "../data/index.js";
const router = express.Router();


router.route('/:comment_id').get(async (req, res) => {

    let userid = xss(req.session.user.id).trim();
    let ownedStoreid = req.session.user.ownedStoreId
    let commentId = xss(req.params.comment_id).trim();
    let comment = await commentsforstoresData.getCommentById(commentId);
    let storeid = xss(comment.store_id).trim();
    let store = await storesData.getStoreById(storeid);
    let storeName = store.name
   
    let isAdmin = true;
    if(ownedStoreid !== storeid) {
      isAdmin = false;
    }

    try{
        let commentData = await commentsforstoresData.getCommentById(commentId);
        let comment = commentData.comment;
        let commentuserid = commentData.user_id
        let isCommenter = true;
        if(commentuserid !== userid){
          isCommenter = false;
        }
        let answer = commentData.Answer[0];
        res.render("commentsDetail", {title: storeName, comment: comment, answer: answer, isAdmin: isAdmin, commentId: commentId, isCommenter:isCommenter})
    }catch(e){
        return res.status(400).render('error', {title: "Error", error: e})
    }
  })
    .post(async (req, res) => {//add answer
    

        let answerInput = xss(req.body.answerInput).trim();
        // console.log(answerInput);
        let commentId = xss(req.params.comment_id).trim();
        // console.log(commentId)

        try{
          checkId(commentId)
        }catch(e){
          return res.status(400).render('error', {title: "Error", error: e})
        }
    
        try{
            checkString(answerInput,"Newanswer");
            if(answerInput.length > 200) throw 'answer cannot surpass 200 valid characters! '
        }catch(e){
            return res.status(400).render('error', {title: "Error", error: e})
        }

        try{
            const newAnswer = await commentsforstoresData.addAnswer(commentId, answerInput)
            res.redirect(`/commentsDetail/${commentId}`)
        }catch(e){
            return res.status(500).render('error', {title: "Error", error:"Internal Server Error"})
        }
      })
    //   .put(async (req, res) => {
          
    //       let user = req.session.user;
    //       let userId = user._id;

          
  
    //       try{
    //           const newAnswer = await commentsforstoresData.deleteAnswer(id)
    //           res.redirect(`/${id}`)
    //       }catch(e){
    //           return res.status(500).render('error', {title: "Error", message:"cannot delete this answer"})
    //       }
    // });
 
export default router;

function checkString(string, varName) {
    if (!string) throw `You must provide a ${varName}`;
    if (typeof string !== "string") throw `Error:${varName} must be a string`;
    string = string.trim();
    if (string.length === 0)
      throw `${varName} cannot be an empty string or just spaces`;
    return string;
}

function checkId(id) {
    if (!id) {
      throw "No id provided";
    }

    if (typeof id !== "string" || id.trim() === "") {
      throw "Invalid id provided";
    }
    id = id.trim();
    if (!ObjectId.isValid(id)) {
      throw "Not a valid ObjectId";
    }
    return id;
}
