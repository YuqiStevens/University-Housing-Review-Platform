import express from 'express';

const router = express.Router();
import {getUserById, updateUser} from '../data/users.js'
import {getAllReviewsByUserId} from '../data/reviewsForHousing.js';
import helper from '../helpers.js';
import xss from 'xss';


router.route('/')
    .get(async (req, res) => {
        const title = "Profile";
        const id = req.session.user.id;
        let user;
        let allReviews = [];
        let hasReviews = false;
        let hasNoReviews = true;

        try {
            user = await getUserById(id);
            allReviews = await getAllReviewsByUserId(id);
            hasReviews = allReviews.length > 0;
            hasNoReviews = !hasReviews;
        } catch (error) {
            console.error('Error fetching user or reviews:', error);
            // Render the profile page with error message
            return res.status(500).render('profile', {
                title: title,
                user: user,
                hasReviews: hasReviews,
                hasNoReviews: hasNoReviews,
                allReviews: [],
                error: "An error occurred while fetching the user or reviews."
            });
        }

        return res.status(200).render('profile', {
            title: title,
            user: user,
            hasReviews: hasReviews,
            hasNoReviews: hasNoReviews,
            allReviews: allReviews,
        });
    })

router.route('/')
    .post(async (req, res) => {
        const title = "Profile";
        const id = req.session.user.id;
        let errors = [];

        try {
            let user = await getUserById(id);
            let { firstName, lastName, email, city, state, country, age, diploma, discipline } = req.body;
            // Sanitization
            //userName = xss(userName);
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
            //userName = helper.checkUserName(userName, 'User Name');
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
            user = await updateUser(id, { firstName, lastName, email, city, state, country, age, diploma, discipline });

            // Handle email change for session
            if (req.session.user.email !== email) {
                req.session.destroy();
                res.redirect('/login');
            } else {
                res.redirect('/profile');
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
