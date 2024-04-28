import express from 'express';
import session from 'express-session';
import configRoutes from './routes/index.js';
import exphbs from 'express-handlebars';
import {
    logRequest,
    redirectIfAuthenticated,
    ensureAuthenticated,
    ensureAdmin,
    logoutMiddleware
} from './middleware.js';

const app = express();
const staticDir = express.static('public');

app.use('/public', staticDir);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    name: 'AuthenticationState',
    secret: 'some secret string!',
    resave: false,
    saveUninitialized: true
}));

app.use(logRequest);
app.use('/login', redirectIfAuthenticated);
app.use('/user', ensureAuthenticated);
app.use('/admin', ensureAdmin);
app.use('/logout', logoutMiddleware);

app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

configRoutes(app);

app.listen(3000, () => {
    console.log("CS-546 Final Project");
    console.log('Running on http://localhost:3000');
});
