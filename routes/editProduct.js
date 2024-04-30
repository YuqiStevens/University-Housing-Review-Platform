import express from 'express';
import multer from 'multer';
import path from 'path';
import helpers from '../helpers.js';
import * as productsData from '../data/products.js';
import xss from 'xss';
const router = express.Router();

const upload = multer({
    dest: path.join(process.cwd(), "/public/images/products"), 
  });

router
    .route('/:productId')
    .get(async (req, res) => { // runs well
        const productId = req.params.productId;
        const product = await productsData.getProductById(productId);
        res.status(200).render('editProduct', {
            title: "edit Product",
            productId: productId,
            product: product,
            selected: { [`${product.productCategory.replace(/\s+/g, '')}`]: "selected" }
        })
    })
    .post(upload.single("productImage"), async (req, res) => {
        let role
        if (req.session.user) role= req.session.user.role;
        let productId = xss(req.params.productId);
        let product = await productsData.getProductById(productId);
        let store_id = product.store_id;
        if (role !== 'admin' || req.session.user.ownedStoreId !== store_id) {
            return res.status(403).render('error', { error: "You don't have the authority to update this product." });
        }
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
            const product = await productsData.getProductById(productId);
            productImage = product.productImage;
        }  
        let errors = [];

        let newProduct = req.body;   
        if (!newProduct || Object.keys(newProduct).length === 0) {
            return res.status(400).json({ error: "You didn't provide any information to update." });
        }
        try {
            productId = helpers.checkId(productId, 'productId');
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
            if (stock < 0 || stock > 999) {
                errors.push("Stock should be 0 - 999");
            }
        } else {
            errors.push('Stock should be an positive integer');
        }
        if (errors.length > 0) {
            const product = await productsData.getProductById(productId);
            const selected = { [`${productCategory}`]: 'selected' };
            return res.status(400).render('editProduct', {
                title: "edit Product",
                productId: productId,
                product: product,
                selected: selected,
                hasErrors: true,
                errors: errors,
            })
        }
        errors = [];
        try {
          await productsData.updateProduct(
                productId,
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
        };
        if (errors.length > 0) {
            const product = await productsData.getProductById(productId);
            const selected = { [`${productCategory}`]: 'selected' };
            return res.status(400).render('editProduct', {
                title: "edit Product",
                productId: productId,
                product: product,
                selected: selected,
                hasErrors: true,
                errors: errors,
            })
        }
    })
    .delete(async (req, res) => { // runs well
        let productId = xss(req.params.productId);
        let product = await productsData.getProductById(productId);
        let role = req.session.user.role;
        let store_id = product.store_id;
        if (role !== 'admin' || req.session.user.ownedStoreId !== store_id) {
            return res.status(403).render('error', { error: "You don't have the authority to update this product." });
        }
        try {
            productId = helpers.checkId(productId, 'product');
        } catch (e) {
            return res.status(400).render('error', { error: e });
        }
        try {
            store_id = helpers.checkId(store_id, 'product');
        } catch (e) {
            return res.status(400).render('error', { error: e });
        }
        try {
            let product = await productsData.removeProduct(productId, store_id);
            if (!product) {
                return res.json({ deleteReview: false });
            }
            return res.json({ deleteReview: true, store_id: store_id});
        } catch (e) {
            return res.status(400).render('error', { error: e });
        }
    })

export default router;