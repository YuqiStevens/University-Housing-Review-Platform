import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Failed to destroy the session during logout.", err);
            return res.status(500).render('error', {
                title: "Error",
                error: "Failed to log out properly due to session error."
            });
        }
    });
});

export default router;
