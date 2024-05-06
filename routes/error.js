import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
    const code = req.session.errorCode || 400;
    const errorMessage = req.session.error || "An unknown error occurred.";

    delete req.session.errorCode;
    delete req.session.error;

    req.session.save(err => {
        if (err) {
            console.error("Error saving session after clearing error information:", err);
            return res.status(500).render('error', {
                title: "Error",
                error: "Failed to update session after error handling."
            });
        }

        res.status(code).render('error', {
            title: "Error",
            error: errorMessage
        });
    });
});

export default router;
