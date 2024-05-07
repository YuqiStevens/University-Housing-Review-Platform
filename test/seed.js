import { addComment, addCommentToReview } from "../data/commentsForReviews.js";
import { addHousing, addReviewIdToHousing } from "../data/housing.js";
import { updateAverageRating} from "../data/reviewsForHousing.js";
import { ObjectId } from "mongodb";
import { addUser } from "../data/users.js";

//--------------------admin1 and user1-----------------------
let user1_user = await addUser(
    'Xiong',
    'Chen',
    'user1@user.com',
    'Cx123456.',
    'user',
    'Hoboken',
    'NJ',
    'US',
    '27',
    'Master',
    'CS'
  );

  let user1_admin = await addUser(
    'Xiong',
    'Chen',
    'user1@admin.com',
    'Cx123456.',
    'admin',
    'Hoboken',
    'NJ',
    'US',
    '27',
    'Master',
    'CS'
  );

let user1_id_user= user1_user.user_id;
let user1_id_admin= user1_admin.user_id;

  let housingInput1 = {
    address: "770 Jackson St",
    city: "Hoboken",
    state: "NJ",
    zipCode: "07030",
    homeType: "Apartment",
    amenities: "Pool, Gym",
    images: "https://s3-media0.fl.yelpcdn.com/bphoto/WmAyPmCrbkhQFfhlZgDyeQ/348s.jpg",
    rentalCostMin: "500",
    rentalCostMax: "1500",
    studios: "1",
    oneBed: "2",
    towBed: "3",
    threeBed: "4",
    fourBed: "5",
    petPolicy: "Allowed",
    garage: "true",
    location: {
        latitude: "40.74704427274941",
        longitude: "-74.03893280341003"
    },
    rating: "4"
};

let housingId1 = await addHousing(housingInput1);

let review1 = {
    houseId: housingId1,
    userId: user1_id_user,
    rating: 4,
    title: 'Great place',
    body: 'Really enjoyed our stay.',
    images: ['https://s3-media0.fl.yelpcdn.com/bphoto/hnJ67xDRl8goDD5is99G_w/o.jpg'],
    helpfulCounts: 0,
    comments: []
};

await addReviewIdToHousing(housingId1, review1._id.toString());
await updateAverageRating(housingId1);

let housingInput2 = {
    address: "600 Jackson St",
    city: "Hoboken",
    state: "NJ",
    zipCode: "07030",
    homeType: "Apartment",
    amenities: "Infinity Pool, Ocean View Terrace",
    images: "https://s3-media0.fl.yelpcdn.com/bphoto/E53vaJMIjOBKXyPOdQK59Q/o.jpg",
    rentalCostMin: "1000",
    rentalCostMax: "10000",
    studios: "10",
    oneBed: "20",
    towBed: "20",
    threeBed: "15",
    fourBed: "10",
    petPolicy: "Allowed",
    garage: "true",
    location: {
        latitude: "40.74622067597064",
        longitude: "-74.03943864570967"
    },
    rating: "4"
};

let housingId2 = await addHousing(housingInput2);

let review2 = {
    houseId: housingId2,
    userId: user1_id_admin,
    rating: 5,
    title: 'Paradise Found',
    body: 'The views from this home are simply breathtaking. Can\'t wait to come back!',
    images: ['https://s3-media0.fl.yelpcdn.com/bphoto/MQ8Ya6Th4q32YZsD6p23pQ/o.jpg'],
    helpfulCounts: 0,
    comments: []
};

await addReviewIdToHousing(housingId2, review2._id.toString());
await updateAverageRating(housingId2);

let newComment1 = {
    reviewId: new ObjectId(review1._id.toString()),
    userId: new ObjectId(user1_id_user),
    firstName: user1_user.firstName,
    lastName: user1_user.lastName,
    comment: "Really good place!!!",
    createdAt: new Date()
};

newComment1 = await addComment(newComment1);
await addCommentToReview(review1._id.toString(), newComment1);

let newComment2 = {
    reviewId: new ObjectId(review2._id.toString()),
    userId: new ObjectId(user1_id_admin),
    firstName: user1_admin.firstName,
    lastName: user1_admin.lastName,
    comment: "Really fantastic place!!!",
    createdAt: new Date()
};

