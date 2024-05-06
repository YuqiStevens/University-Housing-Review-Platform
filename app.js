import express from 'express';
import session from 'express-session';
import configRoutes from './routes/index.js';
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import exphbs from 'express-handlebars';
import morgan from 'morgan';
import winston from 'winston';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({filename: 'logs/error.log', level: 'error'}),
        new winston.transports.File({filename: 'logs/combined.log'})
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

app.use(morgan('tiny', {stream: {write: message => logger.info(message.trim())}}));

const staticDir = express.static(__dirname + '/public');
const rewriteUnsupportedBrowserMethods = (req, res, next) => {
    if (req.body && req.body._method) {
        req.method = req.body._method;
        delete req.body._method;
    }
    next();
};

app.use('/public', staticDir);
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(rewriteUnsupportedBrowserMethods);

app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main',
    helpers: {
        json: function(context) {
            return JSON.stringify(context);
        }
    }
}));
app.set('view engine', 'handlebars');

app.use(session({
    name: 'UniversityHousingReviewPlatform',
    secret: 'YourSecretHere',  // This should be a strong secret, ideally from an environment variable
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 600000,  // 10 minutes
        httpOnly: true,
        secure: false,  // Set to true if you are on HTTPS
        sameSite: 'lax'  // This can be set to 'strict' for stricter CSRF protection
    }
}));

app.use('/', (req, res, next) => {
    const currentTime = new Date().toUTCString();
    const requestMethod = req.method;
    const requestRoute = req.originalUrl;
    if (!req.session.user) {
        console.log(`[${currentTime}]: ${requestMethod} ${requestRoute} (Non-Authenticated User)`);
    } else if (req.session.user.role === 'admin') {
        console.log(`[${currentTime}]: ${requestMethod} ${requestRoute} (Authenticated Admin User)`);
    } else if (req.session.user.role === 'user') {
        console.log(`[${currentTime}]: ${requestMethod} ${requestRoute} (Authenticated Normal User)`);
    }

    if (requestRoute === '/') {
        if (!req.session.user) {
            return res.status(200).redirect('/login');
        } else if (req.session.user.role === 'user') {
            return res.status(200).redirect('/home');
        }
    }
    next();
});

app.use('/login', (req, res, next) => {
    if (!req.session.user) {
        next();
    } else if (req.session.user.role === 'user') {
        return res.status(200).redirect('/home');
    }
});

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

app.use('/housing/add', (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        next();
    } else {
        return res.status(403).send('Unauthorized access. Admins only.');
    }
});

app.use('/housing/edit', (req, res, next) => {
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
            logger.error('Session destruction error', err);
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
    logger.info("Server is running on http://localhost:3000");
});

