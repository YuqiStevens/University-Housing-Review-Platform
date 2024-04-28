import authRoutes from './auth_routes.js';

const constructorMethod = (app) => {
    app.use('/', authRoutes);

    app.use('*', (req, res) => {
        if (req.accepts('html')) {
            res.status(404).render('error', { errorMessage: 'Page Not Found' });
        } else {
            res.status(404).json({ error: 'Route Not Found' });
        }
    });
};

export default constructorMethod;