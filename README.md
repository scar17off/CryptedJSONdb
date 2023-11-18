# CryptedJSONdb
CryptedJSONdb is a module for Node.js that provides an easy and convenient way to open and retrieve JSON data.
<br/>
It includes methods for setting and discovering by keys and uses secure data encryption with crypto-js encryption.
<br/>
CryptedJSONdb can store configuration data, update settings, and any other data in JSON format.
<br/>
### Installing
`npm install cryptedjsondb`
### Usage
```javascript
const CryptedJSONdb = require("cryptedjsondb");
const db = new CryptedJSONdb('./data.json', {
    encryption: true,
    key: "your secret key",
    minify: true
});

// set a value
console.log(db.setValue(1000, 'users', 'scar17off', 'balance')); // returns true if set, returns false if it equals it already

// get a value
const value = db.getValue('users', 'scar17off', 'balance');
console.log(value); // 1000

// add a value to arraylist
db.setValue([], "1");
db.addKeyToArr(1, "1");

console.log(db.getPath("users", "scar17off"));
console.log(db.data);

console.log(db.getItemByIndex(0, "1"));
```
