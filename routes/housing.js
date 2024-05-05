import express from 'express';
import multer from 'multer';
import path from 'path';
import { ObjectId } from 'mongodb';
import { addHousing, getHousingById, updateHousing, getAllHousings } from '../data/housing.js';
import helpers from '../helpers.js';
import validator from 'validator';
import xss from 'xss';
import { get } from 'http';
import { getAllReviewsByHouseId } from '../data/reviewsForHousing.js';

const router = express.Router();

// for picture upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), 'public/images/housing'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});


const upload = multer({ storage: storage });


router.get('/list', async (req, res) => {
    try {
        const houses = await getAllHousings(); 
        res.render('listing', {
            title: "All Housing Listings",
            housings: houses
        });
    } catch (error) {
        console.error('Error retrieving all housings:', error);
        res.status(500).render('error', { error: "Internal Server Error" });
    }
});


router.get('/add', async (req, res) => {
    try {
        if (!req.session.user || req.session.user.role !== 'admin') {
            res.status(403).render('error', { title: "Forbidden", error: "You are not authorized to add housing" });
            return;
        }

        res.render('addHousing', { title: "Add Housing" });
    } catch (error) {
        console.error('Error rendering add housing page:', error);
        res.status(500).send('Internal Server Error');
    }
});



router.post('/add', async (req, res) => {
    try {
        if (!req.session.user || req.session.user.role !== 'admin') {
            res.status(403).render('error', { title: "Forbidden", error: "You are not authorized to add housing" });
            return;
        }

        // Basic details
        const address = xss(req.body.address);
        const zipCode = xss(req.body.zipCode);
        const city = xss(req.body.city);
        const state = xss(req.body.state);
        const homeType = xss(req.body.homeType);

        // Cost details
        const rentalCostMin = xss(req.body.rentalCostMin);
        const rentalCostMax = xss(req.body.rentalCostMax);

        // Unit details
        const studios = xss(req.body.studios);
        const oneBed = xss(req.body['1beds']);
        const twoBed = xss(req.body['2beds']);
        const threeBed = xss(req.body['3beds']);
        const fourBed = xss(req.body['4beds']);

        // Additional details
        const amenities = xss(req.body.amenities);
        const amenitiesArray = Array.isArray(amenities) ? amenities : amenities.split(',').map(item => item.trim());
        const petPolicy = xss(req.body.petPolicy);
        const garage = xss(req.body.garage);
        const latitude = xss(req.body.latitude);
        const longitude = xss(req.body.longitude);

        // Image handling
        const imagesInput = xss(req.body.images);
        const images = imagesInput ? imagesInput.split(',').map(url => url.trim()) : [];

        // Validations
        helpers.checkString(address, 'Address');
        helpers.checkString(zipCode, 'Zip Code');
        helpers.checkString(city, 'City');
        helpers.checkString(state, 'State');
        helpers.checkString(homeType, 'Home Type');
        if (!validator.isInt(rentalCostMin)) throw new Error('Invalid minimum rental cost');
        if (!validator.isInt(rentalCostMax)) throw new Error('Invalid maximum rental cost');
        if (!validator.isInt(studios)) throw new Error('Invalid number of studios');
        if (!validator.isInt(oneBed)) throw new Error('Invalid number of 1 bedroom units');
        if (!validator.isInt(twoBed)) throw new Error('Invalid number of 2 bedroom units');
        if (!validator.isInt(threeBed)) throw new Error('Invalid number of 3 bedroom units');
        if (!validator.isInt(fourBed)) throw new Error('Invalid number of 4 bedroom units');
        if (latitude && !validator.isFloat(latitude)) throw new Error('Invalid latitude');
        if (longitude && !validator.isFloat(longitude)) throw new Error('Invalid longitude');

        // Prepare the housing data object
        const housingData = {
            address,
            zipCode,
            city,
            state,
            homeType,
            rentalCostMin: parseInt(rentalCostMin, 10),
            rentalCostMax: parseInt(rentalCostMax, 10),
            studios: parseInt(studios, 10),
            oneBed: parseInt(oneBed, 10),
            twoBed: parseInt(twoBed, 10),
            threeBed: parseInt(threeBed, 10),
            fourBed: parseInt(fourBed, 10),
            amenities: amenitiesArray,
            petPolicy,
            garage: garage === 'on',
            location: {
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude)
            },
            images
        };

        // Add the new housing entry to the database
        const newHousing = await addHousing(housingData);
        res.redirect('/housing/list');
    } catch (error) {
        console.error('Error adding housing:', error);
        res.status(500).send('Internal Server Error');
    }
});



router.get('/:id', async (req, res) => {
    try {
        const housingId = req.params.id;
        
        if (!ObjectId.isValid(housingId)) {
            res.status(400).send('Invalid housing ID');
            return;
        }

        const housing = await getHousingById(housingId);
        if (!housing) {
            res.status(404).render('error', { error: 'Housing not found' });
            return;
        }

        const isAdmin = req.session.user && req.session.user.role === 'admin';
        let reviews;
        reviews = await getAllReviewsByHouseId(housingId); 

        const cleanAddress = xss(housing.address);
        //  use the

        res.render('housing', {
            title: `Details of ${cleanAddress}`,  
            housing: housing,
            reviews: reviews,
            isAdmin: isAdmin
        });
    } catch (error) {
        console.error('Error retrieving housing:', error);
        res.status(500).send('Internal Server Error');
    }
});




