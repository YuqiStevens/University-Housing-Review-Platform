import express from 'express';
import validation from '../validation.js';
import helper from '../helpers.js';
import xss from 'xss';
import { getUser } from '../data/users.js';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { getAllStores } from '../data/stores.js';
import { getStoreSearchResults, getProductSearchResults, getRecommendedStores, getRecommendedProducts } from '../data/homepage.js';
const router = express.Router();
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
    '1051634156593-948mtgs5bf1fuh5qumvb99pve7pgbh6p.apps.googleusercontent.com',
    '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',
    'https://developers.google.com/oauthplayground'
);

oauth2Client.setCredentials({
    refresh_token: '1//04el2iReAzjnsCgYIARAAGAQSNwF-L9IrUjucNNl8_mC-taoA7-nm9gkYuiGIRM5sR0rgxoJfrho3C4RKplBcT3MWCnxHHPhY7f0'
});

const accessToken = await oauth2Client.getAccessToken();

router.get('/', (req, res) => {
    const title = "Share to Your Friends";
    res.status(200).render('share', {
        title: title,
    }); 
});

router.post('/', async (req, res) => {
    const title = "Share to Your Friends";
    let friendEmail = xss(req.body.friendEmail);
    let userNickname = xss(req.body.userNickname);
    let errors = [];

    try {
        friendEmail = validation.checkEmail(friendEmail);
    } catch (e) {
        errors.push(e);
    }

    try {
        userNickname = validation.checkName(userNickname);
    } catch (e) {
        errors.push(e);
    }

    if (errors.length > 0) {
        return res.status(400).render('share', {
            title: title,
            hasErrors: true,
            errors: errors, 
            email: friendEmail, 
            name: userNickname 
        });
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: 'asianlifeweb@gmail.com',
            accessToken: accessToken.token,
        }
    });

    const mailOptions = {
        from: `"${userNickname} via AsianLife Grocery Store" <asianlifeweb@gmail.com>`,
        to: friendEmail,
        subject: 'Check out AsianLife Grocery Website',
        text: `${userNickname} thinks you would love our website! Check us out at: https://github.com/CS546-A-Final-Project`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.render('promotion', {
            title: 'Promotion email sent successfully',
            email: friendEmail,
        });
    } catch (error) {
        console.error('Failed to send email', error);
        res.status(500).send('Error sending promotion email');
    }
});

export default router;