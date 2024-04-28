# DB Proposal: University Housing Review Platform

## Team Members

- Yuqi Dong
- Fan Zhang
- Xiong Chen
- Zhuo Zhang
- Chongyuan Zhang

## Users Collection

**Description:** Stores information about registered users on the platform.

**Details:**

| Name          | Type      | Description                                        |
|---------------|-----------|----------------------------------------------------|
| userId        | ObjectId  | Unique identifier for each user.                   |
| email         | String    | The user's email address, used as the account identifier. |
| passwordHash  | String    | A hashed version of the user's password for security. |
| firstName     | String    | The user's first name.                             |
| lastName      | String    | The user's last name.                              |
| city          | String    | The city the user resides in.                      |
| state         | String    | The state the user resides in.                     |
| country       | String    | The country the user resides in.                   |
| age           | Number    | The user's age.                                    |
| diploma       | String    | The highest diploma the user has achieved.         |
| discipline    | String    | The field of study or discipline.                  |
| reviewIds     | [ObjectId]| An array of ObjectIds linking to the reviews written by the user. |
| createdAt     | Date      | Timestamp of account creation.                     |
| updatedAt     | Date      | Timestamp of the last update to the profile.       |

**Example:**

```json
{
  "userId": "5f8d3fse4b8d3c7e9f72d3e8",
  "email": "janedoe@example.com",
  "passwordHash": "$2b$10$examplehashValueHere",
  "firstName": "Jane",
  "lastName": "Doe",
  "city": "Hoboken",
  "state": "NJ",
  "country": "USA",
  "age": 22,
  "diploma": "Bachelor",
  "discipline": "Business Administration",
  "reviewIds": ["5f8d3fae4b8d3c7e9f72d3f9", "5f8d3fb14b8d3c7e9f72d400"],
  "createdAt": "2023-09-01T12:00:00Z",
  "updatedAt": "2023-10-01T12:00:00Z"
}
```

## Listings Collection

**Description:** Stores information about the housing on the platform.

**Details:**

| Name       | Type        | Description                                 |
|------------|-------------|---------------------------------------------|
| listingId  | ObjectId    | Unique identifier for each listing.         |
| address    | String      | The address of the housing option.          |
| zipCode    | String      | Zip code for the location.                  |
| city       | String      | City where the housing is located.          |
| state      | String      | State where the housing is located.         |
| homeType   | String      | Type of home (apartment, townhome, etc.).   |
| amenities  | [String]    | List of amenities offered.                  |
| rentalCost | Number      | Monthly rental cost.                        |
| beds       | Number      | Number of bedrooms.                         |
| baths      | Number      | Number of bathrooms.                        |
| petPolicy  | String      | Information on pet policies.                |
| garage     | Boolean     | Indicates if a garage is available.         |
| images     | [String]    | URLs to images of the housing.              |
| location   | Object      | Contains latitude and longitude for map representation. |
| reviewIds  | [ObjectId]  | An array of ObjectIds linking to reviews of the listing. |
| rating     | Number      | Overall rating based on user reviews.       |

**Example:**

```json
{
  "listingId": "5fc92b2e8b3d48bcbf889c23",
  "address": "123 University Ave",
  "zipCode": "07030",
  "city": "Hoboken",
  "state": "NJ",
  "homeType": "Apartment",
  "amenities": ["Pool", "Gym", "Pet Friendly"],
  "rentalCost": 2000,
  "beds": 2,
  "baths": 1.5,
  "petPolicy": "Pets allowed",
  "garage": true,
  "images": ["http://example.com/image1.jpg", "http://example.com/image2.jpg"],
  "location": {
    "latitude": 40.743991,
    "longitude": -74.032363
  },
  "reviewIds": ["5fd12c2c9b3d48bcbf889d67", "5fd12c2d9b3d48bcbf889d68"],
  "rating": 4.5
}
```

## Reviews Collection

**Description:** Holds reviews written by users for different listings

**Details:**

| Name          | Type       | Description                                       |
|---------------|------------|---------------------------------------------------|
| reviewId      | ObjectId   | Unique identifier for the review.                 |
| listingId     | ObjectId   | ObjectId of the listing being reviewed.           |
| userId        | ObjectId   | ObjectId of the user who wrote the review.        |
| rating        | Number     | The rating given by the user.                     |
| title         | String     | The title of the review.                          |
| body          | String     | The main content of the review.                   |
| images        | [String]   | URLs to images included in the review.            |
| helpfulCounts | Number     | Number of times the review was marked as helpful. |
| comments      | [Object]   | Array of comments on the review.                  |
| createdAt     | Date       | Timestamp when the review was created.            |
| updatedAt     | Date       | Timestamp for the last update made to the review. |

**Example:**

```json
{
  "reviewId": "5fd12c2c9b3d48bcbf889d67",
  "listingId": "5fc92b2e8b3d48bcbf889c23",
  "userId": "5f8d3fse4b8d3c7e9f72d3e8",
  "rating": 5,
  "title": "Great Place to Live!",
  "body": "I've lived here for a year and absolutely love it. The amenities are fantastic, and it's so close to the university. Highly recommend to anyone looking for a place in Hoboken.",
  "images": ["http://example.com/reviewImage1.jpg"],
  "helpfulCounts": 15,
  "comments": [
    {
      "userId": "5f8d3fae4b8d3c7e9f72d3f9",
      "comment": "Thanks for sharing your experience! I'm considering moving here.",
      "createdAt": "2023-12-10T15:00:00Z"
    },
    {
      "userId": "5f8d3fb14b8d3c7e9f72d400",
      "comment": "Did you find the pet policy to be as accommodating as advertised?",
      "createdAt": "2023-12-11T12:34:56Z"
    }
  ],
  "createdAt": "2023-11-15T12:00:00Z",
  "updatedAt": "2023-11-20T12:00:00Z"
}
```

## Comments Collection

**Description:** Holds comments written by users for different reviews

**Details:**

| Name       | Type      | Description                                       |
|------------|-----------|---------------------------------------------------|
| commentId  | ObjectId  | Unique identifier for the comment.                |
| reviewId   | ObjectId  | The review the comment is associated with.        |
| userId     | ObjectId  | The user who posted the comment.                  |
| comment    | String    | The text of the comment.                          |
| createdAt  | Date      | Timestamp when the comment was made.              |

**Example:**

```json
{
  "commentId": "5fa123b3c88f1e221f6a8b54",
  "reviewId": "5f8d3fb14b8d3c7e9f72d400",
  "userId": "5f8d3fse4b8d3c7e9f72d3e8",
  "comment": "I totally agree with this review! Thanks for sharing your experience.",
  "createdAt": "2023-11-05T15:00:00Z"
}
```