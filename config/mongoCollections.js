import {dbConnection} from './mongoConnection.js';

const getCollectionFn = (collection) => {
    let _col = undefined;

    return async () => {
        if (!_col) {
            const db = await dbConnection();
            _col = await db.collection(collection);
        }

        return _col;
    };
};

export const user_collection = getCollectionFn("users");
export const housing_collection = getCollectionFn("housings");
export const review_collection = getCollectionFn("reviews");
export const comment_collection = getCollectionFn("comments");