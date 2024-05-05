import { housing_collection } from "../config/mongoCollections.js";
import helpers from "../helpers.js";

export async function getHousingSearchResults(searchTerm, filters) {
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
            { homeType: regex },
            { amenities: regex }
        ],
        ...filters
    };

    const matchedHousings = await housingsCollection
        .find(query)
        .limit(20)
        .toArray();

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
        amenities: housing.amenities,
        photo_id: housing.photo_id || '',
        isHousing: true
    }));

    return formattedHousings;
}






