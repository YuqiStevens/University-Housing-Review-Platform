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
        let selectedNull = "", selectedMale = "", selectedFemale = "";

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
                avatarId: user ? user.avatar : "",
                userName: user ? user.userName : "",
                firstName: user ? user.firstName : "",
                lastName: user ? user.lastName : "",
                email: user ? user.email : "",
                selectedNull: selectedNull,
                selectedMale: selectedMale,
                selectedFemale: selectedFemale,
                hasReviews: hasReviews,
                hasNoReviews: hasNoReviews,
                allReviews: [],
                error: "An error occurred while fetching the user or reviews."
            });
        }

        if (user.gender === null) {
            selectedNull = "selected";
        } else if (user.gender === "male") {
            selectedMale = "selected";
        } else if (user.gender === "female") {
            selectedFemale = "selected";
        }

        return res.status(200).render('profile', {
            title: title,
            avatarId: user.avatar,
            userName: user.userName,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            selectedNull: selectedNull,
            selectedMale: selectedMale,
            selectedFemale: selectedFemale,
            hasReviews: hasReviews,
            hasNoReviews: hasNoReviews,
            allReviews: allReviews,
        });
    })


    .post(async (req, res) => {
        const title = "Profile";
        const id = req.session.user.id;
        let user = await getUserById(id);
        let hasReviews = false;
        let hasNoReviews = true;

        let allReviews = await getAllReviewsByUserId(id);

        if (allReviews.length > 0) {
            hasReviews = true;
            hasNoReviews = false;
        }

        let cleanUserName = xss(req.body.userName);
        let cleanFirstName = xss(req.body.firstName);
        let cleanLastName = xss(req.body.lastName);
        let cleanEmail = xss(req.body.email).toLowerCase();
        let cleanGender = xss(req.body.gender).toLowerCase();
        let errors = [];

        try {
            cleanUserName = helper.checkUserName(cleanUserName, 'User Name');
        } catch (e) {
            errors.push(e);
        }


        try {
            cleanFirstName = helper.checkName(cleanFirstName, 'First Name');
        } catch (e) {
            errors.push(e);
        }


        try {
            cleanLastName = helper.checkName(cleanLastName, 'Last Name');
        } catch (e) {
            errors.push(e);
        }


        try {
            cleanEmail = helper.checkEmail(cleanEmail, 'E-mail');
            const emailNow = req.session.user.email;
            if (await helper.checkIfEmailExistsExceptMe(emailNow, cleanEmail)) {
                errors.push('The email address exists');
            }
        } catch (e) {
            errors.push(e);
        }


        cleanGender = cleanGender.trim();
        if (cleanGender !== "" && cleanGender !== 'male' && cleanGender !== 'female') {
            errors.push('The role should be prefer not to say, male or female');
        }


        if (errors.length > 0) {
            let selectedNull = "", selectedMale = "", selectedFemale = "";


            if (cleanGender === "") {
                selectedNull = "selected";
            } else if (cleanGender === "male") {
                selectedMale = "selected";
            } else if (cleanGender === "female") {
                selectedFemale = "selected";
            }


            return res.status(400).render('profile', {
                title: title,
                avatarId: user.avatar,
                userName: cleanUserName,
                firstName: cleanFirstName,
                lastName: cleanLastName,
                email: cleanEmail,
                selectedNull: selectedNull,
                selectedMale: selectedMale,
                selectedFemale: selectedFemale,
                hasReviews: hasReviews,
                hasNoReviews: hasNoReviews,
                hasErrors: true,
                allReviews: allReviews,
                errors: errors,
            });
        }


        let updatedUser = {
            userName: cleanUserName,
            firstName: cleanFirstName,
            lastName: cleanLastName,
            email: cleanEmail,
            gender: cleanGender
        };


        try {
            updatedUser = await updateUser(
                id,
                updatedUser,
            );
        } catch (e) {
            errors.push(e);

            let selectedNull = "", selectedMale = "", selectedFemale = "";

            if (cleanGender === "") {
                selectedNull = "selected";
            } else if (cleanGender === "male") {
                selectedMale = "selected";
            } else if (cleanGender === "female") {
                selectedFemale = "selected";
            }


            return res.status(400).render('profile', {
                title: title,
                avatarId: user.avatar,
                userName: cleanUserName,
                firstName: cleanFirstName,
                lastName: cleanLastName,
                email: cleanEmail,
                selectedNull: selectedNull,
                selectedMale: selectedMale,
                selectedFemale: selectedFemale,
                hasReviews: hasReviews,
                hasNoReviews: hasNoReviews,
                allReviews: allReviews,
                hasErrors: true,
                errors: errors,
            });
        }


        if (!updatedUser) {
            return res.status(500).render('error', {title: "Internal Server Error", error: "Internal Server Error"});
        }


        if (req.session.user.email !== cleanEmail) {
            req.session.destroy();
            return res.status(200).redirect('/login');
        }

        res.status(200).redirect('/profile');
    })


export default router;
