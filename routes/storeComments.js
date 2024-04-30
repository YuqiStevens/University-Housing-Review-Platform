import express from 'express';
import xss from "xss";
import { commentsforstoresData, storesData } from "../data/index.js";
import helpers from '../helpers.js';
const router = express.Router();



router.route('/:store_id').get(async (req, res) => {//get all comment for this store

    let user = req.session.user

    let storeid = xss(req.params.store_id)

    try {
        await helpers.checkId(storeid)
    } catch (e) {
        return res.status(400).render('error', { title: "Error", message: e })
    }

    try {
        let isUser = true;//for determining if have right to comment;
        let isAdmin = true
        const store = await storesData.getStoreById(storeid);
        const storeName = store.name;
        const commentList = await commentsforstoresData.getAllComments(storeid);

        if (user.role !== 'user') {
            isUser = false;
        }
        if (user.id !== store.admin_id) {
            isAdmin = false
        }
        res.render("storeComments", { title: storeName, commentList: commentList, isUser: isUser, isAdmin: isAdmin, storeID: storeid })
        // res.redirect(`storeComments/${storeid}`)
    } catch (e) {
        return res.status(400).render('error', { title: "Error", error: e })
    }
})
    .post(async (req, res) => {
        let user = req.session.user;
        let userid = xss(user.id).trim();
        let storeid = xss(req.params.store_id).trim()
        let comment = xss(req.body.commentInput).trim();
        let errors = [];
        let isUser = true;
        let isAdmin = true
        let store;
        let storeName;
        let commentList;
        try {
            store = await storesData.getStoreById(storeid);
            storeName = store.name;
            commentList = await commentsforstoresData.getAllComments(storeid);
            if (user.role !== 'user') {
                isUser = false;
            }
            if (user.id !== store.admin_id) {
                isAdmin = false
            }
        } catch (e) {
            errors.push(e);
        }
        try {
            await helpers.checkId(userid);
        } catch (e) {
            return res.status(400).render('error', { title: "Error", error: e })
        }

        try {
            await helpers.checkId(storeid)
        } catch (e) {
            return res.status(400).render('error', { title: "Error", error: e })
        }

        try {
            comment = helpers.checkString(comment, "Newcomment");
        } catch (e) {
            errors.push(e);
        }

        if (comment.length < 25) errors.push('comment must more than 25 characters!');
        if (comment.length > 200) errors.push('comment cannot surpass 200 valid characters!');

        if (errors.length > 0) {
            return res.render("storeComments", {
                title: storeName,
                commentList: commentList,
                isUser: isUser,
                isAdmin: isAdmin,
                storeID: storeid,
                hasErrors: true,
                errors: errors,
                comment: comment,
            })
        }
        let newComment
        let updateStore
        try {
            newComment = await commentsforstoresData.addComment({ user_id: userid, store_id: storeid, comment: comment })
            updateStore = await storesData.updateCommentofStore(storeid, comment)
            if (newComment) {
                res.redirect(`/storeComments/${storeid}`)
            }
        } catch (e) {
            return res.status(500).render('error', { title: "Error", error: "Internal Server Error" })
        }
    });
export default router;