import express from 'express';
import { addComment, getCommentById } from '../data/comments.js';  
const router = express.Router();



router.post('/add/:reviewId', async (req, res) => {
    const reviewId = req.params.reviewId;  
    const { comment } = req.body; 


    if (!comment) {
        return res.status(400).send("Comment field is required.");
    }

    try {
        const newComment = {
            reviewId: reviewId,
            text: comment,
            userId: req.session.user.id, 
            createdAt: new Date()  
        };

        await addComment(newComment);
        res.redirect(`/review/${reviewId}`);  
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).send('Failed to add comment due to server error.');
    }
});




// 这里需要找到对应的评论模板来显示评论详情，不知道具体在哪里
router.get('/:commentId', async (req, res) => {
    const commentId = req.params.commentId;  

    try {
        const comment = await getCommentById(commentId);
        if (!comment) {
            return res.status(404).send("Comment not found.");
        }

        // 这里假设你有一个对应的模板来显示评论详情
        // 如果你需要显示评论回复或相关信息，确保模板和数据适配这一需求
        res.render('commentDetail', {
            title: `Comment by ${comment.userId}`, 
            comment: comment
        });
    } catch (error) {
        console.error('Error fetching comment:', error);
        res.status(500).send('Server error occurred while fetching the comment.');
    }
});




export default router;