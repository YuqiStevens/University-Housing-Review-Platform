import express from 'express';

const router = express.Router();
import {getUserById, updateUser} from '../data/users.js'
import {getAllReviewsByUserId} from '../data/reviewsForHousing.js';
import helper from '../helpers.js';
import xss from 'xss';
import {getHousingById} from "../data/housing.js";

router.route('/')
    .get(async (req, res) => {
        const title = "Profile";
        const id = req.session.user.id;
        let user = {};
        let allReviews = [];
        let hasReviews = false;
        let hasNoReviews = true;
        let errorMsg = null;

        try {
            user = await getUserById(id);
            allReviews = await getAllReviewsByUserId(id);
            hasReviews = allReviews.length > 0;
            hasNoReviews = !hasReviews;
        } catch (error) {
            console.error('Error fetching user or reviews:', error);
            errorMsg = "An error occurred while fetching the user or reviews.";
            if (!user.reviews) {
                user.reviews = [];
            }
        }

        return res.status(errorMsg ? 500 : 200).render('profile', {
            title: title,
            user: user,
            reviews: allReviews,
            hasReviews: hasReviews,
            hasNoReviews: hasNoReviews,
            error: errorMsg
        });
    });

router.route('/')
    .post(async (req, res) => {
        const title = "Profile";
        const id = req.session.user.id;
        let errors = [];

        try {
            let user = await getUserById(id);
            let {firstName, lastName, email, city, state, country, age, diploma, discipline} = req.body;
            // Sanitization
            firstName = xss(firstName);
            lastName = xss(lastName);
            email = xss(email).toLowerCase();
            city = xss(city);
            state = xss(state);
            country = xss(country);
            age = xss(age);
            diploma = xss(diploma);
            discipline = xss(discipline);

            // Validation
            firstName = helper.checkName(firstName, 'First Name');
            lastName = helper.checkName(lastName, 'Last Name');
            email = helper.checkEmail(email, 'E-mail');
            city = helper.checkString(city, 'City');
            state = helper.checkString(state, 'State');
            country = helper.checkString(country, 'Country');
            diploma = helper.checkString(diploma, 'Highest Diploma');
            discipline = helper.checkString(discipline, 'Discipline');

            // Check if email already exists in other accounts
            if (await helper.checkIfEmailExistsExceptMe(user.email, email, id)) {
                errors.push('The email address already exists');
            }

            if (errors.length > 0) {
                return res.status(400).render('profile', {
                    title,
                    user,
                    errors,
                    hasErrors: true
                });
            }

            // Update the user
            const updatedUser = await updateUser(id, {
                firstName,
                lastName,
                email,
                city,
                state,
                country,
                age,
                diploma,
                discipline
            });

            // If the update is successful, update session information
            if (updatedUser) {
                req.session.user.firstName = firstName;
                req.session.user.lastName = lastName;

                // Handle email change for session
                if (req.session.user.email !== email) {
                    req.session.destroy();
                    res.redirect('/login');
                } else {
                    // If only names or other non-email fields have changed
                    req.session.save(() => {
                        res.redirect('/profile');
                    });
                }
            } else {
                throw new Error('User update failed');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).render('profile', {
                title,
                user: await getUserById(id),
                errors: ['Failed to update your profile.'],
                hasErrors: true
            });
        }
    });

export default router;
