import express from 'express';
import validation from '../validation.js'
import helper from '../helpers.js';
import { loginUser } from '../data/users.js';
import validator from 'validator';
import xss from 'xss';
const router = express.Router();

router.route('/')
  .get(async (req, res) => {
    res.render('login', { title: "Login Page" });
  })
  // use Ajax to login
  // .post(async (req, res) => {
  //   const title = "Login Page";
  //   let cleanEmail = xss(req.body.email);
  //   let cleanPassword = xss(req.body.password);
  //   let errors = [];
  //   cleanEmail = cleanEmail.trim();
  //   cleanPassword = cleanPassword.trim();
  //   if (!cleanEmail) errors.push("Please enter your email address");
  //   if (!cleanPassword) errors.push("Please enter your password");
  //   if (errors.length > 0) {
  //     return res.status(400).render('login', { title: "Login", hasErrors: true, errors: errors });
  //   }

  //   if (!validator.isEmail(cleanEmail)) errors.push("Email address should be a valid email address format. example@example.com");

  //   if (!validation.checkPassword(cleanPassword, 'password')) errors.push("Password must have 8 characters, with at least 1 lowercase letters, 1 uppercase letters, 1 numbers, and 1 symbols");

  //   if (errors.length > 0) {
  //     return res.status(400).render('login', { title: "Login", email: cleanEmail, password: cleanPassword, hasErrors: true, errors: errors });
  //   }

  //   let user;
  //   try {
  //     user = await loginUser(cleanEmail, cleanPassword);
  //   } catch (e) {
  //     errors.push(e)
  //     return res.status(400).render('login', { title: "Login", email: cleanEmail, password: cleanPassword, hasErrors: true, errors: errors });
  //   }
  //   req.session.user = user;
  //   if (user.role === "admin" && user.ownedStoreId) {
  //     res.status(200).redirect(`/store/${user.ownedStoreId}`);
  //   } else if (user.role === "admin" && !user.ownedStoreId) {
  //     res.status(200).redirect('addStore');
  //   } else if (user.role === "user") {
  //     res.status(200).redirect('/home');
  //   }
  // });


export default router;