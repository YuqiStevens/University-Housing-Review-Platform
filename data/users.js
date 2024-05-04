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
    if (id.trim().length === 0)
        throw 'Id cannot be an empty string or just spaces';
    id = id.trim();
    if (!ObjectId.isValid(id)) throw 'invalid object ID';
    const userCollection = await user_collection();
    const user = await userCollection.findOne({_id: new ObjectId(id)});
    if (user === null) throw 'No user with that id';
    return user;
}

const addUser = async (
    userName,
    firstName,
    lastName,
    email,
    password,
    role
) => {
    if (!userName) throw "Please provide your user name";
    if (!firstName) throw "Please provide your first name";
    if (!lastName) throw "Please provide your last name";
    if (!email) throw "Please provide your email address";
    if (!password) throw "Please provide your password";
    if (!role) throw "Please provide your role";

    var regex = /^[a-zA-Z]+$/;
    userName = userName.trim();
    if (!regex.test(userName)) throw "User name must only contain letters";
    if (userName.length < 2 || userName.length > 25) throw "User name should have 2 - 25 characters";

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
        "userName": userName,
        "firstName": firstName,
        "lastName": lastName,
        "email": email,
        "hashPassword": password,
        "gender": "",
        "userReviews": [],
        "userComments": [],
        "role": role,
        "ownedStoreId": null,
        "avatar": "default.jpg",
    }
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
    let userName = xss(updatedUser.userName);
    let firstName = xss(updatedUser.firstName);
    let lastName = xss(updatedUser.lastName);
    let email = xss(updatedUser.email);
    let gender = (updatedUser.gender);

    if (!userName) throw "Please provide your user name";
    if (!firstName) throw "Please provide your first name";
    if (!lastName) throw "Please provide your last name";
    if (!email) throw "Please provide your email address";

    var regex = /^[a-zA-Z]+$/;
    userName = userName.trim();
    if (!regex.test(userName)) throw "User name must only contain letters";
    if (userName.length < 2 || userName.length > 25) throw "User name should have 2 - 25 characters";

    firstName = firstName.trim();
    if (!regex.test(firstName)) throw "First name must only contain letters";
    if (firstName.length < 2 || firstName.length > 25) throw "First name should have 2 - 25 characters";

    lastName = lastName.trim();
    if (!regex.test(lastName)) throw "Last name must only contain letters";
    if (lastName.length < 2 || lastName.length > 25) throw "Last name should have 2 - 25 characters";

    email = email.trim().toLowerCase();
    if (!validator.isEmail(email)) throw "Email address should be a valid email address format. example@example.com";
    if (await helpers.checkIfEmailExistsExceptMe(email)) throw "There is already a user with that email address";

    gender = gender.trim().toLowerCase();
    if (gender !== "" && gender !== 'male' && gender !== 'female') throw "The gender should be prefer not to say, male or female";

    const userCollection = await user_collection();
    const updateInfo = await userCollection.findOneAndUpdate(
        {_id: new ObjectId(id)},
        {
            $set: {
                userName: userName,
                firstName: firstName,
                lastName: lastName,
                email: email,
                gender: gender,
            }
        },
        {returnDocument: 'after'});
    if (!updateInfo) throw 'Could not update user';
    return {updatedUser: true};
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