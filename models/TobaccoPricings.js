var mongoose = require('mongoose');

var tobaccoPricingSchema = new mongoose.Schema({
	tobaccoType: {type: String, enum: ["cigarette", "smokeless", "cigar"]},
	brandName: String,
	state: String,
	averagePrice: Number
});

mongoose.model('TobaccoPricing', tobaccoPricingSchema);