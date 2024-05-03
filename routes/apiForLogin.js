import express from 'express';
import validator from 'validator';
import validation from '../helpers.js';
import {loginUser} from '../data/users.js';
import xss from 'xss';

const router = express.Router();
router.route('/')
    .post(async (req, res) => {
        let errors = [];
        let cleanEmail = xss(req.body.email).trim();
        let cleanPassword = xss(req.body.password).trim();
        if (!cleanEmail) errors.push("Please enter your email address");
        if (!cleanPassword) errors.push("Please enter your password");
        if (errors.length > 0) {
            let errorMessage = {login: false, error: []};
            for (let error of errors) {
                errorMessage.error.push(error);
            }
            return res.json(errorMessage);
        }

        try {
            if (!validator.isEmail(cleanEmail)) errors.push("Email address should be a valid email address format. example@example.com");
        } catch (e) {
            errors.push(e);
        }
        try {
            validation.checkPassword(cleanPassword, 'Password')
        } catch (e) {
            errors.push(e);
        }

        if (errors.length > 0) {
            let errorMessage = {login: false, error: []};
            for (let error of errors) {
                errorMessage.error.push(error);
            }
            return res.json(errorMessage);
        }

        let user;
        try {
            user = await loginUser(cleanEmail, cleanPassword);
        } catch (e) {
            errors.push(e)
            let errorMessage = {login: false, error: []};
            for (let error of errors) {
                errorMessage.error.push(error);
            }
            return res.json(errorMessage);
        }
        req.session.user = user;
        return res.json({login: true});
    });
export default router;