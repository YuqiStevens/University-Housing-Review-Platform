import express from 'express';
import { getUser } from '../data/users.js';
import { ObjectId } from "mongodb";
import { storesData, productsData } from "../data/index.js";
import { getAllStores } from '../data/stores.js';
const router = express.Router();

    router.route('/:id').get(async (req, res) => {
    const storeId = req.params.id;
    const userRole = req.session.user.role
    try {
        if (!ObjectId.isValid(storeId)) {
            throw 'invalid object ID';
        }
    } catch (e) {
        return res.status(400).render('error', { error: e });
    }
    try {
        const store = await storesData.getStoreById(storeId);
        const storeProducts = await productsData.getAllProductsByStoreId(storeId);
        storeProducts.forEach(product => {
            if (product.productReviews[0] && product.productReviews[0].productReviews)
                product.firstReview = product.productReviews[0].productReviews;
            else
                product.firstReview = "No Review";
        });
        const user = req.session.user;
        if (store === null)
            throw "No store with that ID";
        const isOwner = user && user.id === store.admin_id;

        const theUser = await getUser(user.id);
        const role = user.role;
        let isAdminAndHasAStore = false;
        if (role === 'admin' && user.ownedStoreId && storeId !== user.ownedStoreId) {
            isAdminAndHasAStore = true;
        }
        const contact_information = store.contact_information;
        const store_location = store.store_location;
        res.status(200).render('store', {
            name: theUser.userName,
            avatarId: theUser.avatar,
            storeId: user.ownedStoreId,
            isAdminAndHasAStore: isAdminAndHasAStore,
            title: store.name,
            storeProducts: storeProducts,
            storeID: storeId,
            user: userRole,
            isOwner: isOwner,
            contact_information:contact_information,
            store_location:store_location
        });


    } catch (e) {
        return res.status(404).render('error', { error: e });
    }
}),

router.route('/').get(async (req, res) => {
    const title = "All Store";
    const id = req.session.user.id;
    const role = req.session.user.role;
    const storeId = req.session.user.ownedStoreId;
    let isAdminAndHasAStore = false;
    if (role === 'admin' && storeId) {
        isAdminAndHasAStore = true;
    }
    let isAdminAndHasNoStore = false;
    if (role === 'admin' && !storeId) {
        isAdminAndHasNoStore = true;
    }
    const user = await getUser(id);
    const name = user.userName;
    const stores = await getAllStores();
    if (!stores) {
        return res.status(400).render('storeList',{
            title: title, 
            name: name,
            avatarId: user.avatar,
            hasStores: false,
            isAdminAndHasAStore: isAdminAndHasAStore,
            isAdminAndHasNoStore: isAdminAndHasNoStore,
        });
    }
    res.status(200).render('storeList',{
        title: title, 
        name: name,
        avatarId: user.avatar,
        hasStores: true,
        stores: stores,
        isAdminAndHasAStore: isAdminAndHasAStore,
        isAdminAndHasNoStore: isAdminAndHasNoStore,
        storeId: storeId,
    })
})
export default router;