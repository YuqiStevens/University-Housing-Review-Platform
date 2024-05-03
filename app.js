// Import necessary modules and set up Express app
import express from 'express';

const app = express();
import session from 'express-session';
import configRoutes from './routes/index.js';
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import exphbs from 'express-handlebars';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const staticDir = express.static(__dirname + '/public');

app.use('/public', staticDir);
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Set up Handlebars as the view engine
app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Set up session configuration
app.use(
    session({
        name: 'UniversityHousingReviewPlatform',
        secret: "YourSecretHere", // Update with a real secret in production
        saveUninitialized: true,
        resave: false,
        cookie: {maxAge: 600000} // Session expires after 10 minutes of inactivity
    })
);

// Middleware for logging requests
app.use((req, res, next) => {
    const currentTime = new Date().toUTCString();
    console.log(`[${currentTime}]: ${req.method} ${req.originalUrl}`);
    next();
});

// Authentication and redirection middleware
app.use((req, res, next) => {
    if (['/', '/login', '/register'].includes(req.originalUrl.toLowerCase()) && req.session.user) {
        return res.redirect('/home');
    } else if (!req.session.user && !['/', '/login', '/register'].includes(req.originalUrl.toLowerCase())) {
        return res.redirect('/login');
    }
    next();
});

// Route-specific middleware
app.use('/home', (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        return res.redirect('/login');
    }
});

app.use('/profile', (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        return res.redirect('/login');
    }
});

app.use('/housings/add', (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        next();
    } else {
        return res.status(403).send('Unauthorized access. Admins only.');
    }
});

app.use('/housings/edit', (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        next();
    } else {
        return res.status(403).send('Unauthorized access. Admins only.');
    }
});

app.use('/reviews', (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        return res.redirect('/login');
    }
});

app.use('/logout', (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            next(err);
        } else {
            res.redirect('/');
        }
    });
});

// Configure routes
configRoutes(app);

// Start the server
app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});
