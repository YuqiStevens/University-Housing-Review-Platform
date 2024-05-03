import { housings } from "../config/mongoCollections.js"
import helpers from "../helpers.js";

export async function getHousingSearchResults(searchTerm) {
    searchTerm = helpers.checkSearchValid(searchTerm);

    const housingsCollection = await housings();

    const matchedHousings = await housingsCollection
        .find({ name: { $regex: searchTerm, $options: 'i' } })
        .limit(20)
        .toArray();

    const formattedHousings = matchedHousings.map(housing => ({
        name: housing.name,
        housingID: housing._id,
        photo_id: housing.photo_id,
        isHousing: true
    }));

    return formattedHousings;
}





