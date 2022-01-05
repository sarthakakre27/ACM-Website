const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
// require('dotenv').config();

// // Connect to mongoDB atlas
// mongoose.connect(process.env.PASSPORT_MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
	username: String,
	email: String,
	password: String
});

// Passport-Local Mongoose will add a username, hash and salt field to store the username,
// the hashed password and the salt value.
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

module.exports = {
	User: User
};
