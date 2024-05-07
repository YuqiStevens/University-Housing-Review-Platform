import express from 'express';
import validator from 'validator';
import validation from '../helpers.js';
import { loginUser } from '../data/users.js';
import xss from 'xss';

const router = express.Router();

router.post('/', async (req, res) => {
    let errors = [];
    let cleanEmail = xss(req.body.email).trim();
    let cleanPassword = xss(req.body.password).trim();

    if (!cleanEmail) {
        errors.push("Please enter your email address.");
    } else if (!validator.isEmail(cleanEmail)) {
        errors.push("Email address should be in a valid format, e.g., example@example.com.");
    }

    if (!cleanPassword) {
        errors.push("Please enter your password.");
    } else {
        try {
            validation.checkPassword(cleanPassword, 'Password');
        } catch (e) {
            errors.push(e.message);
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({ login: false, errors });
    }

    try {
        const user = await loginUser(cleanEmail, cleanPassword);
        if (!user) {
            console.log("No user found with these credentials");
            return res.status(401).json({ login: false, error: ["Invalid credentials."] });
        }

        console.log("User login successful, setting session", user);
        req.session.user = user;
        req.session.save(err => {
            if (err) {
                console.error("Error saving session", err);
                return res.status(500).json({ login: false, error: ["Failed to save session."] });
            }
            console.log("Session saved successfully");
            return res.json({ login: true });
        });
    } catch (e) {
        console.error("Login error: ", e);
        return res.status(500).json({ login: false, error: ["Server error during login."] });
    }
});

export default router;
