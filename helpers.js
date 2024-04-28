const exportedMethods = {
    checkString(strVal, varName) {
        if (!strVal) throw new Error(`You must supply ${varName}!`);
        if (typeof strVal !== 'string') throw new Error(`${varName} must be a string!`);
        strVal = strVal.trim();
        if (strVal.length === 0) throw new Error(`${varName} cannot be an empty string or just spaces.`);
        return strVal;
    },

    checkOnlyLetters(strVal, varName) {
        const hasOnlyLetters = /^[a-zA-Z]+$/.test()
        if (!hasOnlyLetters) {
            throw new Error(`${varName} must contain only letters.`);
        }
    },

    validateStringWithLength(strVal, varName, minLength, maxLength) {
        strVal = this.checkString(strVal, varName);
        if (strVal.length < minLength || strVal.length > maxLength) {
            throw new Error(`${varName} must be between ${minLength} and ${maxLength} characters long.`);
        }
    },

    validatePassword(password) {
        password = this.checkString(password, 'password');
        if (password.length < 8) throw new Error("Password must be at least 8 characters long.");
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        if (!hasUpperCase || !hasNumber || !hasSpecialChar) {
            throw new Error("Password must contain at least one uppercase letter, one number, and one special character.");
        }
    }
};

export default exportedMethods;
