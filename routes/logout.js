import express from 'express';

const router = express.Router();

router.route('/').get(async (req, res) => {
    req.session.destroy();
    res.status(200).render('logout', {title: "Logout"})
});

export default router;