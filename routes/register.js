import express from 'express';
import validation from '../validation.js';
import helper from '../helpers.js';
import { addUser } from '../data/users.js';
import xss from 'xss';
const router = express.Router();



router.route('/').get(async (req, res) => {
  const title = "Register";
  res.render('register', { title: title });
});



router.route('/').post(async (req, res) => {
  const title = "Register";
  let cleanUserName = xss(req.body.userName);
  let cleanFirstName = xss(req.body.firstName);
  let cleanLastName = xss(req.body.lastName);
  let cleanEmail = xss(req.body.email).toLowerCase();
  let cleanPassword = xss(req.body.password);
  let cleanConfirmPassword = xss(req.body.confirmPassword);
  let cleanRole = xss(req.body.role).toLowerCase();
  let errors = [];
  try {
    cleanUserName = validation.checkUserName(cleanUserName, 'User Name');
  } catch (e) {
    errors.push(e);
  }
  try {
    cleanFirstName = validation.checkName(cleanFirstName, 'First Name');
  } catch (e) {
    errors.push(e);
  }
  try {
    cleanLastName = validation.checkName(cleanLastName, 'Last Name');
  } catch (e) {
    errors.push(e);
  }
  try {
    cleanEmail = validation.checkEmail(cleanEmail, 'E-mail');
    if (await helper.checkIfEmailExists(cleanEmail)) {
      errors.push('The email address exists');
    }
  } catch (e) {
    errors.push(e);
  }
  try {
    cleanPassword = validation.checkPassword(cleanPassword, 'Password');
  } catch (e) {
    errors.push(e);
  }
  if (cleanConfirmPassword !== cleanPassword) {
    errors.push('Password did not match');
  }
  cleanRole = cleanRole.trim();
  if (cleanRole !== 'admin' && cleanRole !== 'user') {
    errors.push('The role should be admin or user');
  }

  if (errors.length > 0) {
    let selectedAdmin = '', selectedUser = '', selectedDefault = '';
    if (cleanRole === "admin") {
      selectedAdmin = "selected";
    } else if (cleanRole === "user") {
      selectedUser = "selected";
    } else {
      selectedDefault = "selected";
    }
    return res.status(400).render('register',
      {
        title: "Sign Up",
        userName: cleanUserName,
        firstName: cleanFirstName,
        lastName: cleanLastName,
        email: cleanEmail,
        password: cleanPassword,
        confirmPassword: cleanConfirmPassword,
        selectedDefault: selectedDefault,
        selectedAdmin: selectedAdmin,
        selectedUser: selectedUser,
        errors: errors,
        hasErrors: true
      });
  }
  let newUser = {};
  try {
    newUser = await addUser(
      cleanUserName,
      cleanFirstName,
      cleanLastName,
      cleanEmail,
      cleanPassword,
      cleanRole
    );
  } catch (e) {
    errors.push(e);
    let selectedAdmin = '', selectedUser = '', selectedDefault = '';
    if (cleanRole === "admin") {
      selectedAdmin = "selected";
    } else if (cleanRole === "user") {
      selectedUser = "selected";
    } else {
      selectedDefault = "selected";
    }
    return res.status(400).render('register',
      {
        title: "Sign Up",
        userName: cleanUserName,
        firstName: cleanFirstName,
        lastName: cleanLastName,
        email: cleanEmail,
        password: cleanPassword,
        confirmPassword: cleanConfirmPassword,
        selectedDefault: selectedDefault,
        selectedAdmin: selectedAdmin,
        selectedUser: selectedUser,
        errors: errors,
        hasErrors: true
      });
  }
  if (!newUser) {
    return res.status(500).render('error', { title: "Internal Server Error", error: "Internal Server Error" });
  }
  res.status(200).redirect('/login');

});
export default router;
