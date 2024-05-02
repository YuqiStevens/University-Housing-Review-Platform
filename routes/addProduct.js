import express from 'express';
import multer from 'multer';
import path from 'path';
import xss from 'xss';
import * as productsData from '../data/products.js';
import helpers from '../helpers.js';
const router = express.Router();


const upload = multer({
    dest: path.join(process.cwd(), "/public/images/products"), 
  });


router
    .route('/')
    .get(async (req, res) => { // runs well
        res.status(200).render('addProduct', {
            title: "add Product",
            selected: { default: 'selected' }
        })
    })


    .post(upload.single("productImage"), async (req, res) => { 
        let role = req.session.user.role;

        if (role !== 'admin' || !req.session.user.ownedStoreId) {
            return res.status(403).render('error', { error: "You don't have the authority to update this product." });
        }
        
        let user_id = xss(req.session.user.id);
        let store_id = xss(req.session.user.ownedStoreId);
        let productName = xss(req.body.productName);
        let productCategory = xss(req.body.productCategory);
        let productPrice = parseFloat(xss(req.body.productPrice));
        let manufactureDate = xss(req.body.manufactureDate);
        let expirationDate = xss(req.body.expirationDate);
        let stock = xss(req.body.stock);
        let productImage;

        if (req.file && req.file.filename) {
            productImage = req.file.filename;
        } else {
            productImage = 'default.png';
        }   

        let errors = [];

        let newProduct = req.body;

        if (!newProduct || Object.keys(newProduct).length === 0) {
            return res.status(400).json({ error: "You didn't provide any information." });
        }

        try {
            user_id = helpers.checkId(user_id, 'user_id');
        } catch (e) {
            errors.push(e);
        }

        try {
            store_id = helpers.checkId(store_id, 'store_id'); 
        } catch (e) {
            errors.push(e);
        }

        try {
            productName = helpers.checkProductName(productName);
        } catch (e) {
            errors.push(e);
        }

        try {
            productCategory = helpers.checkCategories(productCategory, 'productCategory');
        } catch (e) {
            errors.push(e);
        }

        try {
            productPrice = helpers.checkPrice(productPrice, 'productPrice');
        } catch (e) {
            errors.push(e);
        }

        try {
            manufactureDate = helpers.checkDateFormat(manufactureDate, 'manufactureDate');
        } catch (e) {
            errors.push(e);
        }

        try {
            expirationDate = helpers.checkDateFormat(expirationDate, 'expirationDate');
        } catch (e) {
            errors.push(e);
        }

        try {
            helpers.checkDateValid(manufactureDate, expirationDate);
        } catch (e) {
            errors.push(e);
        }

        if (/^\d+$/.test(stock)) {
            stock = parseInt(stock, 10);
            if (stock < 1 || stock > 999) {
                errors.push("Stock should be 1 - 999");
            }
        } else {
            errors.push('Stock should be an integer');
        }


        if (errors.length > 0) {
            const selected = { [`${productCategory}`]: 'selected' };
            return res.status(400).render('addProduct', {
                title: "add Product",
                productName: productName,
                productCategory: productCategory,
                productPrice: productPrice,
                manufactureDate: manufactureDate,
                expirationDate: expirationDate,
                stock: stock,
                selected: selected,
                hasErrors: true,
                errors: errors,
            })
        }

        errors = [];

        try {
            let productId = await productsData.addProduct(
                user_id,
                store_id,
                productName,
                productCategory,
                productPrice,
                manufactureDate,
                expirationDate,
                stock,
            );

            await productsData.updateImage(productId, productImage);
            return res.status(200).redirect(`/products/${productId}`);
        } catch (e) {
            errors.push(e);
        }


        if (errors.length > 0) {
            const selected = { [`${productCategory}`]: 'selected' };

            return res.status(400).render('addProduct', {
                title: "add Product",
                productName: productName,
                productCategory: productCategory,
                productPrice: productPrice,
                manufactureDate: manufactureDate,
                expirationDate: expirationDate,
                stock: stock,
                selected: selected,
                hasErrors: true,
                errors: errors,
            })
        }
    })



export default router;