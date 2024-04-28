import { usersCollection } from '../config/mongoCollections.js';
import validation from '../helpers.js';
import bcrypt from 'bcrypt';

const registerUser = async (firstName, lastName, username, password, favoriteQuote, themePreference, role) => {
    const collection = await usersCollection();

    validation.checkOnlyLetters(firstName, 'firstName');
    validation.checkOnlyLetters(lastName, 'lastName');
    validation.checkOnlyLetters(username, 'username');
    validation.validateStringWithLength(firstName, 'firstName', 2, 25);
    validation.validateStringWithLength(lastName, 'lastName', 2, 25);
    validation.validateStringWithLength(username, 'username', 5, 10);
    validation.validatePassword(password);
    validation.validateStringWithLength(favoriteQuote, 'favoriteQuote', 20, 255);

    const validThemes = ['light', 'dark'];
    if (!validThemes.includes(themePreference.toLowerCase()))
        throw `Error: Invalid theme preference, must be either 'light' or 'dark'`;
    const validRoles = ['admin', 'user'];
    if (!validRoles.includes(role.toLowerCase()))
        throw `Error: Invalid role, must be either 'admin' or 'user'`;

    const normalizedUsername = username.toLowerCase();
    const existingUser = await collection.findOne({ username: normalizedUsername });
    if (existingUser)
        throw `Error: A user with the username ${username} already exists`;

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
        firstName,
        lastName,
        username: normalizedUsername,
        password: hashedPassword,
        favoriteQuote,
        themePreference: themePreference.toLowerCase(),
        role: role.toLowerCase()
    };

    const insertResult = await collection.insertOne(newUser);
    if (insertResult.acknowledged)
        return { signupCompleted: true };
    else
        throw `Error: Failed to create new user`;


};

const loginUser = async (username, password) => {
    const collection = await usersCollection();

    validation.validateStringWithLength(username, 'username', 5, 10);
    validation.checkString(password, 'password');

    const normalizedUsername = username.toLowerCase();
    const user = await collection.findOne({ username: normalizedUsername });
    if (!user)
        throw "Either the username or password is invalid";

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
        throw "Either the username or password is invalid";

    return {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        favoriteQuote: user.favoriteQuote,
        themePreference: user.themePreference,
        role: user.role
    };
};

export {registerUser, loginUser};