var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('express-jwt');
var mongoose = require('mongoose');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

var User = mongoose.model('User');

var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

router.post('/register', function(request, response, next){
	//-- Doesn't handle all required data. Up to the client to handle that right now --//
	if (!(request.body.username && request.body.email && request.body.password)){
		return response.status(400).json({message: 'Please fill out all fields'});
	}

	var user = new User();
	user.username = request.body.username;
	user.email = request.body.email;
	user.birthdate = request.body.birthdate;
	user.stateOfResidence = request.body.stateOfResidence;
	user.quittingMethod = request.body.quittingMethod;

	//-- handle if user doesn't use a certain type --//

	user.cigarettesPerDay = request.body.cigarettesPerDay;
	user.dipsPerDay = request.body.dipsPerDay;
	user.cigarsPerDay = request.body.cigarsPerDay;
	user.cigaretteBrand = request.body.cigaretteBrand;
	user.dipBrand = request.body.dipBrand;
	user.cigarBrand = request.body.cigarBrand;

	user.setPassword(request.body.password);

	user.save(function(err){
		if (err) { return next(err); }
		return response.json({token: user.generateJWT()});
	});
});
