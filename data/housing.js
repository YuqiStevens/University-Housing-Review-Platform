import {housing_collection} from "../config/mongoCollections.js";
import {ObjectId} from "mongodb";
import {getUserById} from "./users.js";
import xss from "xss";
import helpers from "../helpers.js";

const getAllHousings = async () => {
    const housingsCollection = await housing_collection();
    return await housingsCollection.find({}).toArray();
};

const getHousingById = async (id) => {
    const housingCollection = await housing_collection();
    const housing = await housingCollection.findOne({_id: new ObjectId(id)});
    if (!housing) throw "Store not found";
    return housing;
};

const addHousing = async (housing) => {
    const housingData = {
        name: xss(housing.name).trim(),
        address: xss(housing.address).trim(),
        city: xss(housing.city).trim(),
        state: xss(housing.state).trim(),
        zipCode: xss(housing.zipCode).trim(),
        homeType: xss(housing.homeType).trim(),
        amenities: xss(housing.amenities).trim(),
        rentalCostMin: parseInt(housing.rentalCostMin, 10),
        rentalCostMax: parseInt(housing.rentalCostMax, 10),
        studios: parseInt(housing.studios, 10),
        beds1: parseInt(housing.beds1, 10),
        beds2: parseInt(housing.beds2, 10),
        beds3: parseInt(housing.beds3, 10),
        beds4: parseInt(housing.beds4, 10),
        petPolicy: xss(housing.petPolicy).trim(),
        garage: Boolean(housing.garage),
        images: xss(housing.images).trim(),
        location: {
            latitude: parseFloat(housing.location.latitude),
            longitude: parseFloat(housing.location.longitude)
        },
        rating: parseFloat(housing.rating)
    };

    const admin = await getUserById(adminId);
    if (admin.role !== "admin") {
        throw new Error("User does not have authorization to add a housing listing.");
    }

    try {
        helpers.checkIfLocationValid(housingData.location);
        helpers.checkIfHousingNameValid(housingData.name);
    } catch (e) {
        throw e;
    }

    if (await helpers.checkIfHousingNameExists(housingData.name)) {
        throw new Error("Housing name already exists");
    }

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
    let adminId = xss(updatedHousing.adminId).trim();
    const updatedHousingData = {
        name: xss(updatedHousing.name).trim(),
        address: xss(updatedHousing.address).trim(),
        city: xss(updatedHousing.city).trim(),
        state: xss(updatedHousing.state).trim(),
        zipCode: xss(updatedHousing.zipCode).trim(),
        homeType: xss(updatedHousing.homeType).trim(),
        amenities: xss(updatedHousing.amenities).trim(),
        rentalCostMin: parseInt(updatedHousing.rentalCostMin, 10),
        rentalCostMax: parseInt(updatedHousing.rentalCostMax, 10),
        studios: parseInt(updatedHousing.studios, 10),
        beds1: parseInt(updatedHousing.beds1, 10),
        beds2: parseInt(updatedHousing.beds2, 10),
        beds3: parseInt(updatedHousing.beds3, 10),
        beds4: parseInt(updatedHousing.beds4, 10),
        petPolicy: xss(updatedHousing.petPolicy).trim(),
        garage: Boolean(updatedHousing.garage),
        images: xss(updatedHousing.images).trim(),
        location: {
            latitude: parseFloat(updatedHousing.location.latitude),
            longitude: parseFloat(updatedHousing.location.longitude)
        },
        rating: parseFloat(updatedHousing.rating)
    };

    const admin = await getUserById(adminId);
    if (admin.role !== "admin") {
        throw new Error("User does not have authorization to update a housing listing.");
    }

    try {
        helpers.checkIfLocationValid(updatedHousingData.location);
        helpers.checkIfHousingNameValid(updatedHousingData.name);
    } catch (e) {
        throw e;
    }

    if (await helpers.checkIfHousingNameExistsForOtherId(updatedHousingData.name, housingId)) {
        throw new Error("Housing name already exists for a different listing");
    }

    const housingsCollection = await housing_collection();
    const updateInfo = await housingsCollection.updateOne(
        {_id: new ObjectId(housingId)},
        {$set: updatedHousingData}
    );

    if (updateInfo.modifiedCount === 0) {
        throw new Error("No housing entry was updated.");
    }

    return housingId;
};

export {
    getAllHousings,
    getHousingById,
    addHousing,
    removeHousing,
    updateHousing
};