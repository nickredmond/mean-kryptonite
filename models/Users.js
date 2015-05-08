var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
	username: {type: String, unique: true},
	email: {type: String, unique: true},
	hash: String,
	salt: String,
	stateOfResidence: String,
	birthdate: Date,
	quittingMethod: String,
	cigarettesPerDay: {type: Number, default: 0},
	dipsPerDay: {type: Number, default: 0},
	cigarsPerDay: {type: Number, default: 0},
	cigaretteBrand: {type: String, null: true},
	dipBrand: {type: String, null: true},
	cigarBrand: {type: String, null: true}
});

userSchema.methods.setPassword = function(password){
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};
userSchema.methods.isValidPassword = function(password){
	var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
	return this.hash === hash;
};
userSchema.methods.generateJWT = function(){
	var today = new Date();
	var expiration = new Date(today);
	expiration.setDate(today.getDate() + 14); // expires in 14 days

	return jwt.sign({
		_id: this._id,
		username: this.username,
		exp: parseInt(expiration.getTime() / 1000)
	}, 'SECRET'); // put the secret elsewhere!
};

mongoose.model('User', userSchema);