newComment2 = await addComment(newComment2);
await addCommentToReview(review2._id.toString(), newComment2);

//--------------------admin2 and user2-----------------------

let user2_user = await addUser(
    'Yuqi',
    'Dong',
    'user2@user.com',
    'Ydongdong28@',
    'user',
    'Jersey City',
    'NJ',
    'US',
    '22',
    'Master',
    'Computer Science'
);

let user2_admin = await addUser(
    'Yuqi',
    'Dong',
    'user2@admin.com',
    'Ydongdong28@',
    'admin',
    'Jersey City',
    'NJ',
    'US',
    '22',
    'Master',
    'Computer Science'
);

let user2_id_user= user2_user.user_id;
let user2_id_admin= user2_admin.user_id;

let housingInput3 = {
    address: "270 Tenth St",
    city: "Jersey City",
    state: "NJ",
    zipCode: "07302",
    homeType: "Apartment",
    amenities: "Gym",
    images: "https://s3-media0.fl.yelpcdn.com/bphoto/cILKlysZaGvA4UGgpVqsRQ/o.jpg",
    rentalCostMin: "1000",
    rentalCostMax: "5000",
    studios: "2",
    oneBed: "4",
    towBed: "6",
    threeBed: "8",
    fourBed: "10",
    petPolicy: "Allowed",
    garage: "true",
    location: {
        latitude: "40.72962951134248",
        longitude: "-74.04558213013271"
    },
    rating: "2"
};

let housingId3 = await addHousing(housingInput3);

let review3 = {
    houseId: housingId3,
    userId: user2_id_user,
    rating: 3,
    title: 'Fair place but really expensive',
    body: 'Not bad, enough quite to live',
    images: ['https://s3-media0.fl.yelpcdn.com/bphoto/r4YqKCNI70O0NyVjqY2zJA/o.jpg'],
    helpfulCounts: 0,
    comments: []
};

await addReviewIdToHousing(housingId3, review3._id.toString());
await updateAverageRating(housingId3);

let housingInput4 = {
    address: "180 River Dr",
    city: "Jersey City",
    state: "NJ",
    zipCode: "07310",
    homeType: "House",
    amenities: "Ocean View Terrace",
    images: "https://s3-media0.fl.yelpcdn.com/bphoto/ckuiBGVWs83WDiOhmvz8qQ/o.jpg",
    rentalCostMin: "1000",
    rentalCostMax: "5000",
    studios: "20",
    oneBed: "14",
    towBed: "16",
    threeBed: "18",
    fourBed: "10",
    petPolicy: "Allowed",
    garage: "true",
    location: {
        latitude: "40.732446643641055",
        longitude: "-74.0314129085959"
    },
    rating: "5"
};

let housingId4 = await addHousing(housingInput4);

let review4 = {
    houseId: housingId4,
    userId: user2_id_admin,
    rating: 5,
    title: 'Fantastic Apartment Near Hudson River',
    body: 'The views from this home are simply breathtaking. Can\'t wait to come back!',
    images: ['https://s3-media0.fl.yelpcdn.com/bphoto/CtoimFAR-Qsv0HH0VE5qAg/o.jpg'],
    helpfulCounts: 0,
    comments: []
};

await addReviewIdToHousing(housingId4, review4._id.toString());
await updateAverageRating(housingId4);

let newComment3 = {
    reviewId: new ObjectId(review3._id.toString()),
    userId: new ObjectId(user2_id_user),
    firstName: user1_user.firstName,
    lastName: user1_user.lastName,
    comment: "Really good place!!!",
    createdAt: new Date()
};

newComment3 = await addComment(newComment3);
await addCommentToReview(review3._id.toString(), newComment3);

let newComment4 = {
    reviewId: new ObjectId(review4._id.toString()),
    userId: new ObjectId(user2_id_admin),
    firstName: user1_admin.firstName,
    lastName: user1_admin.lastName,
    comment: "Really fantastic place!!!",
    createdAt: new Date()
};

newComment4 = await addComment(newComment4);
await addCommentToReview(review4._id.toString(), newComment4);