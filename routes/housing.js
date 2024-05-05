import express from 'express';
import multer from 'multer';
import path from 'path';
import { ObjectId } from 'mongodb';
import { addHousing, getHousingById, updateHousing, getAllHousings } from '../data/housing.js';
import helpers from '../helpers.js';
import validator from 'validator';
import xss from 'xss';

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

router.post('/add', upload.array('images'), async (req, res) => {
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
        const images = req.files.map(file => file.filename);  

        // Validations
        helpers.checkString(address, 'Address');
        helpers.checkString(zipCode, 'Zip Code');
        helpers.checkString(city, 'City');
        helpers.checkString(state, 'State');
        helpers.checkString(homeType, 'Home Type');
        validator.isInt(rentalCostMin);
        validator.isInt(rentalCostMax);
        validator.isInt(studios);
        validator.isInt(oneBed);
        validator.isInt(twoBed);
        validator.isInt(threeBed);
        validator.isInt(fourBed);
        validator.isInt(latitude);
        validator.isInt(longitude);

        // Ensure required fields are provided
        if (!address || !city || !state || !homeType) {
            res.status(400).send('Missing required fields');
            return;
        }

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
                latitude,
                longitude
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

        const cleanAddress = xss(housing.address);

        res.render('housing', {
            title: `Details of ${cleanAddress}`,  
            housing: housing,
            isAdmin: isAdmin
        });
    } catch (error) {
        console.error('Error retrieving housing:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/edit/:id', upload.array('images'), async (req, res) => {
    const housingId = req.params.id;
    if (!ObjectId.isValid(housingId)) {
        return res.status(400).send('Invalid Housing ID');
    }

    try {
        const address = xss(helpers.checkString(req.body.address, 'Address'));
        const zipCode = xss(helpers.checkString(req.body.zipCode, 'Zip Code'));
        const city = xss(helpers.checkString(req.body.city, 'City'));
        const state = xss(helpers.checkString(req.body.state, 'State'));
        const homeType = xss(helpers.checkString(req.body.homeType, 'Home Type'));
        const rentalCostMin = xss(validator.isInt(req.mdentalCostMin));
        const rentalCostMax = xss(validator.isInt(req.mdentalCostMax));
        const amenities = xss(req.body.amenities);
        const petPolicy = xss(req.body.petPolicy);
        const garage = xss(req.body.garage) === 'on';

        const images = req.files.map(file => file.filename); 

        const updateData = {
            address,
            zipCode,
            city,
            state,
            homeType,
            rentalCost: {
                min: parseInt(rentalCostMin, 10),
                max: parseInt(rentalCostMax, 10)
            },
            amenities: amenitiesArray,
            petPolicy,
            garage,
            images
        };

        await updateHousing(housingId, updateData);
        res.redirect(`/housing/${housingId}`); 
    } catch (error) {
        console.error('Failed to update housing:', error);
        res.status(500).send('Failed to update housing');
    }
});

export default router;
