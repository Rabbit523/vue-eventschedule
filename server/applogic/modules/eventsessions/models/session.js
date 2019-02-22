"use strict";

// let ROOT 			= "../../../../";
let config = require("../../../../config");
let logger = require("../../../../core/logger");

let db = require("../../../../core/mongo");
let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let hashids = require("../../../../libs/hashids")("sessions");
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

let EventSessionSchema = new Schema({
	name: {
		type: String,
		trim: true
	},
	event: {
		type: Number,
		ref: "Event"
	},
	subtitle: {
		type: String,
		trim: true
	},
	isPublished: {
		type: String,
		"default": "1"
	},
	creator: {
		type: Number,
		ref: "User"
	},
	startTime: {
		type: String,
		trim: true,
		"default": ""
	},
	date: {
		type: Date,
		"default": Date.now
	},
	endTime: {
		type: String,
		trim: true,
		"default": ""
	},
	description: {
		type: String,
		trim: true,
		"default": ""
	},
	warnCapacity: {
		type: String,
		trim: true,
		"default": ""
	},
	maxCapacity: {
		type: Number,
		default: null
	},
	participants: [{
		type: Number,
		default: null,
		ref: "User"
	}],
	waitlisted: [{
		type: Number,
		default: null,
		ref: "User"
	}],
	creater: {
		type: Number,
		ref: "User"
	},
	venue: {
		type: Number,
		ref: "Venue"
	},
	sessionType: {
		type: Number,
		ref: "SessionType"
	},
	people: [{
		type: Number,
		ref: "Worker"
	}],
	weblinks: [{
		type: Number,
		ref: "Weblink"
	}],
	addOnPrice: { //if is null, does not have addOn
		type: Number,
		default: null
	},
	metadata: {}
}, schemaOptions);


EventSessionSchema.virtual("code").get(function () {
	return this.encodeID();
});

EventSessionSchema.plugin(autoIncrement.plugin, {
	model: "Event",
	startAt: 1
});

EventSessionSchema.methods.encodeID = function () {
	return hashids.encodeHex(this._id);
};

EventSessionSchema.methods.decodeID = function (code) {
	return hashids.decodeHex(code);
};

let EventSession = mongoose.model("EventSession", EventSessionSchema);

module.exports = EventSession;
