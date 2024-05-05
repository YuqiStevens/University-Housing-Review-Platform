import {user_collection} from "../config/mongoCollections.js";
import {ObjectId} from "mongodb";
import bcrypt from "bcryptjs";
import validator from "validator";
import validation from "../helpers.js"
import helpers from "../helpers.js";
import xss from "xss";

const getUserById = async (id) => {
    if (!id) throw 'You must provide an id to search for';
    if (typeof id !== 'string') throw 'Id must be a string';
    if (id.trim().length === 0) throw 'Id cannot be an empty string or just spaces';
    id = id.trim();
    if (!ObjectId.isValid(id)) throw 'Invalid object ID';
    
    const userCollection = await user_collection();
    const user = await userCollection.findOne({ _id: new ObjectId(id) });
    
    if (!user) throw 'No user with that id';
    return user;
};

const addUser = async (
    firstName,
    lastName,
    email,
    password,
    role,
    city,
    state,
    country,
    age,
    diploma,
    discipline
) => {
    if (!firstName) throw "Please provide your first name";
    if (!lastName) throw "Please provide your last name";
    if (!email) throw "Please provide your email address";
    if (!password) throw "Please provide your password";
    if (!role) throw "Please provide your role";

    var regex = /^[a-zA-Z]+$/;
    firstName = firstName.trim();
    if (!regex.test(firstName)) throw "First name must only contain letters";
    if (firstName.length < 2 || firstName.length > 25) throw "First name should have 2 - 25 characters";

    lastName = lastName.trim();
    if (!regex.test(lastName)) throw "Last name must only contain letters";
    if (lastName.length < 2 || lastName.length > 25) throw "Last name should have 2 - 25 characters";

    email = email.trim().toLowerCase();
    if (!validator.isEmail(email)) throw "Email address should be a valid email address format. example@example.com";
    if (await helpers.checkIfEmailExists(email)) throw "There is already a user with that email address";

    password = password.trim();
    if (!await validation.checkPassword(password, "Password")) throw "Password must have at least 8 characters, with at least 1 uppercase letter, 1 number, and 1 symbol";
    password = await bcrypt.hash(password, 10);

    role = role.trim().toLowerCase();
    if (role !== "admin" && role !== "user") throw "The role should be admin or user";

    let newUser = {
        "firstName": firstName,
        "lastName": lastName,
        "email": email,
        "hashPassword": password,
        "role": role,
        "city": city,
        "state": state,
        "country": country,
        "age": age,
        "diploma": diploma,
        "discipline": discipline,
        "createdAt": new Date(),
        "updatedAt": new Date(),
        "reviewIds": []
    };

    const userCollection = await user_collection();
    const insertInfo = await userCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Could not add user';
    return {
        user_id: insertInfo.insertedId.toString(),
        insertedUser: true
    };
}


const loginUser = async (email, password) => {
    if (!email) throw "Please provide your email address";
    if (!password) throw "Please provide your password";

    email = email.trim().toLowerCase();
    if (!validator.isEmail(email)) throw "Email address should be a valid email address format. example@example.com";

    password = password.trim();
    try {
        password = validation.checkPassword(password, 'password');
    } catch (e) {
        throw e;
    }

    if (!await helpers.checkIfEmailExists(email)) throw "Either the email address or password is invalid";

    if (await helpers.checkIfPasswordCorrect(email, password)) {
        return await helpers.getUserInfoByEmail(email);
    } else {
        throw "Either the email address or password is invalid";
    }
};


const removeUser = async (id) => {
    const usersCollection = await user_collection();
    const deletionInfo = await usersCollection.findOneAndDelete({
        _id: new ObjectId(id),
    });
    if (deletionInfo.deletedCount === 0) {
        throw `Could not delete user with id of ${id}`;
    }
    console.log(deletionInfo);
    return deletionInfo;
}

const updateUser = async (id, updatedUser) => {
    // Extract fields from updatedUser and sanitize inputs
    let { userName, firstName, lastName, email, city, state, country, age, diploma, discipline } = updatedUser;

    // Validation
    if (!firstName) throw "Please provide your first name";
    if (!lastName) throw "Please provide your last name";
    if (!email) throw "Please provide your email address";
    if (!city) throw "Please provide your city";
    if (!state) throw "Please provide your state";
    if (!country) throw "Please provide your country";
    if (!age) throw "Please provide your age";
    if (!diploma) throw "Please provide your highest diploma";
    if (!discipline) throw "Please provide your discipline";

    // Trim inputs and check with regex where applicable
    const regex = /^[a-zA-Z\s]+$/;  // Allows letters and spaces
    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.trim().toLowerCase();
    city = city.trim();
    state = state.trim();
    country = country.trim();
    diploma = diploma.trim();
    discipline = discipline.trim();

    if (!regex.test(firstName) || firstName.length < 2 || firstName.length > 25) {
        throw "First name must only contain letters and be 2 - 25 characters long";
    }

    if (!regex.test(lastName) || lastName.length < 2 || lastName.length > 25) {
        throw "Last name must only contain letters and be 2 - 25 characters long";
    }

    if (!validator.isEmail(email)) {
        throw "Email address should be a valid email address format, e.g., example@example.com";
    }

    // Further validation might be required for other fields as per business logic
    age = parseInt(age, 10);
    if (isNaN(age) || age < 18) {
        throw "Age must be a valid number and at least 18";
    }

    // Check for unique email address among other users
    if (await helpers.checkIfEmailExistsExceptMe(email, id)) {
        throw "There is already a user with that email address";
    }

    const userCollection = await user_collection();
    const updateInfo = await userCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        {
            $set: {
                firstName: firstName,
                lastName: lastName,
                email: email,
                city: city,
                state: state,
                country: country,
                age: age,
                diploma: diploma,
                discipline: discipline,
                updatedAt: new Date()  // Updates the timestamp on each update
            }
        },
        { returnDocument: 'after' }
    );

    if (!updateInfo) throw 'Could not update user';

    return { updatedUser: true };
}

const getAllUsers = async () => {
    const usersCollection = await user_collection();
    const allUsers = await usersCollection.find({}).toArray();
    return allUsers;
}

const updatePassword = async (id, password) => {
    const userCollection = await user_collection();
    if (!validation.checkIfPasswordCorrect(password)) throw "Password must have at least 8 characters, with at least 1 uppercase letter, 1 number, and 1 symbol";
    password = await bcrypt.hash(password, 10);
    await userCollection.findOneAndUpdate(
        {_id: new ObjectId(id)},
        {
            $set: {
                hashPassword: password,
            }
        },
        {returnDocument: 'after'});
}

export {
    getUserById,
    addUser,
    loginUser,
    removeUser,
    updateUser,
    getAllUsers,
    updatePassword
};