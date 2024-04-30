import express from 'express';
const router = express.Router();

router.route('/').get(async (req, res) => {
    let code = 400;
    if (req.session.errorCode) code = req.session.errorCode;
    res.status(code).render('error', { title: "error", error: req.session.error });
});

export default router;