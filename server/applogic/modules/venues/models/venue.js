"use strict";

// let ROOT 			= "../../../../";
let config = require("../../../../config");
let logger = require("../../../../core/logger");

let db = require("../../../../core/mongo");
let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let hashids = require("../../../../libs/hashids")("venues");
let autoIncrement = require("mongoose-auto-increment");

let schemaOptions = {
	timestamps: true,
	toObject: {
		virtuals: true
	},
	toJSON: {
		virtuals: true
	}
};

let VenueSchema = new Schema({
	creater: {
		type: Number,
		ref: "User"
	},
	name: {
		type: String,
		trim: true
	},
	subname: {
		type: String,
		trim: true
	},
	description: {
		type: String,
		trim: true
	},
	address: {
		type: String,
		trim: true
	},
	city: {
		type: String,
		trim: true
	},
	country: {
		type: String,
		trim: true
	},
	zipcode: {
		type: String,
		trim: true
	},
	weblinks: [{
		type: Number,
		ref: "Weblink"
	}],
	leaflet: {
		type: {
			lat: {
				type: Number
			},
			long: {
				type: Number
			}
		}
	},
	googleMap: {
		type: String,
		"default": ""
	},
	metadata: {}
}, schemaOptions);


VenueSchema.virtual("code").get(function () {
	return this.encodeID();
});

VenueSchema.plugin(autoIncrement.plugin, {
	model: "Venue",
	startAt: 1
});

VenueSchema.methods.encodeID = function () {
	return hashids.encodeHex(this._id);
};

VenueSchema.methods.decodeID = function (code) {
	return hashids.decodeHex(code);
};

let Venue = mongoose.model("Venue", VenueSchema);

module.exports = Venue;
