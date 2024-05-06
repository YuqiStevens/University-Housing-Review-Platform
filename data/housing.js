import { housing_collection } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import { getUserById } from "./users.js";
import xss from "xss";
import helpers from "../helpers.js";
import validation from '../helpers.js';

const getAllHousings = async () => {
    const housingsCollection = await housing_collection();
    return await housingsCollection.find({}).toArray();
};

const getHousingById = async (id) => {
    const housingCollection = await housing_collection();
    const housing = await housingCollection.findOne({_id: new ObjectId(id)});
    if (!housing) throw "Store not found";

    if (typeof housing.amenities === 'string') {
        housing.amenities = [housing.amenities];
    } else if (!Array.isArray(housing.amenities)) {
        housing.amenities = [];
    }

    return housing;
};

const addHousing = async (housing) => {
    let amenities = housing.amenities;
    let images = housing.images;

    if (typeof amenities === 'string') {
        amenities = xss(amenities).split(',').map(item => item.trim());
    }

    if (!Array.isArray(amenities)) {
        amenities = [];
    }

    if (typeof images === 'string') {
        images = xss(images).split(',').map(item => item.trim());
    }

    if (!Array.isArray(images)) {
        images = [];
    }

    const housingData = {
        address: xss(housing.address).trim(),
        city: xss(housing.city).trim(),
        state: xss(housing.state).trim(),
        zipCode: xss(housing.zipCode).trim(),
        homeType: xss(housing.homeType).trim(),
        amenities: amenities,
        rentalCostMin: parseInt(housing.rentalCostMin, 10),
        rentalCostMax: parseInt(housing.rentalCostMax, 10),
        studios: parseInt(housing.studios, 10),
        beds1: parseInt(housing.oneBed, 10),
        beds2: parseInt(housing.towBed, 10),
        beds3: parseInt(housing.threeBed, 10),
        beds4: parseInt(housing.fourBed, 10),
        petPolicy: xss(housing.petPolicy).trim(),
        garage: Boolean(housing.garage),
        images: images,
        location: {
            latitude: parseFloat(housing.location.latitude),
            longitude: parseFloat(housing.location.longitude)
        },
        rating: parseFloat(housing.rating)
    };

    housingData.established_date = new Date().toUTCString();

    const housingsCollection = await housing_collection();
    const newInsertInformation = await housingsCollection.insertOne(housingData);
    const newId = newInsertInformation.insertedId;
    return newId.toString();
};

const removeHousing = async (id) => {
    const housingsCollection = await housing_collection();
    const deletionInfo = await housingsCollection.findOneAndDelete({
        _id: new ObjectId(id),
    });
    if (deletionInfo.deletedCount === 0) {
        throw `Could not delete store with id of ${id}`;
    }
    console.log(deletionInfo);
    return deletionInfo;
};

const updateHousing = async (housingId, updatedHousing) => {
    console.log("Starting updateHousing with housingId:", housingId);
    console.log("Starting updateHousing with updatedHousing:", updatedHousing);

    let amenities = updatedHousing.amenities;
    let images = updatedHousing.images;

    if (typeof amenities === 'string') {
        amenities = xss(amenities).split(',').map(item => item.trim());
        console.log("Processed amenities from string to array:", amenities);
    }

    if (!Array.isArray(amenities)) {
        amenities = [];
        console.log("Defaulted amenities to empty array as it was not an array.");
    }

    if (typeof images === 'string') {
        images = xss(images).split(',').map(item => item.trim());
        console.log("Processed images from string to array:", images);
    }

    if (!Array.isArray(images)) {
        images = [];
        console.log("Defaulted images to empty array as it was not an array.");
    }

    const updatedHousingData = {
        address: xss(updatedHousing.address).trim(),
        city: xss(updatedHousing.city).trim(),
        state: xss(updatedHousing.state).trim(),
        zipCode: xss(updatedHousing.zipCode).trim(),
        homeType: xss(updatedHousing.homeType).trim(),
        amenities: amenities,
        rentalCostMin: parseInt(updatedHousing.rentalCostMin, 10) || 0,
        rentalCostMax: parseInt(updatedHousing.rentalCostMax, 10) || 0,
        studios: parseInt(updatedHousing.studios, 10) || 0,
        beds1: parseInt(updatedHousing.oneBed, 10) || 0,
        beds2: parseInt(updatedHousing.twoBed, 10) || 0,
        beds3: parseInt(updatedHousing.threeBed, 10) || 0,
        beds4: parseInt(updatedHousing.fourBed, 10) || 0,
        petPolicy: xss(updatedHousing.petPolicy).trim(),
        garage: Boolean(updatedHousing.garage),
        images: images,
        location: {
            latitude: parseFloat(updatedHousing.location.latitude) || 0.0,
            longitude: parseFloat(updatedHousing.location.longitude) || 0.0
        },
        rating: parseFloat(updatedHousing.rating) || 0.0
    };

    console.log("Prepared updated housing data:", updatedHousingData);

    try {
        helpers.checkIfLocationValid(updatedHousingData.location);
        helpers.checkIfHousingNameValid(updatedHousingData.name);
    } catch (e) {
        console.error("Validation error:", e.message);
        throw e;
    }

    const housingsCollection = await housing_collection();
    const updateInfo = await housingsCollection.updateOne(
        {_id: new ObjectId(housingId)},
        {$set: updatedHousingData}
    );

    console.log("MongoDB updateOne response:", updateInfo);

    if (updateInfo.modifiedCount === 0) {
        throw new Error("No housing entry was updated.");
    }

    return housingId;
};

const addReviewIdToHousing = async (housingId, reviewId) => {
    housingId = validation.checkId(housingId, 'housing_id');
    reviewId = validation.checkId(reviewId, 'review_id');

    const housingCollection = await housing_collection();

    const updateResult = await housingCollection.updateOne(
        { _id: new ObjectId(housingId) },
        { $addToSet: { reviewIds: new ObjectId(reviewId) } }
    );

    if (updateResult.matchedCount === 0) {
        throw new Error('No housing found with the provided ID.');
    }
    if (updateResult.modifiedCount === 0) {
        throw new Error('Review ID already exists in the housing document or update failed.');
    }

    return updateResult;
};

const removeReviewIdFromHousing = async (housingId, reviewId) => {
    housingId = validation.checkId(housingId, 'housing_id');
    reviewId = validation.checkId(reviewId, 'review_id');

    const housingCollection = await housing_collection();

    const updateResult = await housingCollection.updateOne(
        { _id: new ObjectId(housingId) },
        { $pull: { reviewIds: new ObjectId(reviewId) } }
    );

    if (updateResult.matchedCount === 0) {
        throw new Error('No housing found with the provided ID.');
    }
    if (updateResult.modifiedCount === 0) {
        throw new Error('Failed to remove the review ID from the housing document.');
    }

    return updateResult;
};

export {
    getAllHousings,
    getHousingById,
    addHousing,
    removeHousing,
    updateHousing,
    addReviewIdToHousing,
    removeReviewIdFromHousing
};
