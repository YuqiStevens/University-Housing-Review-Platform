//Here you will import route files and export them as used in previous labs
import loginRoutes from './login.js';
import registerRoutes from './register.js';
import homeRoutes from './home.js';
import storeRoutes from './store.js';
import addStoreRoutes from './addStore.js';
import profileRoutes from './profile.js';
import uploadRoutes from './upload.js';
import logoutRoutes from './logout.js';
import errorRoutes from './error.js';
import passwordRoutes from './password.js';;
import productsRoutes from './products.js';
// import reviewsForProductsRoutes from './reveiwsForProducts.js';
import editRoutes from './editstore.js';
import apiForLoginRoutes from './apiForLogin.js';
import addProductRoutes from './addProduct.js';
import editProductRoutes from './editProduct.js';

import storeCommentsRoutes from './storeComments.js';
import commentDetailRoutes from './commentsDetail.js';
import shareRoutes from './share.js';
import sendPromotionRoutes from './share.js'



const constructorMethod = (app) => {
  app.use('/login', loginRoutes);
  app.use('/register', registerRoutes);
  app.use('/home', homeRoutes);
  app.use('/store', storeRoutes);
  app.use('/addStore', addStoreRoutes);
  app.use('/profile', profileRoutes);
  app.use('/upload', uploadRoutes);
  app.use('/logout', logoutRoutes);
  app.use('/error', errorRoutes);
  app.use('/password', passwordRoutes);
  app.use('/editstore', editRoutes);
  app.use('/share', shareRoutes);
  app.use('/send-promotion', sendPromotionRoutes);
  app.use('/addProduct', addProductRoutes);
  app.use('/products', productsRoutes);
  app.use('/editProduct', editProductRoutes);
  app.use('/storeComments',storeCommentsRoutes);
  app.use('/commentsDetail',commentDetailRoutes);
  app.use('/apiForLogin', apiForLoginRoutes);

  app.use('*', (req, res) => {
    res.status(404).render('error', { title: "404 NOT FOUND", error: "404 NOT FOUND" });
  });
};

export default constructorMethod;