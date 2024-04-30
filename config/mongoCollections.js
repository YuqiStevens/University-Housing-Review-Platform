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

module.exports = {
  user_collection: getCollectionFn("users"),
  listing_collection:getCollectionFn("housings"),
  review_collection:getCollectionFn("reviews"),
  comment_collection:getCollectionFn("comments")
};