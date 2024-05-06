import { addComment, addCommentToReview } from "../data/commentsForReviews";
import { addHousing } from "../data/housing";
import { addUser } from "../data/users";



//--------------------admin1-----------------------
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
    rentalCostMin: "5000",
    rentalCostMax: "10000",
    bedrooms: "5",
    bathrooms: "4",
    petPolicy: "Allowed with deposit",
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