import loginRoutes from './login.js';
import apiForLoginRoutes from './apiForLogin.js';
import registerRoutes from './register.js';
import homeRoutes from './home.js';
import profileRoutes from './profile.js';
import logoutRoutes from './logout.js';
import errorRoutes from './error.js';
import passwordRoutes from './password.js';
import aboutRoutes from './about.js';

import housingRoutes from './housing.js';
import reviewsRoutes from './reviews.js';
import commentsRoutes from './comments.js';

const constructorMethod = (app) => {
    app.use('/login', loginRoutes);
    app.use('/home', homeRoutes);
    app.use('/apiForLogin', apiForLoginRoutes);
    app.use('/register', registerRoutes);
    app.use('/profile', profileRoutes);
    app.use('/password', passwordRoutes);
    app.use('/logout', logoutRoutes);
    app.use('/error', errorRoutes);
    app.use('/about', aboutRoutes);

    app.use('/housings', housingRoutes);
    app.use('/reviews', reviewsRoutes);
    app.use('/comments', commentsRoutes);

    app.use('*', (req, res) => {
        res.status(404).render('error', {title: "404 NOT FOUND", error: "404 NOT FOUND"});
    });
};

export default constructorMethod;