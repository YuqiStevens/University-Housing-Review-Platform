import {stores, products} from "../config/mongoCollections.js"
import { ObjectId } from 'mongodb';
import validation from '../validation.js'

export async function getStoreSearchResults(searchTerm) {
    searchTerm = validation.checkSearchValid(searchTerm);
    
    const storeCollection = await stores();
    
    const matchedStores = await storeCollection
        .find({ name: { $regex: searchTerm, $options: 'i' } })
        .limit(20)
        .toArray();
    
    const formattedStores = matchedStores.map(store => ({
        name: store.name,
        storeID: store._id,
        photo_id: store.photo_id, 
        isStore: true
    }));

    return formattedStores;
}


export async function getProductSearchResults(searchTerm) {
    searchTerm = validation.checkSearchValid(searchTerm);
    const productCollection = await products();

    let matchedProducts = await productCollection
        .find({ productName: { $regex: searchTerm, $options: 'i' } })
        .limit(50)
        .toArray();

    matchedProducts = matchedProducts.sort((a, b) => {
        if (a.stock === 0) return 1;
        if (b.stock === 0) return -1;
        return 0;
    });    

    let outOfStockCategories = matchedProducts
        .filter(product => product.stock === 0)
        .map(product => product.category);

    outOfStockCategories = [...new Set(outOfStockCategories)];

    let replacements = [];
    for (const category of outOfStockCategories) {
        const categoryRecommendations = await productCollection
            .find({ category: category, stock: { $gt: 0 } })
            .sort({ rating: -1 })
            .limit(3)
            .toArray();
        replacements.push(...categoryRecommendations);
    }

    replacements = replacements.filter((v, i, a) => a.findIndex(t => (t.productId === v.productId)) === i);

    const formattedProducts = matchedProducts.map(product => {
        let stockStatus;
        if (product.stock === 0) {
            stockStatus = 0; // Out of stock
        } else if (product.stock > 0 && product.stock < 100) {
            stockStatus = 1; // Low stock
        } else {
            stockStatus = 2; // In stock
        }

        return {
            name: product.productName,
            productId: product._id,
            productImage: product.productImage,
            isProduct: true,
            isOutOfStock: product.stock === 0,
            isLowStock: product.stock === 1,
            isInStock: product.stock === 2,
        };
    });

    return {
        searchResults: formattedProducts,
        replacements: replacements.length > 0 ? replacements.map(product => ({
            name: product.productName,
            productId: product._id,
            productImage: product.productImage,
            category: product.category,
            rating: product.rating,
            isRecommendation: true
        })) : null
    };
}


export async function getRecommendedStores(userId) {
    
    const storeCollection = await stores();

    const topRatedStores = await storeCollection
        .find({})
        .sort({ rating: -1 })
        .limit(5)
        .toArray();
    //console.log(topRatedStores);
    const formattedTopRatedStores = topRatedStores.map(store => ({
        name: store.name,
        storeId: store._id,
        photo_id: store.photo_id,
        rating: store.rating,
    }));
    
    return formattedTopRatedStores;
}

export async function getRecommendedProducts(userId) {
    const productCollection = await products();

    const topRatedProducts = await productCollection
        .find({ stock: { $gt: 0 } })
        .sort({ rating: -1 })
        .limit(5)
        .toArray();

    //console.log(topRatedProducts);
    const formattedTopRatedProducts = topRatedProducts.map(product => {
        let stockStatus;
        if (product.stock === 0) {
            stockStatus = 0; // Out of stock
        } else if (product.stock > 0 && product.stock < 100) {
            stockStatus = 1; // Low stock
        } else {
            stockStatus = 2; // In stock
        }

        return {
            productName: product.productName,
            productId: product._id,
            productImage: product.productImage,
            rating: product.rating,
            isOutOfStock: stockStatus === 0,
            isLowStock: stockStatus === 1,
            isInStock: stockStatus === 2,
        };
    });

    return formattedTopRatedProducts;
}