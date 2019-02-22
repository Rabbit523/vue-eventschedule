"use strict";

// let ROOT 			= "../../../../";
let config = require("../../../../config");
let logger = require("../../../../core/logger");

let db = require("../../../../core/mongo");
let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let hashids = require("../../../../libs/hashids")("events");
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

let EventSchema = new Schema({
	name: {
		type: String,
		trim: true
	},
	isPublished: {
		type: Boolean,
		"default": true
	},
	creater: {
		type: Number,
		ref: "User"
	},
	administrators: [{
		type: String,
		default: "administrators"
		// type: Number,
		// ref: "User"
	}],
	description: {
		type: String,
		trim: true,
		"default": ""
	},
	startDate: {
		type: Date,
		"default": Date.now
	},
	endDate: {
		type: Date,
		"default": Date.now
	},
	// weblinks: [{
	// 	WeblinkSchema
	// }],
	eventSessions: [{
		type: Number,
		ref: "EventSession"
	}],
	weblinks: [{
		type: Number,
		ref: "Weblink"
	}],
	metadata: {}
}, schemaOptions);


EventSchema.virtual("code").get(function () {
	return this.encodeID();
});

EventSchema.plugin(autoIncrement.plugin, {
	model: "Event",
	startAt: 1
});

EventSchema.methods.encodeID = function () {
	return hashids.encodeHex(this._id);
};

EventSchema.methods.decodeID = function (code) {
	return hashids.decodeHex(code);
};

let Event = mongoose.model("Event", EventSchema);

module.exports = Event;
