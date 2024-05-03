import express from 'express';
import xss from 'xss';
import { addReview } from '../data/reviewsforstores.js'; 
import helpers from '../helpers.js'; 

const router = express.Router();



router.post('/add', async (req, res) => {
    // 权限检查，确保用户是管理员
    // let role = req.session.user.role;
    // if (role !== 'admin') {
    //     return res.status(403).render('error', { error: "You don't have the authority to add a review." });
    // }

    let userId = xss(req.session.user.id);
    let houseId = xss(req.body.houseId);
    let content = xss(req.body.content);
    let rating = parseInt(xss(req.body.rating), 10);
    let errors = [];


    try {
        userId = helpers.checkId(userId, 'user_id');
        houseId = helpers.checkId(houseId, 'house_id');
        
        if (isNaN(rating) || rating < 1 || rating > 5) {
            throw "Rating must be an integer between 1 and 5.";
        }
    } catch (e) {
        errors.push(e);
    }


    if (errors.length > 0) {
        return res.status(400).render('addReview', {
            title: "Add Review",
            houseId: houseId,
            content: content,
            rating: rating,
            hasErrors: true,
            errors: errors
        });
    }


    try {
        const newReview = await addReview({
            userId,
            houseId,
            content,
            rating
        });

        return res.status(200).redirect(`/reviews/${newReview._id}`);
    } catch (e) {
        errors.push(e);
        return res.status(500).render('addReview', {
            title: "Add Review",
            houseId: houseId,
            content: content,
            rating: rating,
            hasErrors: true,
            errors: errors
        });
    }
});



export default router;

