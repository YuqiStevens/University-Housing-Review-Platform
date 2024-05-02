import express from 'express';
import xss from 'xss';
//import validation from '../validation.js'
import helpers from '../helpers.js';
import { addHouse } from '../data/house.js';
import { bindStoreWithUser } from '../data/users.js';
const router = express.Router();



router.route('/')
    .get(async (req, res) => {
        res.status(200).render('addHouse', {
            title: "add house",
            selected: { default: 'selected' }
        })
    })



    .post(async (req, res) => {
        const adminId = req.session.user.userId; // user.role
        let name = xss(req.body.name).trim();
        let address = xss(req.body.address).trim();
        let city = xss(req.body.city).trim();
        let state = xss(req.body.state).trim();
        let zipCode = xss(req.body.zipCode).trim();
        //let phoneNumber = xss(req.body.phoneNumber).trim();
        //let email = xss(req.body.email).trim();
        let errors = [];

        try {
            helpers.checkIfStoreNameValid(name);

            if (await helpers.checkIfStoreNameExists(name)) {
                errors.push("House exists");
            }
        } catch (e) {
            errors.push(e);
        }


        try {
            const location = {
                address: address,
                city: city,
                state: state,
                zip: zipCode,
            }

            helpers.checkIfLocationValid(location);
        } catch (e) {
            errors.push(e);
            const selected = { default: 'selected' };

            return res.status(400).render('addHouse', {
                title: "add house",
                name: name,
                address: address,
                city: city,
                state: state,
                zipCode: zipCode,
                //phoneNumber: phoneNumber,
                //email: email,
                selected: selected,
                hasErrors: true,
                errors: errors,
            });
        }


        // try {
        //     //helpers.checkIfPhoneNumberValid(phoneNumber);
        //     helpers.checkEmail(email, "E-mail");
        // } catch (e) {
        //     errors.push(e);
        // }


        if (errors.length > 0) {
            const selected = { [`${state}`]: 'selected' };

            return res.status(400).render('addHouse', {
                title: "add house",
                name: name,
                address: address,
                city: city,
                state: state,
                zipCode: zipCode,
                //phoneNumber: phoneNumber,
                //email: email,
                selected: selected,
                hasErrors: true,
                errors: errors,
            });
        }


        //let houseId;


        try {
            storeId = await addHouse({
                adminId: adminId,
                name: name,
                address: address,
                city: city,
                state: state,
                zipCode: zipCode,
                //phoneNumber: phoneNumber,
                //email: email,
            });
        } catch (e) {
            errors.push(e);
        }   
        
        
        // try {
        //     const insertedHouse = await bindStoreWithUser(houseId, adminId);

        //     if (insertedHouse.insertHouse) {
        //         req.session.user.housingId = houseId;

        //         return res.status(200).redirect(`/home/${houseId}`);
        //     }
        // } catch (e) {
        //     errors.push(e);
        // }


        if (errors.length > 0) {
            const selected = { [`${state}`]: 'selected' };

            return res.status(400).render('addHouse', {
                title: "add house",
                name: name,
                address: address,
                city: city,
                state: state,
                zipCode: zipCode,
                //phoneNumber: phoneNumber,
                //email: email,
                selected: selected,
                hasErrors: true,
                errors: errors,
            });
        }
    })




export default router;
