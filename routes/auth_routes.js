import { Router } from 'express';
import { registerUser, loginUser } from '../data/users.js'; // Adjust the path as needed

const router = Router();

router.route('/')
    .get((req, res) => {
        res.render('index', {
            title: 'Home'
        });
    });

router.route('/login')
    .get((req, res) => {
        res.render('login', {
            title: 'Login'
        });
    })
    .post(async (req, res) => {
        try {
            const { username, password } = req.body;
            const user = await loginUser(username, password);
            req.session.user = user; // Set user info in session
            res.redirect(user.role === 'admin' ? '/admin' : '/user');
        } catch (error) {
            res.status(401).render('login', {
                error: error.message
            });
        }
    });

router.route('/register')
    .get((req, res) => {
        res.render('register', {
            title: 'Register'
        });
    })
    .post(async (req, res) => {
        try {
            const { firstName, lastName, username, password, confirmPassword, favoriteQuote, themePreference, role } = req.body;
            const result = await registerUser(firstName, lastName, username, password, favoriteQuote, themePreference, role);
            if (result.signupCompleted) {
                res.redirect('/login');
            } else {
                res.status(500).render('register', { error: 'Internal Server Error' });
            }
        } catch (error) {
            res.status(400).render('register', {
                error: error.message
            });
        }
    });

router.route('/user')
    .get((req, res) => {
        res.render('user', {
            title: 'User Profile',
            user: req.session.user,
            theme: req.session.user.themePreference,
            currentTime: new Date().toLocaleTimeString()
        });
    });

router.route('/admin')
    .get((req, res) => {
        res.render('admin', {
            title: 'Admin Dashboard',
            user: req.session.user,
            theme: req.session.user.themePreference,
            currentTime: new Date().toLocaleTimeString()
        });
    });

router.route('/logout')
    .get((req, res) => {
        req.session.destroy(() => {
            res.redirect('/login');
        });
    });

export default router;
