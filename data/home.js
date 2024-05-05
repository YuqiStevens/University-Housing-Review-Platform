import { housing_collection } from "../config/mongoCollections.js";
import helpers from "../helpers.js";

export async function getHousingSearchResults(searchTerm, filters = {}) {
    searchTerm = helpers.checkSearchValid(searchTerm);
    const housingsCollection = await housing_collection();

    // Build the query based on searchTerm and filters
    const query = {};

    // 使用正则表达式构建通用的搜索条件，匹配多个字段
    const regex = new RegExp(searchTerm, 'i');
    query.$or = [
        { address: regex },
        { city: regex },
        { state: regex },
        { zipCode: regex },
        { amenities: regex }
    ];

    // 将其他过滤条件添加到查询中
    if (filters.homeType) {
        query.homeType = filters.homeType;
    }
    if (filters.rentalCostMin !== undefined || filters.rentalCostMax !== undefined) {
        query.rentalCost = {};
        if (filters.rentalCostMin !== undefined) {
            query.rentalCost.$gte = filters.rentalCostMin;
        }
        if (filters.rentalCostMax !== undefined) {
            query.rentalCost.$lte = filters.rentalCostMax;
        }
    }
    if (filters.garage !== undefined) {
        query.garage = filters.garage;
    }
    if (filters.petPolicy) {
        // 确保查询条件与数据库中的数据一致，这里直接使用传入的宠物政策作为查询条件
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
