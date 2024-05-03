import express from 'express';
const router = express.Router();

router.route('/')
  .get(async (req, res) => {
    res.render('login', { title: "Login Page" });
  })

export default router;