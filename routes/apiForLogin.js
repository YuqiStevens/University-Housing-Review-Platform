import express from 'express';
import validator from 'validator';
import validation from '../helpers.js';
import { loginUser } from '../data/users.js';
import xss from 'xss';

const router = express.Router();
router.route('/')
    .post(async (req, res) => {
        let errors = [];
        let cleanEmail = xss(req.body.email).trim();
        let cleanPassword = xss(req.body.password).trim();

        // Check if email or password fields are empty
        if (!cleanEmail) {
            errors.push("Please enter your email address.");
        }
        if (!cleanPassword) {
            errors.push("Please enter your password.");
        }

        // Validate the format of the email
        if (!validator.isEmail(cleanEmail)) {
            errors.push("Email address should be in a valid format, e.g., example@example.com.");
        }

        // Validate the password requirements
        try {
            validation.checkPassword(cleanPassword, 'Password');
        } catch (e) {
            errors.push(e.message);
        }

        // Return errors if any validations fail
        if (errors.length > 0) {
            return res.status(400).json({ login: false, error: errors });
        }

        try {
            const user = await loginUser(cleanEmail, cleanPassword);
            if (user) {
                console.log("User login successful, setting session", user);
                req.session.user = user; // Correctly setting up the session
                req.session.save(err => {
                    if (err) {
                        console.error("Error saving session", err);
                        return res.status(500).json({ login: false, error: ["Failed to save session."] });
                    }
                    console.log("Session saved successfully");
                    return res.json({ login: true });
                });
            } else {
                console.log("No user found with these credentials");
                return res.status(401).json({ login: false, error: ["Invalid credentials."] });
            }
        } catch (e) {
            console.error("Login error: ", e);
            return res.status(500).json({ login: false, error: ["Server error during login."] });
        }
    });

export default router;
