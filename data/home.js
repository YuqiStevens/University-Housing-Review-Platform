import { housing_collection } from "../config/mongoCollections.js";
import helpers from "../helpers.js";

export async function getHousingSearchResults(searchTerm, filters = {}) {
    searchTerm = helpers.checkSearchValid(searchTerm);

    const housingsCollection = await housing_collection();
    const regex = new RegExp(searchTerm, 'i');

    // Build the query based on searchTerm and filters
    const query = {
        $or: [
            { address: regex },
            { city: regex },
            { state: regex },
            { zipCode: regex },
            { amenities: regex }
        ]
    };

    if (filters.homeType) {
        query.homeType = filters.homeType;
    }
    if (filters.rentalCostMin !== undefined) {
        query.rentalCostMin = { $gte: filters.rentalCostMin };
    }
    if (filters.rentalCostMax !== undefined) {
        query.rentalCostMax = { ...query.rentalCostMin, $lte: filters.rentalCostMax };
    }
    if (filters.garage !== undefined) {
        query.garage = filters.garage;
    }
    if (filters.petPolicy) {
        query.petPolicy = filters.petPolicy;
    }

    console.log("Query:", query);

    const matchedHousings = await housingsCollection
        .find(query)
        .limit(20)
        .toArray();

    console.log("Matched Housings:", matchedHousings);

    // Format the results
    const formattedHousings = matchedHousings.map(housing => ({
        name: housing.address,
        housingID: housing._id,
        address: housing.address,
        city: housing.city,
        state: housing.state,
        zipCode: housing.zipCode,
        homeType: housing.homeType,
        rentalCostMin: housing.rentalCostMin,
        rentalCostMax: housing.rentalCostMax,
        amenities: Array.isArray(housing.amenities) ? housing.amenities : [housing.amenities],
        photo_id: housing.photo_id || '',
        isHousing: true
    }));

    return formattedHousings;
}
