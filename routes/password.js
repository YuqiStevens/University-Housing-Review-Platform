import express from 'express';

const router = express.Router();
import xss from 'xss';
import helpers from '../helpers.js';
import validation from '../validation.js';
import {updatePassword} from '../data/users.js';


router.route('/')
    .get(async (req, res) => {
        return res.status(200).render('password', {
            title: 'Password Management',
        });
    })
    .post(async (req, res) => {
        let originalPassword = xss(req.body.originalPassword).trim();
        let password = xss(req.body.password).trim();
        let confirmPassword = xss(req.body.confirmPassword).trim();

        const userId = req.session.user.id;
        const userEmail = req.session.user.email;

        let errors = [];
        if (!await helpers.checkIfPasswordCorrect(userEmail, originalPassword)) {
            errors.push("Original password entered is wrong")
        } else if (password === originalPassword) {
            errors.push("New password is the same as the old one");
        }

        try {
            password = validation.checkPassword(password, 'New password');
        } catch (e) {
            errors.push(e);
        }

        if (password !== confirmPassword) {
            errors.push('Password did not match');
        }

        if (errors.length > 0) {
            return res.status(400).render('password', {
                title: 'Password Management',
                originalPassword: originalPassword,
                password: password,
                confirmPassword: confirmPassword,
                hasErrors: true,
                errors: errors,
            });
        }

        try {
            await updatePassword(userId, password);
            req.session.destroy();
            return res.status(200).redirect('/login');
        } catch (e) {
            errors.push(e);
            return res.status(400).render('password', {
                title: 'Password Management',
                originalPassword: originalPassword,
                password: password,
                confirmPassword: confirmPassword,
                hasErrors: true,
                errors: errors,
            });
        }
    });

export default router;