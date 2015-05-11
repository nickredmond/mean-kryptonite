var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

passport.use(new LocalStrategy(
	function(username, password, done){
		var criteria = (username.indexOf('@') === -1) ? {username: username} : {email: username};
		User.findOne(criteria, function(err, user){
			if (err) { return done(err); }
			if(!user){
				usernameError = (username.indexOf('@') === -1) ? 'Incorrect username' : 'Incorrect email address';
				return done(null, false, {message: usernameError});
			}
			if(!user.isValidPassword(password)){
				return done(null, false, {message: 'Incorrect password'});
			}

			return done(null, user);
		});
	}
));