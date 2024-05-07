# Project Proposal: University Housing Review Platform

1. [How the Website Initiates](#how-the-website-initiates)
    - [Accessing the Website](#accessing-the-website)
2. [How the Website Works](#how-the-website-works)
    - [Register, Login, and Logout](#register-login-and-logout)
    - [Profile Management](#profile-management)
    - [Review and Comment System](#review-and-comment-system)
    - [Housing Management (Admins Only)](#housing-management-admins-only)
    - [Navigation and Search](#navigation-and-search)
    - [Error Handling](#error-handling)
3. [How Search Works](#how-search-works)
4. [Core Features](#core-features)
    - [Landing Page](#landing-page)
    - [Housing Listings Page](#housing-listings-page)
    - [Individual Housing Page](#individual-housing-page)
    - [User Profile](#user-profile)
    - [Review Append Feature](#review-append-feature)
    - [Comments Section](#comments-section)
    - [Interactive Map with Mapbox](#interactive-map-with-mapbox)
    - [Admin Account for Content Moderation](#admin-account-for-content-moderation)
5. [Extra Features](#extra-features)
    - [Photo Inclusion in Reviews](#photo-inclusion-in-reviews)
    - ["Helpful" Button Feature](#"helpful"-button-feature)
6. [Database Design](#database-design)
    - [Users Collection](#users-collection)
    - [Housings Collection](#housings-collection)
    - [Reviews Collection](#reviews-collection)
    - [Comments Collection](#comments-collection)
7. [Data We Seed in Project](#data-we-seed-in-project)
    - [Overview of Seeded Data](#overview-of-seeded-data)
    - [Specifics of Seeded Entries](#specifics-of-seeded-entries)
    - [Commands to Run the Seed Script](#commands-to-run-the-seed-script)

## Team Members

- Yuqi Dong
- Fan Zhang
- Xiong Chen
- Zhuo Zhang
- Chongyuan Zhang

## Introduction

Navigating the complexities of university life, especially for international students, underscores the critical importance of finding suitable housing. The challenge of securing a comfortable living space near the university is compounded by a lack of accessible and reliable information. Our initiative aims to address these issues by creating a specialized platform for reviewing apartments and houses around the university, designed with the unique needs of new international students in mind. This vital resource will provide in-depth insights and real-life experiences from peers, significantly easing the housing search process.


## How the Website Initiates

Follow these steps to get the project up and running on your local machine:

1. **Install Required Libraries**:
    - Run `npm install` in the terminal at the project's root directory. This command installs all the dependencies listed in the `package.json` file necessary for the project to run.

2. **Populate the Database**:
    - Execute `node test/seed.js` to populate your database with initial data. This script sets up the database with predefined values, including user profiles, housing listings, and other necessary data for testing and development.

3. **Start the Website**:
    - Launch the application by running `node app.js`. This starts the server, and you should see a message indicating that the server is running and listening on a specific port (typically `http://localhost:3000`).

### Accessing the Website
- After starting the server, open a web browser and navigate to `http://localhost:3000` or the relevant URL configured for your project. You should now be able to interact with the fully functional website.

## How the Website Works

Follow these steps to effectively use the features of our project:

1. **Register and Login and Logout**:
    - **Register:** Create an account by providing necessary details on the registration page.
    - **Login:** Access your account by entering your credentials on the login page.
    - **Logout:** Securely log out of your account from any page.

2. **Profile Management**:
    - **Check User Information:** View and verify your personal details on your profile page.
    - **Change User Information:** Update personal information such as name, email, and contact details on your profile page.
    - **Change User Password:** Update your password securely through the change password page.

3. **Review and Comment System**:
    - **Check All Reviews Created by the User:** Access all reviews you've created directly on your profile page.
    - **Add Review:** (One User only Once) Provide feedback by adding reviews on individual housing pages.
    - **Edit Review:** Modify your existing reviews through each housing's page (limited to reviews you've created).
    - **Delete Review:** (Admins only) Remove user reviews as needed on each housing's page.
    - **Add Comment:** (One User only Once) Engage with other users by adding comments to their reviews on housing pages.
    - **Delete Comment:** (Admins only) Remove comments from reviews as necessary on each housing's page.

4. **Housing Management (Admins Only)**:
    - **Add Housing:** Post new housing listings from the home page dashboard.
    - **Edit Housing:** Update details of existing housing listings on each specific housing's page.

5. **Navigation and Search**:
    - **Search for Housing:** Quickly find specific housing using the search feature on the home page.
    - **Browse All Housing:** Explore all available housing listings on the listing page to see full details and reviews.

6. **Error Handling**:
    - **Detailed Error Page:** In case of any errors, a detailed error page will display relevant information to help troubleshoot issues.

## How Search Works

Following the professor's feedback, the search functionality on our platform will be comprehensive and user-friendly, supporting various search options to accommodate diverse needs:

1. **Search by Zip or Location**: Users can initiate searches using specific zip codes or broader locations like "Hoboken, NJ" or "Jersey City, NJ".
2. **Filters**: To further refine search results, users can apply filters such as Price, Beds/Baths, Home Type (Apartments/Townhomes), Pet Policy, Garage, and Rating. These filters aim to help users narrow down options to find housing that best fits their preferences and requirements.

## Core Features

### 1. Landing Page
   - Clearly articulates the project's goals and highlights its value to new international students.
   - Incorporates a search function for quickly locating housing reviews or applying specific filters to narrow down options.

### 2. Housing Listings Page
   - Presents search outcomes, linking to individual housing pages that include comprehensive details and an overall rating.
   - Provides a user-friendly platform for exploring different housing opportunities.

### 3. Individual Housing Page
   - Offers detailed information on housing features, including amenities, rental costs, and location relative to the university.
   - Features student-written reviews, complete with ratings, commentary, and the option for photo uploads. Reviewers can update their reviews to reflect ongoing experiences or changes in opinion.

### 4. User Profile
   - Enables profile creation upon user registration, enhancing the platform's community feel and reliability.
   - Shows users' review histories, with functionalities for editing or deleting their contributions.

### 5. Review Append Feature
   - Allows users to add updates to their reviews, accommodating changing views or additional experiences concerning the housing.

### 6. Comments Section
   - Introduces a dedicated area for discussions under each review, open to all users. This feature is intended to stimulate community engagement, offering further insights and varying viewpoints.

### 7. Interactive Map with Mapbox
   - Utilizes Mapbox to show housing options on a map, offering users a visual representation of each location's proximity to the university and other significant landmarks. Mapbox is preferred due to its free tier for up to 25,000 mobile users and 50,000 web loads, along with its ease of customization for maps.

### 8. Admin Account for Content Moderation
   - Assigns platform oversight to administrators tasked with moderating content to maintain a respectful and constructive community atmosphere.

## Extra Features

### 1. Photo Inclusion in Reviews
   - Permits the uploading of images with reviews, providing visual evidence and enhancing the authenticity of the housing descriptions.

### 2. "Helpful" Button Feature
   - Incorporates a "helpful" button beneath each review, depicted as a greyed-out thumbs-up icon. Clicking this button signifies that the user found the review useful. The total count of "helpful" clicks and the usernames of those who found the review helpful will be displayed, fostering an interactive and supportive review environment.

## Database Design

Our platform leverages a MongoDB database structured into several collections to manage data efficiently and effectively. Below is an overview of each collection and its schema:

### Users Collection

**Purpose:** Manages user account information and credentials.

**Fields:**
- `userId`: Unique identifier (ObjectId).
- `email`: User's email address, serves as the login identifier.
- `hashPassword`: Securely hashed password.
- `firstName`: User's first name.
- `lastName`: User's last name.
- `role`: Designates user as 'admin' or 'user'.
- `city`, `state`, `country`: Location details.
- `age`: User's age.
- `diploma`: Highest educational qualification.
- `discipline`: Field of study or professional field.
- `reviewIds`: Array of review identifiers (ObjectId) authored by the user.
- `createdAt`, `updatedAt`: Timestamps for account creation and last update.

### Housings Collection

**Purpose:** Stores details about housing listings available on the platform.

**Fields:**
- `housingId`: Unique identifier (ObjectId).
- `address`, `zipCode`, `city`, `state`: Address details.
- `homeType`: Type of housing (e.g., Apartment, Townhome).
- `amenities`: List of available amenities.
- `rentalCostMin`, `rentalCostMax`: Range for monthly rental cost.
- `studios`, `1beds`, `2beds`, `3beds`, `4beds`: Unit availability by type.
- `petPolicy`: Indicates if pets are allowed.
- `garage`: Indicates availability of a garage.
- `images`: URLs to images of the housing.
- `location`: Contains `latitude` and `longitude` for mapping.
- `reviewIds`: Links to reviews for the housing.
- `rating`: Calculated average rating based on reviews.

### Reviews Collection

**Purpose:** Contains user-submitted reviews for various housings.

**Fields:**
- `reviewId`: Unique identifier (ObjectId).
- `housingId`: Associated housing (ObjectId).
- `userId`: Review author (ObjectId).
- `rating`: Numerical rating given to the housing.
- `title`, `body`: Text content of the review.
- `images`: URLs to images included in the review.
- `helpfulCounts`: Number of times the review was marked helpful.
- `comments`: Array of comments on the review.
- `createdAt`, `updatedAt`: Creation and last update timestamps.

### Comments Collection

**Purpose:** Manages comments posted on reviews.

**Fields:**
- `commentId`: Unique identifier (ObjectId).
- `reviewId`: Associated review (ObjectId).
- `userId`: Comment author (ObjectId).
- `comment`: Text content of the comment.
- `createdAt`: Timestamp when the comment was posted.

## Data We Seed in Project

The `seed.js` script is designed to populate our database with initial data that facilitates the development and testing of the University Housing Review Platform. It sets up a variety of users, housing options, reviews, and comments to demonstrate the platform's functionality and to provide a rich user experience from the outset.

### Overview of Seeded Data

- **Users**: The script creates several user profiles, including both regular users and administrators. These profiles are used to simulate real-world interaction with the platform, allowing for testing of user-specific functionalities such as posting reviews, editing housing information, and more.

- **Housings**: Multiple housing entries are added to represent different types of accommodations available near the university. Each entry includes details such as address, home type, amenities, rental costs, and more.

- **Reviews**: For each housing entry, the script adds reviews that reflect various user experiences and ratings. These reviews help in demonstrating the review system and the aggregate rating functionality.

- **Comments**: Comments on reviews are also added, showing the community interaction within the platform and testing the nested commenting feature.

### Specifics of Seeded Entries

- **Admin and User Accounts**: For testing different levels of access, both admin and regular user accounts are set up. Admin accounts can edit or delete any listings or reviews, while regular users have limited permissions.

- **Housing Listings**: Each listing is detailed with attributes like location, amenities, and pricing, making the platform ready for demonstration right after the initial setup.

- **Interactive Reviews and Comments**: Reviews include user-generated content such as text descriptions and images, as well as interactive elements like helpful votes. Comments added to reviews foster an interactive community environment.

### Commands to Run the Seed Script

To initiate the seeding process and start using the pre-configured data, run the following command in the root directory of the project:

```bash
node test/seed.js
```

This will execute the seed script, which populates the database with the initial data, setting up the environment for immediate use.

## GitHub Repo

https://github.com/YuqiStevens/University-Housing-Review-Platform