router.get('/edit/:id', async (req, res) => {
    try {
        if (!req.session.user || req.session.user.role !== 'admin') {
            res.status(403).render('error', { title: "Forbidden", error: "You are not authorized to edit housing" });
            return;
        }

        const housingId = req.params.id;
        if (!ObjectId.isValid(housingId)) {
            res.status(400).render('error', { title: "Bad Request", error: "Invalid Housing ID" });
            return;
        }

        const housing = await getHousingById(housingId); // Implement this function to retrieve housing details by ID
        
        if (!housing) {
            res.status(404).render('error', { title: "Not Found", error: "Housing not found" });
            return;
        }
        housing.selectedApartment = housing.homeType === "Apartment";
        housing.selectedHouse = housing.homeType === "House";
        housing.selectedTownhome = housing.homeType === "Townhome";
        housing.selectedAllowed = housing.petPolicy === "Allowed";
        housing.selectedNotAllowed = housing.petPolicy === "Not Allowed";
        housing.id = housing._id;
        console.log(housing);

        res.render('editHousing', {
            title: "Edit Housing",
            housing: housing
        });
    } catch (error) {
        console.error('Error rendering edit housing page:', error);
        res.status(500).send('Internal Server Error');
    }
});




router.post('/edit/:id', async (req, res) => {
    try {
        // Ensure user is authorized to perform edit operations
        console.log('req.body', req.body);
        if (!req.session.user || req.session.user.role !== 'admin') {
            res.status(403).render('error', { title: "Forbidden", error: "You are not authorized to edit housing" });
            return;
        }

        const housingId = req.params.id;
        if (!ObjectId.isValid(housingId)) {
            return res.status(400).send('Invalid Housing ID');
        }

        // Basic details
        const address = xss(req.body.address);
        const zipCode = xss(req.body.zipCode);
        const city = xss(req.body.city);
        const state = xss(req.body.state);
        const homeType = xss(req.body.homeType);

        // Cost details
        const rentalCostMin = xss(req.body.rentalCostMin);
        const rentalCostMax = xss(req.body.rentalCostMax);

        // Unit details
        const studios = xss(req.body.studios);
        const oneBed = xss(req.body['1beds']);
        const twoBed = xss(req.body['2beds']);
        const threeBed = xss(req.body['3beds']);
        const fourBed = xss(req.body['4beds']);

        // Additional details
        const amenities = xss(req.body.amenities);
        const amenitiesArray = Array.isArray(amenities) ? amenities : amenities.split(',').map(item => item.trim());
        const petPolicy = xss(req.body.petPolicy);
        const garage = xss(req.body.garage);
        const latitude = xss(req.body.latitude);
        const longitude = xss(req.body.longitude);

        // Image handling
        const imagesInput = xss(req.body.images);
        const images = imagesInput ? imagesInput.split(',').map(url => url.trim()) : [];

        // Validations
        helpers.checkString(address, 'Address');
        helpers.checkString(zipCode, 'Zip Code');
        helpers.checkString(city, 'City');
        helpers.checkString(state, 'State');
        helpers.checkString(homeType, 'Home Type');
        if (!validator.isInt(rentalCostMin)) throw new Error('Invalid minimum rental cost');
        if (!validator.isInt(rentalCostMax)) throw new Error('Invalid maximum rental cost');
        if (!validator.isInt(studios)) throw new Error('Invalid number of studios');
        if (!validator.isInt(oneBed)) throw new Error('Invalid number of 1 bedroom units');
        if (!validator.isInt(twoBed)) throw new Error('Invalid number of 2 bedroom units');
        if (!validator.isInt(threeBed)) throw new Error('Invalid number of 3 bedroom units');
        if (!validator.isInt(fourBed)) throw new Error('Invalid number of 4 bedroom units');
        if (latitude && !validator.isFloat(latitude)) throw new Error('Invalid latitude');
        if (longitude && !validator.isFloat(longitude)) throw new Error('Invalid longitude');

        // Prepare the update data object
        const updateData = {
            address,
            zipCode,
            city,
            state,
            homeType,
            rentalCostMin: parseInt(rentalCostMin, 10),
            rentalCostMax: parseInt(rentalCostMax, 10),
            studios: parseInt(studios, 10),
            oneBed: parseInt(oneBed, 10),
            twoBed: parseInt(twoBed, 10),
            threeBed: parseInt(threeBed, 10),
            fourBed: parseInt(fourBed, 10),
            amenities: amenitiesArray,
            petPolicy,
            garage: garage === 'on',
            location: {
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude)
            },
            images
        };

        // Perform the update operation
        await updateHousing(housingId, updateData);
        res.redirect(`/housing/${housingId}`);
    } catch (error) {
        console.error('Failed to update housing:', error);
        res.status(500).send('Internal Server Error');
    }
});



export default router;
