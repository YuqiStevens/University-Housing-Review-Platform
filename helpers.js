import {user_collection, housing_collection} from "./config/mongoCollections.js";
import bcrypt from 'bcryptjs';
import {ObjectId} from "mongodb";
import validator from "validator";


const exportedMethods = {
    async checkIfEmailExists(email) {
        const userCollection = await user_collection();
        const user = await userCollection.findOne({email});
        return user !== null;
    },

    async checkIfEmailExistsExceptMe(emailNow, email) {
        const userCollection = await user_collection();
        const userList = await userCollection.find({email: {$ne: emailNow}}).toArray();
        return userList.some(user => user.email === email);
    },

    async checkIfPasswordCorrect(email, password) {
        const userCollection = await user_collection();
        const user = await userCollection.findOne({email});
        if (!user) return false;
        return await bcrypt.compare(password, user.hashPassword);
    },

    async getUserInfoByEmail(email) {
        const userCollection = await user_collection();
        const user = await userCollection.findOne({email});
        if (!user) return null;
        return {
            id: user._id,
            //userName: user.userName,
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
        if (typeof location !== "object" || location === null) {
            throw new Error("The location must be a non-null object!");
        }
        if (typeof location.latitude !== "number" || typeof location.longitude !== "number") {
            throw new Error("Latitude and longitude must be numeric values!");
        }
        if (location.latitude < -90 || location.latitude > 90) {
            throw new Error("Latitude must be between -90 and 90 degrees!");
        }
        if (location.longitude < -180 || location.longitude > 180) {
            throw new Error("Longitude must be between -180 and 180 degrees!");
        }
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
            minSymbols: 1,
            returnScore: false, // Ensure this is set if using certain versions of validator
            pointsPerUnique: 0,
            pointsPerRepeat: 0,
            pointsForContainingLower: 0,
            pointsForContainingUpper: 0,
            pointsForContainingNumber: 0,
            pointsForContainingSymbol: 0
        };
        let isValidPassword = validator.isStrongPassword(password, passwordRequirements);
        console.log(`Password Validation Result: ${isValidPassword}`); // Debugging line
    
        if (password.includes(' ')) {
            throw `${password} should not contain any space`;
        }
        if (!isValidPassword) {
            throw `${varName} must have ${passwordRequirements.minLength} characters, 
            with at least ${passwordRequirements.minLowercase} lowercase letters, 
            ${passwordRequirements.minUppercase} uppercase letters,
            ${passwordRequirements.minNumbers} numbers,
            and ${passwordRequirements.minSymbols} symbols`;
        }
        return password;
    },

    checkIfHousingNameValid(housingName) {
        const housingNameRegex = /^[a-zA-Z0-9\s\-&',.()]{3,25}$/;
        if (!housingNameRegex.test(housingName)) {
            throw "Invalid housing name (the housing name should be 3 to 25 characters)";
        }
    },

    checkSearchValid(searchTerm) {
        if (!searchTerm || typeof searchTerm !== 'string') {
            return '';
        }
    
        searchTerm = searchTerm.trim();
    
        if (searchTerm.length > 50) {
            throw 'Search term is too long';
        }
    
        return searchTerm;
    }
    
};

export default exportedMethods;
