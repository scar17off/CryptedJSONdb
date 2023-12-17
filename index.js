const CryptoJS = require('crypto-js');
const fs = require('fs');

/**
 * Represents an encrypted JSON database.
 * @class
 */
class CryptedJSONdb {
    /**
     * Creates an instance of CryptedJSONdb.
     * @constructor
     * @param {string} filename - The name of the file to store the JSON data.
     * @param {Object} [options={}] - Additional options for the database.
     * @param {boolean} [options.encryption=false] - Indicates whether encryption is enabled.
     * @param {string} [options.key=''] - The encryption key.
     * @param {boolean} [options.minify] - Indicates whether to minify the JSON data.
     */
    constructor(filename, options = {}) {
        this.filename = filename;
        this.encryption = options.encryption || false;
        this.databaseKey = options.key || '';
        this.minifyJSON = options.minify;
        this.data = {};
        this.load();
    };
    /**
     * Loads data from the file into the database instance.
     * @private
     */
    load() {
        try {
            if(!fs.existsSync('./' + this.filename)) {
                fs.writeFileSync("./" + this.filename, CryptoJS.AES.encrypt("{}", this.databaseKey).toString());
            };
            const encryptedData = fs.readFileSync(this.filename, 'utf8');
            let decryptedData = {};
            if(encryptedData && this.encryption) {
                try {
                    const bytes = CryptoJS.AES.decrypt(encryptedData, this.databaseKey);
                    decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
                } catch (error) {
                    console.log('Error parsing JSON data:', error);
                };
            } else {
                decryptedData = JSON.parse(encryptedData);
            }
            this.data = decryptedData;
        } catch (error) {
            console.log('Error loading data:', error);
        };
    };
    /**
     * Saves the current database state to the file.
     * @private
     */
    save() {
        try {
            let dataToSave = JSON.stringify(this.data, null, this.minifyJSON ? 0 : 4);
            if (this.encryption) {
                dataToSave = CryptoJS.AES.encrypt(dataToSave, this.databaseKey).toString();
            }
            fs.writeFileSync(this.filename, dataToSave, 'utf-8');
        } catch (error) {
            console.log('Error saving data:', error);
        };
    };
    /**
     * Sets a value in the database based on the provided keys.
     * @param {*} value - The value to set.
     * @param {...string} keys - The keys to navigate the nested structure.
     * @returns {boolean} - Indicates whether the value was successfully set.
     */
    setValue(value, ...keys) {
        let obj = this.data;
        for(let i = 0; i < keys.length - 1; i++) {
            if(!obj[keys[i]]) {
                obj[keys[i]] = {};
            }
            obj = obj[keys[i]];
        };
        if(obj[keys[keys.length - 1]] !== value)
            obj[keys[keys.length - 1]] = value;
        else return false;
        this.save();
        return true;
    };
    /**
     * Retrieves a value from the database based on the provided keys.
     * @param {...string} keys - The keys to navigate the nested structure.
     * @returns {*} - The retrieved value.
     */
    getValue(...keys) {
        let obj = this.data;
        for(let i = 0; i < keys.length; i++) {
            if(!obj[keys[i]]) {
                return undefined;
            }
            obj = obj[keys[i]];
        };
        return obj;
    };
    /**
     * Retrieves a value from the database based on the provided path.
     * @param {...string} path - The path to the desired value.
     * @returns {*} - The retrieved value.
     */
    getPath(...path) {
        let obj = this.getValue(...path);
        return obj;
    };
};

module.exports = CryptedJSONdb;