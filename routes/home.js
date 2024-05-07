import express from 'express';
import { getAllHousings } from '../data/housing.js';
import { getHousingSearchResults } from '../data/home.js';
import validation from '../helpers.js';
import xss from 'xss';

const router = express.Router();

router.route('/')
    .get(async (req, res) => {
        try {
            const title = "Home Page";
            let isAdmin = false;
            let firstName = '';
            let lastName = '';
            let houses = [];

            if (req.session && req.session.user) {
                firstName = req.session.user.firstName;
                lastName = req.session.user.lastName;
                isAdmin = req.session.user.role === 'admin';
            }

            houses = await getAllHousings();

            if (!houses || houses.length === 0) {
                return res.status(200).render('home', {
                    title: title,
                    firstName: firstName,
                    lastName: lastName,
                    hasHouses: false,
                    isAdmin: isAdmin,
                    searchPerformed: false
                });
            }

            res.status(200).render('home', {
                title: title,
                firstName: firstName,
                lastName: lastName,
                hasHouses: true,
                houses: houses,
                isAdmin: isAdmin,
                searchPerformed: false
            });
        } catch (e) {
            return res.status(500).render('error', { title: "Error", message: "Internal server error." });
        }
    });

    
    router.route('/search')
    .post(async (req, res) => {
        const title = "Home Page";
        let isAdmin = false;
        let firstName = '';
        let lastName = '';
        let searchResults = [];
        let noResultsMessage = null;

        try {
            if (req.session && req.session.user) {
                firstName = req.session.user.firstName;
                lastName = req.session.user.lastName;
                isAdmin = req.session.user.role === 'admin';
            }

            let searchTerm = xss(req.body.searchTerm || '');
            let searchType = xss(req.body.homeType || '');
            let rentalCostMin = parseFloat(xss(req.body.rentalCostMin || 'NaN'));
            let rentalCostMax = parseFloat(xss(req.body.rentalCostMax || 'NaN'));
            let amenities = xss(req.body.amenities || '');
            let garage = xss(req.body.garage || '');
            let petPolicy = xss(req.body.petPolicy || '');

            const filters = {};
            if (searchType) filters.homeType = searchType;
            if (!isNaN(rentalCostMin)) filters.rentalCostMin = rentalCostMin;
            if (!isNaN(rentalCostMax)) filters.rentalCostMax = rentalCostMax;
            if (amenities) filters.amenities = amenities.split(',').map(x => x.trim());
            if (garage === 'true') filters.garage = true;
            if (garage === 'false') filters.garage = false;
            if (petPolicy) filters.petPolicy = petPolicy;

            const allFieldsEmpty = !searchTerm && !searchType && 
                                    isNaN(rentalCostMin) && isNaN(rentalCostMax) && 
                                    !amenities && !garage && !petPolicy;

            if (allFieldsEmpty) {
                return res.status(200).render('home', {
                    title: title,
                    firstName: firstName,
                    lastName: lastName,
                    searchResults: [],
                    noResultsMessage: "No housings matched your search.",
                    isAdmin: isAdmin,
                    searchPerformed: true
                });
            }

            try {
                if (searchTerm) {
                    searchTerm = validation.checkSearchValid(searchTerm);
                } else {
                    searchTerm = "";
                }
            } catch (e) {
                searchTerm = '';
            }

            try {
                searchResults = await getHousingSearchResults(searchTerm, filters);
                if (!searchResults || searchResults.length === 0) {
                    noResultsMessage = "No housings matched your search.";
                }
            } catch (e) {
                console.error("Search error:", e);
                return res.status(500).render('error', { title: "Error", message: e.message });
            }

            return res.status(200).render('home', {
                title: title,
                firstName: firstName,
                lastName: lastName,
                searchResults: searchResults,
                noResultsMessage: noResultsMessage,
                isAdmin: isAdmin,
                searchPerformed: true
            });

        } catch (e) {
            console.error("Search error:", e);
            return res.status(500).render('error', { title: "Error", message: "Internal server error." });
        }
    });



    



export default router;
