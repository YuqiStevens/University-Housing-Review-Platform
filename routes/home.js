import express from 'express';
import { ObjectId } from 'mongodb';
import { getUserById } from '../data/users.js';
import { getAllHousings } from '../data/housing.js';
import { getHousingSearchResults } from '../data/home.js';
import validation from '../helpers.js';
import xss from 'xss';

const router = express.Router();

router.route('/')
    .get(async (req, res) => {
        try {
            if (!req.session.user) {
                return res.redirect('/login');
            }

            const title = "Home Page";
            const id = req.session.user.id;
            const isAdmin = req.session.user.role === 'admin';

            const user = await getUserById(id);
            const houses = await getAllHousings();

            res.status(200).render('home', {
                title: title,
                firstName: req.session.user.firstName,
                lastName: req.session.user.lastName,
                hasHouses: Boolean(houses && houses.length),
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
                isAdmin = req.session.user.role === 'admin';
                firstName = req.session.user.firstName;
                lastName = req.session.user.lastName;
            }

            let searchType = xss(req.body.homeType || '');
            let searchTerm = xss(req.body.searchTerm || '');
            let rentalCostMin = parseFloat(xss(req.body.rentalCostMin || '0'));
            let rentalCostMax = parseFloat(xss(req.body.rentalCostMax || 'Infinity'));
            let amenities = xss(req.body.amenities || '');
            let garage = xss(req.body.garage || '');
            let petPolicy = xss(req.body.petPolicy || '');

            // Construct filters object
            const filters = {};

            if (searchType) filters.homeType = searchType;
            if (!isNaN(rentalCostMin) && rentalCostMin > 0) filters.rentalCostMin = rentalCostMin;
            if (!isNaN(rentalCostMax) && rentalCostMax < Infinity) filters.rentalCostMax = rentalCostMax;
            if (amenities) filters.amenities = { $regex: new RegExp(amenities, 'i') };
            if (garage === 'true') filters.garage = true;
            if (garage === 'false') filters.garage = false;
            if (petPolicy) filters.petPolicy = petPolicy;

            console.log("Filters:", filters);

            // Validate search term
            try {
                searchTerm = validation.checkSearchValid(searchTerm);
            } catch (e) {
                return res.status(400).render('error', { title: "Error", message: e.message });
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

            console.log("Search Results:", searchResults);

            res.status(200).render('home', {
                title: title,
                firstName: firstName,
                lastName: lastName,
                searchResults: searchResults,
                noResultsMessage: noResultsMessage,
                searchTerm: searchTerm,
                isAdmin: isAdmin,
                searchPerformed: true // indicate that a search was performed
            });

        } catch (e) {
            console.error("Search error:", e);
            return res.status(500).render('error', { title: "Error", message: "Internal server error." });
        }
    });



export default router;
