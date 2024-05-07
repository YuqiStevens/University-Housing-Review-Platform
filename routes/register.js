import express from 'express';
import validation from '../helpers.js';
import helper from '../helpers.js';
import {addUser} from '../data/users.js';
import xss from 'xss';

const router = express.Router();

router.route('/')
    .get(async (req, res) => {
    const title = "Register";
    res.render('register', {title: title});
});

router.route('/')
    .post(async (req, res) => {
    const title = "Register";
    let cleanFirstName = xss(req.body.firstName);
    let cleanLastName = xss(req.body.lastName);
    let cleanEmail = xss(req.body.email).toLowerCase();
    let cleanPassword = xss(req.body.password);
    let cleanConfirmPassword = xss(req.body.confirmPassword);
    let cleanRole = xss(req.body.role).toLowerCase();
    let cleanCity = xss(req.body.city);
    let cleanState = xss(req.body.state);
    let cleanCountry = xss(req.body.country);
    let cleanAge = parseInt(xss(req.body.age), 10);
    let cleanDiploma = xss(req.body.diploma);
    let cleanDiscipline = xss(req.body.discipline);
    let errors = [];

    try {
        cleanFirstName = validation.checkName(cleanFirstName, 'First Name');
    } catch (e) {
        errors.push(e);
    }
    try {
        cleanLastName = validation.checkName(cleanLastName, 'Last Name');
    } catch (e) {
        errors.push(e);
    }
    try {
        cleanEmail = validation.checkEmail(cleanEmail, 'E-mail');
        if (await helper.checkIfEmailExists(cleanEmail)) {
            errors.push('The email address exists');
        }
    } catch (e) {
        errors.push(e);
    }
    try {
        cleanPassword = validation.checkPassword(cleanPassword, 'Password');
    } catch (e) {
        errors.push(e);
    }
    if (cleanConfirmPassword !== cleanPassword) {
        errors.push('Password did not match');
    }
    if (cleanRole !== 'admin' && cleanRole !== 'user') {
        errors.push('The role should be admin or user');
    }
    if (isNaN(cleanAge) || cleanAge <= 0) {
        errors.push('Please enter a valid age');
    }

    if (errors.length > 0) {
        return res.status(400).render('register', {
            title: "Sign Up",
            firstName: cleanFirstName,
            lastName: cleanLastName,
            email: cleanEmail,
            password: '',
            confirmPassword: '',
            city: cleanCity,
            state: cleanState,
            country: cleanCountry,
            age: cleanAge,
            diploma: cleanDiploma,
            discipline: cleanDiscipline,
            roleAdmin: cleanRole === "admin",
            roleUser: cleanRole === "user",
            errors: errors,
            hasErrors: true
        });
    }

    try {
        const newUser = await addUser(
            cleanFirstName,
            cleanLastName,
            cleanEmail,
            cleanPassword,
            cleanRole,
            cleanCity,
            cleanState,
            cleanCountry,
            cleanAge,
            cleanDiploma,
            cleanDiscipline
        );
        if (!newUser) {
            throw new Error("User registration failed.");
        }
        res.status(200).redirect('/login');
    } catch (e) {
        errors.push(e.message);
        return res.status(400).render('register', {
            title: "Sign Up",
            firstName: cleanFirstName,
            lastName: cleanLastName,
            email: cleanEmail,
            password: '',
            confirmPassword: '',
            city: cleanCity,
            state: cleanState,
            country: cleanCountry,
            age: cleanAge,
            diploma: cleanDiploma,
            discipline: cleanDiscipline,
            roleAdmin: cleanRole === "admin",
            roleUser: cleanRole === "user",
            errors: errors,
            hasErrors: true
        });
    }
});

export default router;
