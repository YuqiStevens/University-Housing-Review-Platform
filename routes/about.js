import express from 'express';

const router = express.Router();

router.route('/').get(async (req, res) => {
    res.status(200).render('about', {title: "About"})
});

export default router;