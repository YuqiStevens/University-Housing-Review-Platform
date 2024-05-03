import express from 'express';
import { addReview, updateReview, getReviewByReviewId, removeReview } from '../data/reviews.js';  // 假设这个函数用来添加评论到数据库
const router = express.Router();
import helpers from '../helpers.js';
import xss from 'xss';



router.get('/edit/:reviewId', async (req, res) => {
    const reviewId = req.params.reviewId;

    try {
        const review = await getReviewByReviewId(reviewId);
        if (!review) {
            return res.status(404).send("Review not found.");
        }

        // 传递 review 数据到模板，以便预填充表单
        res.render('editReview', {
            review: review,
            housing: { id: review.housingId } // 假设评论中包含housingId，需要适应你的数据结构
        });
    } catch (error) {
        console.error('Error fetching review:', error);
        res.status(500).send('Server error occurred while fetching the review.');
    }
});




router.post('/add/:housingId', async (req, res) => {
    const housingId = req.params.housingId;  // 获取房源ID
    const { title, rating, body, images } = req.body;  // 从请求体中提取表单数据

    // 验证接收到的数据
    if (!title || !rating || !body) {
        return res.status(400).send("All required fields must be filled.");
    }

    // 处理图片URLs，如果提供了图片URLs
    const imageUrls = images ? images.split(',') : [];

    // 创建评论对象
    const review = {
        housingId: housingId,
        title: title,
        rating: parseInt(rating),
        body: body,
        images: imageUrls
    };

    try {
        // 添加评论到数据库
        await addReview(review);
        res.redirect(`/housing/${housingId}`);  // 重定向到房源详情页面
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).send('Failed to add review due to server error.');
    }
});




router.post('/edit/:reviewId', async (req, res) => {
    const reviewId = req.params.reviewId;
    const { title, rating, body, images } = req.body;

    // 验证接收到的数据
    if (!title || !rating || !body) {
        return res.status(400).send("All required fields must be filled.");
    }

    // 将图片URLs从字符串转换为数组
    const imageUrls = images ? images.split(',') : [];

    // 创建更新后的评论对象
    const updatedReview = {
        title: title,
        rating: parseInt(rating),
        body: body,
        images: imageUrls
    };

    try {
        // 更新数据库中的评论信息
        await updateReview(reviewId, updatedReview);
        res.redirect(`/review/${reviewId}`);  // 重定向回到评论详情页面
    } catch (error) {
        console.error('Failed to update review:', error);
        res.status(500).send('Failed to update review due to server error.');
    }
});



router.post('/delete/:reviewId', async (req, res) => {
    const reviewId = req.params.reviewId;

    try {
        // 删除数据库中的评论
        const result = await removeReview(reviewId);
        if (result.deletedCount === 0) {
            return res.status(404).send("No review found with that ID.");
        }
        // 假设评论删除成功后，重定向到某个页面，例如用户的评论列表页面
        res.redirect('/reviews/user/' + req.session.user.id);  // 调整重定向到合适的路由
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).send('Server error occurred while deleting the review.');
    }
});





export default router;
