import { users, housings } from "./config/mongoCollections.js";
import bcrypt from 'bcrypt';
import { ObjectId } from "mongodb";
import validator from "validator";

const exportedMethods = {
    async toHashPassword(password) {
        return await bcrypt.hash(password, 10);
    },

    async checkIfEmailExists(email) {
        const userCollection = await users();
        const user = await userCollection.findOne({ email });
        return user !== null;
    },

    async checkIfEmailExistsExceptMe(emailNow, email) {
        const userCollection = await users();
        const userList = await userCollection.find({ email: { $ne: emailNow } }).toArray();
        return userList.some(user => user.email === email);
    },

    async checkIfPasswordCorrect(email, password) {
        const userCollection = await users();
        const user = await userCollection.findOne({ email });
        if (!user) return false;
        return await bcrypt.compare(password, user.hashPassword);
    },

    async getUserInfoByEmail(email) {
        const userCollection = await users();
        const user = await userCollection.findOne({ email });
        if (!user) return null;
        return {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role
        };
    },

    checkId(id) {
        if (!id) throw "No id provided";
        if (typeof id !== "string" || id.trim() === "") throw "Invalid id provided";
        id = id.trim();
        if (!ObjectId.isValid(id)) throw "Not a valid ObjectId";
        return id;
    },

    checkString(string, varName) {
        if (!string) throw `You must provide a ${varName}`;
        if (typeof string !== "string") throw `Error: ${varName} must be a string`;
        string = string.trim();
        if (string.length === 0) throw `${varName} cannot be an empty string or just spaces`;
        return string;
    },

    checkUserName(string) {
        return this.checkNamePattern(string, 'Username', /^[a-zA-Z0-9]+$/, 2, 25);
    },

    checkName(string, varName) {
        return this.checkNamePattern(string, varName, /^[a-zA-Z]+$/, 2, 25);
    },

    checkEmail(string) {
        string = this.checkString(string, 'Email');
        if (!validator.isEmail(string)) throw "The email address is not in a valid format!";
        return string;
    },

    checkPassword(password) {
        const passwordRequirements = {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        };
        if (!validator.isStrongPassword(password, passwordRequirements)) {
            throw "Password does not meet the security requirements.";
        }
        return password;
    },

    checkNamePattern(string, varName, regex, minLen, maxLen) {
        string = this.checkString(string, varName);
        if (string.length < minLen || string.length > maxLen) throw `${varName} should be within ${minLen} - ${maxLen} characters`;
        if (!regex.test(string)) throw `${varName} must meet the specified pattern`;
        return string;
    },

    checkIfPhoneNumberValid(phoneNumber) {
        if (!/^\d{10}$/.test(phoneNumber)) throw "US phone number must contain 10 digits";
        return phoneNumber;
    },

    checkIfStoreNameValid(storeName) {
        return this.checkNamePattern(storeName, 'Store Name', /^[a-zA-Z0-9\s\-&',.()]{3,25}$/, 3, 25);
    },

    checkSearchValid(searchTerm) {
        searchTerm = this.checkString(searchTerm, 'Search term');
        if (searchTerm.length > 25) throw 'Search term is too long';
        return searchTerm;
    }
};

export default exportedMethods;
