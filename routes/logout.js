import express from 'express';
const router = express.Router();

router.route('/').get(async (req, res) => {
    //code here for GET
    req.session.destroy();
    res.status(200).render('logout', { title: "Logout" })
});

export default router;