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

let ParticipantSchema = new Schema({
	user: {
		type: Number,
		ref: "User"
	},
	email: {
		type: String //used for emailing user, default to user email if there is one
	},
	event: {
		type: Number,
		ref: "Event"
	},
	registeredTimeStamp: {
		type: Date,
		"default": Date.now
	},
	isRegistered: {
		type: Boolean,
		"default": false
	},
	registrationCode: {
		type: String,
		ref: "Event"
	},
	notes: {
		type: String,
		trim: true
	},
	favoriteSession: [{
		type: Number,
		ref: "EventSession"
	}],
	registeredSession: [{
		type: Number,
		ref: "EventSession"
		// session: {
		// },
		// status: {
		// 	type: String
		// }
	}],
	seeNotRegisteredPopUp: {
		type: Boolean,
		default: false
	}
}, schemaOptions);

ParticipantSchema.virtual("code").get(function () {
	return this.encodeID();
});

ParticipantSchema.plugin(autoIncrement.plugin, {
	model: "Participant",
	startAt: 1
});

ParticipantSchema.methods.encodeID = function () {
	return hashids.encodeHex(this._id);
};

ParticipantSchema.methods.decodeID = function (code) {
	return hashids.decodeHex(code);
};

let Participant = mongoose.model("Participant", ParticipantSchema);

module.exports = Participant;
