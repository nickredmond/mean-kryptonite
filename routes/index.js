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
var Story = mongoose.model('Story');
var Dashboard = mongoose.model('Dashboard');
//Story.remove({});

var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

router.post('/register', function(request, response, next){
	//-- Doesn't handle all required data. Up to the client to handle that right now --//
	if (!(request.body.username && request.body.email && request.body.password)){
		return response.status(400).json({message: 'Please fill out all fields'});
	}

	var user = new User();
	user.name = request.body.name;
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

	var dashboard = new Dashboard();
	dashboard.milestones = [];
	dashboard.dateQuit = new Date().getDate();
	dashboard.save();

	user.dashboard = dashboard;

	user.save(function(err){
		if (err) { return next(err); }
		return response.json({token: user.generateJWT()});
	});
});

router.param('story', function(request, response, next, id){
	var query = Story.findById(id);

	query.exec(function(err, story){
		if (err) { return next(err); }
		if(!story) { return next(new Error('can\'t find story')); }

		request.story = story;
		return next();
	});
});

//--- DEV URL - COMMENT OUT WHEN NOT IN USE ---//
// router.post('/newStory', function(request, response, next){
// 	// console.log("this is a request: " + request.body.story);
// 	Story.create({title: request.body.title,
// 				  summary: request.body.summary,
// 				  imageUri: request.body.imageUri,
// 				  storyUri: request.body.storyUri,
// 				  isTopStory: request.body.isTopStory
// 				 }, 
// 		function(err, story){
// 			if (err) { return next(err); }
// 			response.json({story: story});
// 	});	
// });

router.get('/topStory', function(request, response, next){
	Story.findOne({'isTopStory': true})
		.limit(1)
		.exec(function(err, story){
			if (err) { return next(err); }
			return response.json({story: story});
		});
});

router.get('/stories/:story', function(request, response){
	response.json(request.story);
});

function calculateCravingLevel(user){
	console.log('user: ' + user.email);

	var dateQuit = user.dashboard.dateQuit;
	var difference = dateQuit.getTime() - new Date().getTime();

	var days = Math.floor(difference / (1000 * 60 * 60 * 24));
 	difference -= days * (1000 * 60 * 60 * 24);

 	var hours = Math.floor(difference / (1000 * 60 * 60));
 	days += (hours / 24);
 	difference -= hours * (1000 * 60 * 60);

 	var minutes = Math.floor(difference / (1000 * 60));
 	days += (minutes / (24 * 60));
 	difference -= minutes * (1000 * 60);

 	var cravingLevel = 0;
 	var maxCravingValue = 3.2;

 	var normalizedDays = days / 2;

 	if (normalizedDays < 0.83){
 		cravingLevel = 2.867 * normalizedDays;
 	}
 	else if (normalizedDays >= 0.83 && normalizedDays < 2.58){
 		cravingLevel = ((-1 * ((2 * Math.pow(normalizedDays, 2)) - (8 * normalizedDays) + 5)) / Math.pow(normalizedDays, 2)) + 2;
 	}
 	else if (normalizedDays >= 2.58 && normalizedDays < 147.02){
 		cravingLevel = (Math.pow((0.005 * normalizedDays) -2, 2)) - 1.6;
 	}
 	else cravingLevel = 0;

 	return cravingLevel / maxCravingValue;
}	

router.post('/dashboard', function(request, response, next){
	if (!(request.body.username || request.body.email) || !request.body.password){
		return response.status(400).json({message: 'Please fill out all fields'});
	}

	passport.authenticate('local', function(err, user, info){
		if (err) { return next(err); }
		
		// var authUser = User.find({ 'username': user.username }).exec(function(err, doc){
		// 	console.log('err: ' + err);
		// 	console.log('doc: ' + JSON.stringify(doc));
		// });
		var dashboard = null;

		if (user){

			Dashboard.findById(user.dashboard).exec(function(err, doc){
				user.dashboard = doc;

				return response.json({token: user.generateJWT(), 
					dashboard: {
						greeting: "Welcome",
						firstName: user.name,
						subgreeting: "You can do this!",
						cravingLevel: calculateCravingLevel(user)
					}
				});
			});
		//console.log('len: ' + dashboard);
			
		} else {
			return response.status(401).json(info);
		}
	})(request, response, next);
});
