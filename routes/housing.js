import express from 'express';
import { ObjectId } from 'mongodb';
import { addHousing, getHousingById, updateHousing, getAllHousings } from '../data/housing.js';
import helpers from '../helpers.js';
import validator from 'validator';
import xss from 'xss';
import { getAllReviewsByHouseId } from '../data/reviewsForHousing.js';

const router = express.Router();


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

        const address = xss(req.body.address);
        const zipCode = xss(req.body.zipCode);
        const city = xss(req.body.city);
        const state = xss(req.body.state);
        const homeType = xss(req.body.homeType);

        const rentalCostMin = xss(req.body.rentalCostMin);
        const rentalCostMax = xss(req.body.rentalCostMax);

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

        const imagesInput = xss(req.body.images);
        const images = imagesInput ? imagesInput.split(',').map(url => url.trim()) : [];

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
        const currentUserId = req.session.user ? req.session.user.id : null;

        let reviews;
        reviews = await getAllReviewsByHouseId(housingId); 

        const cleanAddress = xss(housing.address);

        const processedReviews = reviews.map(review => {
            const reviewUserId = review.userId ? review.userId.toString() : null;
            const processedComments = review.comments.map(comment => {
                return {
                   ...comment,
                    isAdmin: req.session.user.role === 'admin',
                };
            })
            return {
                ...review,
                comments: processedComments,
                isAdmin: req.session.user.role === 'admin',
                canEdit: reviewUserId === currentUserId
            };
        });

        res.render('housing', {
            title: `Details of ${cleanAddress}`,
            housing: housing,
            reviews: processedReviews,
            currentUserId: currentUserId,
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
        console.log('req.body', req.body);
        if (!req.session.user || req.session.user.role !== 'admin') {
            res.status(403).render('error', { title: "Forbidden", error: "You are not authorized to edit housing" });
            return;
        }

        const housingId = req.params.id;
        if (!ObjectId.isValid(housingId)) {
            return res.status(400).send('Invalid Housing ID');
        }

        const oldHousing = await getHousingById(housingId);

        const address = req.body.address ? xss(req.body.address) : oldHousing.address;
        const zipCode = req.body.zipCode ? xss(req.body.zipCode) : oldHousing.zipCode;
        const city = req.body.city ? xss(req.body.city) : oldHousing.city;
        const state = req.body.state ? xss(req.body.state) : oldHousing.state;
        const homeType = req.body.homeType ? xss(req.body.homeType) : oldHousing.homeType;

        const rentalCostMin = req.body.rentalCostMin ? parseInt(xss(req.body.rentalCostMin), 10) : oldHousing.rentalCostMin;
        const rentalCostMax = req.body.rentalCostMax ? parseInt(xss(req.body.rentalCostMax), 10) : oldHousing.rentalCostMax;

        const studios = req.body.studios ? parseInt(xss(req.body.studios), 10) : oldHousing.studios;
        const oneBed = req.body['1beds'] ? parseInt(xss(req.body['1beds']), 10) : oldHousing.oneBed;
        const twoBed = req.body['2beds'] ? parseInt(xss(req.body['2beds']), 10) : oldHousing.twoBed;
        const threeBed = req.body['3beds'] ? parseInt(xss(req.body['3beds']), 10) : oldHousing.threeBed;
        const fourBed = req.body['4beds'] ? parseInt(xss(req.body['4beds']), 10) : oldHousing.fourBed;

        const amenities = req.body.amenities ? xss(req.body.amenities).split(',').map(item => item.trim()) : oldHousing.amenities;
        const petPolicy = req.body.petPolicy ? xss(req.body.petPolicy) : oldHousing.petPolicy;
        const garage = req.body.garage !== undefined ? xss(req.body.garage) === 'on' : oldHousing.garage;
        const latitude = req.body.latitude ? parseFloat(xss(req.body.latitude)) : oldHousing.location.latitude;
        const longitude = req.body.longitude ? parseFloat(xss(req.body.longitude)) : oldHousing.location.longitude;

        const images = req.body.images ? xss(req.body.images).split(',').map(url => url.trim()) : oldHousing.images;

        const updateData = {
            address,
            zipCode,
            city,
            state,
            homeType,
            rentalCostMin,
            rentalCostMax,
            studios,
            oneBed,
            twoBed,
            threeBed,
            fourBed,
            amenities,
            petPolicy,
            garage,
            location: {
                latitude,
                longitude
            },
            images
        };

        await updateHousing(housingId, updateData);
        res.redirect(`/housing/${housingId}`);
    } catch (error) {
        console.error('Failed to update housing:', error);
        res.status(500).send('Internal Server Error');
    }
});

export default router;
