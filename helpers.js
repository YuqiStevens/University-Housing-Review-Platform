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


    checkId(id, varName) {
        if (!id) throw `Error: You must provide a ${varName}`;
        if (typeof id !== "string") throw `Error: ${varName} must be a string`;
        id = id.trim();
        if (id.length === 0)
            throw `Error: ${varName} cannot be an empty string or just spaces`;
        if (!ObjectId.isValid(id)) throw `Error: Invalid object ID for ${varName}`;
        return id;
    },


    checkString(strVal, varName) {
        if (!strVal) throw `Error: You must supply a ${varName}!`;
        if (typeof strVal !== "string") throw `Error: ${varName} must be a string!`;
        strVal = strVal.trim();
        if (strVal.length === 0)
            throw `Error: ${varName} cannot be an empty string or just spaces`;
        return strVal;
    },


    checkIfLocationValid(location) {
        if (typeof location !== "object") {
            throw "The location is not an object!";
        }
        if (!location.address || !location.city || !location.state || !location.zip) {
            throw "Location must include address, city, state, and zip";
        }
        if (!validator.isPostalCode(location.zip, 'US')) {
            throw "Invalid US postal code";
        }
    },


    // Additional methods integrated here
    checkUserName(string, varName) {
        if (!string) throw `You must provide a ${varName}`;
        if (typeof string !== "string") throw `Error:${varName} must be a string`;
        string = string.trim();
        if (string.length === 0)
            throw `${varName} cannot be an empty string or just spaces`;
        if (string.length < 2 || string.length > 25)
            throw `${varName} should be within 2 - 25 characters`;
        if (!/^[a-zA-Z0-9]+$/.test(string))
            throw `${varName} must only contain digits and letters`;
        return string;
    },


    checkName(string, varName) {
        if (!string) throw `You must provide a ${varName}`;
        if (typeof string !== "string") throw `Error:${varName} must be a string`;
        string = string.trim();
        if (string.length === 0)
            throw `Error: ${varName} cannot be an empty string or just spaces`;
        if (string.length < 2 || string.length > 25)
            throw `${varName} should be within 2 - 25 characters`;
        if (!/^[a-zA-Z]+$/.test(string))
            throw `${varName} must only contain letters`;
        return string;
    },


    checkEmail(string, varName) {
        if (!string) throw `You must provide a ${varName}`;
        if (typeof string !== "string") throw `Error:${varName} must be a string`;
        string = string.trim();
        if (string.length === 0)
            throw `${varName} cannot be an empty string or just spaces`;
        if (!validator.isEmail(string)) {
            throw "The email address is not in a valid format!";
        }
        return string;
    },

    
    checkPassword(password, varName) {
        const passwordRequirements = {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        };
        let isValidPassword = validator.isStrongPassword(password, passwordRequirements);
        if (password.includes(' '))
            throw `${password} should not contain any space`;
        if (!isValidPassword) {
            throw `${varName} must have ${passwordRequirements.minLength} characters, 
            with at least ${passwordRequirements.minLowercase} lowercase letters, 
            ${passwordRequirements.minUppercase} uppercase letters,
            ${passwordRequirements.minNumbers} numbers,
            and ${passwordRequirements.minSymbols} symbols`;
        }
        return password;
    },

    async checkIfHousingNameExists(name) {
        name = name.replace(/\s/g, "").toLowerCase();
        const housingCollection = await housings();
        const housingList = await housingCollection.find().toArray();
        for (let house of housingList) {
            if (house.name.replace(/\s/g, "").toLowerCase() === name) {
                return true;
            }
        }
        return false;
    },

    async checkIfHousingNameExistsForOtherId(name, id) {
        name = name.replace(/\s/g, "").toLowerCase();
        const housingCollection = await housings();
        const housingList = await housingCollection.find().toArray();
        for (let house of housingList) {
            if (house._id.toString() !== id.toString() && house.name.replace(/\s/g, "").toLowerCase() === name) {
                return true;
            }
        }
        return false;
    },

    checkIfHousingNameValid(housingName) {
        const housingNameRegex = /^[a-zA-Z0-9\s\-&',.()]{3,25}$/;
        if (!housingNameRegex.test(housingName)) {
            throw "Invalid housing name (the housing name should be 3 to 25 characters)";
        }
    },
    checkSearchValid(searchTerm) {
        if (!searchTerm) {
            throw 'Please enter a serchterm';
        }

        if (typeof searchTerm !== 'string') {
            throw 'The type of serachterm must be string';
        }

        searchTerm = searchTerm.trim();

        if (searchTerm.length === 0) {
            throw 'A searchterm all with empty space is not valid';
        }

        if (searchTerm.length > 25) {
            throw 'Search term is too long';
        }

        return searchTerm;
    }
};

export default exportedMethods;
