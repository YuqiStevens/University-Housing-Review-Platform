import express from 'express';
import multer from 'multer';
import path from 'path';
import { ObjectId } from 'mongodb';
import { addHousing } from '../data/housing.js';
import { getHousingById } from '../data/housing.js';
import { updateHousing } from '../data/housing.js';
import helpers from '../helpers.js';
import validator from "validator";
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

router.post('/add', upload.array('images'), async (req, res) => {
    try {
        const address = xss(req.body.address);
        const zipCode = xss(req.body.zipCode);
        const city = xss(req.body.city);
        const state = xss(req.body.state);
        const homeType = xss(req.body.homeType);
        const rentalCostMin = xss(req.body.rentalCostMin);
        const rentalCostMax = xss(req.body.rentalCostMax);
        const amenities = xss(req.body.amenities);
        const petPolicy = xss(req.body.petPolicy);
        const garage = xss(req.body.garage);

        const images = req.files.map(file => file.filename);  

        helpers.checkString(address, 'Address');
        helpers.checkString(zipCode, 'Zip Code');
        helpers.checkString(city, 'City');
        helpers.checkString(state, 'State');
        helpers.checkString(homeType, 'Home Type');

        validator.isInt(rentalCostMin);
        validator.isInt(rentalCostMax);

        if (!address || !city || !state) {
            res.status(400).send('Missing required fields');
            return;
        }

        const housingData = {
            address,
            zipCode,
            city,
            state,
            homeType,
            rentalCost: {
                min: parseInt(rentalCostMin, 10),
                max: parseInt(rentalCostMax, 10)
            },
            amenities: amenities.split(',').map(item => item.trim()),
            petPolicy,
            garage: garage === 'on', 
            images
        };

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

router.post('/update/:id', upload.array('images'), async (req, res) => {
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
        const rentalCostMin = xss(validator.isInt(req.body.rentalCostMin));
        const rentalCostMax = xss(validator.isInt(req.body.rentalCostMax));
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
            amenities: amenities ? amenities.split(',').map(item => item.trim()) : [],
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
