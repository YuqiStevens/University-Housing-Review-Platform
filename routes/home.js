import express from 'express';
import { ObjectId } from "mongodb";
import { getUser } from '../data/users.js';
import { getAllHouses, getHouseSearchResults } from '../data/house.js'; 
import validation from '../helpers.js';
import xss from 'xss';


const router = express.Router();


router.route('/')
    .get(async (req, res) => {
        const title = "Home Page";
        const id = req.session.user.userId;
        const isAdmin = req.session.user.role === 'admin';
        
        const user = await getUser(id);
        const houses = await getAllHouses();

        if (!houses) {
            return res.status(400).render('home', {
                title: title,
                name: user.userName,
                hasHouses: false,
                isAdmin: isAdmin,
            });
        }

        res.status(200).render('home', {
            title: title,
            name: user.userName,
            hasHouses: true,
            houses: houses,
            isAdmin: isAdmin,
        });
    });

    


router.route('/search').post(async (req, res) => {
    const title = "Home Page";
    const isAdmin = req.session.user.role === 'admin';
    const id = req.session.user.userId;
    const user = await getUser(id);

    let searchType = xss(req.body.homeType);
    let searchTerm = xss(req.body.searchTerm);

    let searchResults, noResultsMessage;

    try {
        searchTerm = validation.checkSearchValid(searchTerm);
    } catch (e) {
        return res.status(400).render('error', { title: "Error", message: e.message });
    }

    const filters = {
        homeType: searchType,
        rentalCostMin: xss(req.body.rentalCostMin),
        rentalCostMax: xss(req.body.rentalCostMax),
        amenities: xss(req.body.amenities),
        garage: xss(req.body.garage),
        petPolicy: xss(req.body.petPolicy)
    };

    searchResults = await getHouseSearchResults(searchTerm, filters);

    if (!searchResults || searchResults.length === 0) {
        noResultsMessage = "No housings matched your search.";
    }

    res.status(200).render('home', {
        title: title,
        name: user.userName,
        searchResult: searchResults,
        noResultsMessage: noResultsMessage,
        searchTerm: searchTerm,
        isAdmin: isAdmin,
    });
});




export default router;
