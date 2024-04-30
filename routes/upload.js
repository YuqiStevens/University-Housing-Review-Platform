import express from "express";
import multer from "multer";
import { updateAvatar } from "../data/users.js";
import { ObjectId } from "mongodb";
import validation from "../validation.js";
import { updateImage, updateStore } from "../data/stores.js";
import path from "path";
import xss from "xss";
import fs from "fs";
const router = express.Router();

const upload = multer({
  dest: path.join(process.cwd(), "/public/images/users"),
});

router.post("/", upload.single("file"), async (req, res) => {
  if (req.file) {
    await updateAvatar(req.session.user.id, req.file.filename);
  }
  return res.status(200).redirect("/profile");
});

const uploadStore = multer({
  dest: path.join(process.cwd(), "/public/images/stores"),
});

router.post("/store/:id", uploadStore.single("file"), async (req, res) => {
  console.log(req.params.id);
  let errors = [];
  if (req.file) {
    try {
      await updateImage(req.params.id, req.file.filename);
    } catch (e) {
      console.log(e);
    }
  }
  const adminId = req.session.user.id;
  const storeId = req.params.id;
  let name = xss(req.body.name).trim();
  let address = xss(req.body.address).trim();
  let city = xss(req.body.city).trim();
  let state = xss(req.body.state).trim();
  let zipCode = xss(req.body.zipCode).trim();
  let phoneNumber = xss(req.body.phoneNumber).trim();
  let email = xss(req.body.email).trim();

  try {
    validation.checkIfStoreNameValid(name);
  } catch (e) {
    errors.push(e);
    const selected = { default: "selected" };
    return res.status(400).render("editStore", {
      title: "editStore",
      name: name,
      address: address,
      city: city,
      state: state,
      zipCode: zipCode,
      phoneNumber: phoneNumber,
      email: email,
      selected: selected,
      hasErrors: true,
      errors: errors,
      storeId: storeId,
    });
  }
  const location = {
    address: address,
    city: city,
    state: state,
    zip: zipCode,
  };
  const contact_information = {
    email: email,
    phoneNumber: phoneNumber,
  };
  try {
    validation.checkIfLocationValid(location);
    console.log("checkIfLocationValid");
  } catch (e) {
    errors.push(e);
    const selected = { default: "selected" };
    return res.status(400).render("editStore", {
      title: "editStore",
      name: name,
      address: address,
      city: city,
      state: state,
      zipCode: zipCode,
      phoneNumber: phoneNumber,
      email: email,
      selected: selected,
      hasErrors: true,
      errors: errors,
      storeId: storeId,
    });
  }

  try {
    validation.checkIfPhoneNumberValid(phoneNumber);
    console.log("checkIfPhoneNumberValid");
    validation.checkEmail(email, "E-mail");
  } catch (e) {
    errors.push(e);
    const selected = { default: "selected" };
    return res.status(400).render("editStore", {
      title: "editStore",
      name: name,
      address: address,
      city: city,
      state: state,
      zipCode: zipCode,
      phoneNumber: phoneNumber,
      email: email,
      selected: selected,
      hasErrors: true,
      errors: errors,
      storeId: storeId,
    });
  }
 
  try {
    await updateStore(req.params.id, {
      adminId: adminId,
      name: name,
      address: address,
      city: city,
      state: state,
      zipCode: zipCode,
      phoneNumber: phoneNumber,
      email: email,
    });
  } catch (e) {
    console.log(e);
    errors.push(e);
     
    const selected = { [`${state}`]: "selected" };
    return res.status(400).render("editStore", {
      title: "editStore",
      name: name,
      address: address,
      city: city,
      state: state,
      zipCode: zipCode,
      phoneNumber: phoneNumber,
      email: email,
      selected: selected,
      hasErrors: true,
      errors: errors,
      storeId: storeId,
    });
  
  }
  
  return res.redirect(`/store/${storeId}`);
});
export default router;
