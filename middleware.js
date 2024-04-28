function logRequest(req, res, next) {
    const timestamp = new Date().toUTCString();
    const method = req.method;
    const route = req.originalUrl;
    const isAuthenticated = req.session.user ? 'Authenticated User' : 'Non-Authenticated User';
    console.log(`[${timestamp}]: ${method} ${route} (${isAuthenticated})`);
    if (route === '/') {
        if (req.session.user && req.session.user.role === 'admin') {
            return res.redirect('/admin');
        } else if (req.session.user && req.session.user.role === 'user') {
            return res.redirect('/user');
        } else {
            return res.redirect('/login');
        }
    } else {
        next();
    }
}

function redirectIfAuthenticated(req, res, next) {
    if (req.session.user) {
        if (req.session.user.role === 'admin') {
            return res.redirect('/admin');
        } else if (req.session.user.role === 'user') {
            return res.redirect('/user');
        }
    } else {
        next();
    }
}

function ensureAuthenticated(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
}

function ensureAdmin(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login');
    } else if (req.session.user.role !== 'admin') {
        return res.status(403).render('error', {
            error: 'You do not have permission to view this page.',
            userLink: '/user'
        });
    }
    next();
}

function logoutMiddleware(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
}

export {
    logRequest,
    redirectIfAuthenticated,
    ensureAuthenticated,
    ensureAdmin,
    logoutMiddleware
};
