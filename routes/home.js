import express from 'express';
import { ObjectId } from'mongodb';
import { getUserById } from '../data/users.js';
import { getAllHousings} from '../data/housing.js';
import { getHousingSearchResults } from '../data/home.js';
import validation from '../helpers.js';
import xss from 'xss';

const router = express.Router();

router.route('/')
    .get(async (req, res) => {
        try {
            const title = "Home Page";
            const id = req.session.user.id;
            const isAdmin = req.session.user.role === 'admin';

            const user = await getUserById(id);
            const houses = await getAllHousings();

            if (!houses || houses.length === 0) {
                return res.status(200).render('home', {
                    title: title,
                    //userName: user.userName,
                    hasHouses: false,
                    isAdmin: isAdmin,
                    searchPerformed: false
                });
            }

            res.status(200).render('home', {
                title: title,
               // userName: user.userName,
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
        //let userName = '';

        try {
            if (req.session && req.session.user) {
                isAdmin = req.session.user.role === 'admin';
                //userName = req.session.user.userName;
            }

            let searchType = xss(req.body.homeType);
            let searchTerm = xss(req.body.searchTerm);
            let rentalCostMin = xss(req.body.rentalCostMin);
            let rentalCostMax = xss(req.body.rentalCostMax);
            let amenities = xss(req.body.amenities);
            let garage = xss(req.body.garage);
            let petPolicy = xss(req.body.petPolicy);

            let searchResults, noResultsMessage = null;

            try {
                searchTerm = validation.checkSearchValid(searchTerm);
            } catch (e) {
                return res.status(400).render('error', { title: "Error", message: e.message });
            }

            const filters = {
                homeType: searchType,
                rentalCostMin: rentalCostMin || null,
                rentalCostMax: rentalCostMax || null,
                amenities: amenities || null,
                garage: garage || null,
                petPolicy: petPolicy || null
            };

            try {
                searchResults = await getHousingSearchResults(searchTerm, filters);
            } catch (e) {
                return res.status(500).render('error', { title: "Error", message: e.message });
            }

            if (!searchResults || searchResults.length === 0) {
                noResultsMessage = "No housings matched your search.";
            }

            res.status(200).render('home', {
                title: title,
                //userName: userName,
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
