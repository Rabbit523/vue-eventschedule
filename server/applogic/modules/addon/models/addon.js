"use strict";

// let ROOT 			= "../../../../";
let config = require("../../../../config");
let logger = require("../../../../core/logger");

let db = require("../../../../core/mongo");
let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let hashids = require("../../../../libs/hashids")("devices");
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

let AddOnSchema = new Schema({
	limited: {
		type: Boolean,
		default: true,
	},
	restrictedRegistration: { //can't register if full
		type: Boolean,
		default: true,
	},
	ticketCode: { //user can decide a userCode
		type: String
		//must be unique
	},
	ticketName: {
		type: String
	},
	validSessionIDs: [{ //if no session is specified means all sessions
		type: Number,
		ref: "EventSession"
	}],
	amount: {
		type: Number, //number of sessions they can register for using addOn
		default: 1
	}
}, schemaOptions);


AddOnSchema.virtual("code").get(function () {
	return this.encodeID();
});

AddOnSchema.plugin(autoIncrement.plugin, {
	model: "AddOn",
	startAt: 1
});

AddOnSchema.methods.encodeID = function () {
	return hashids.encodeHex(this._id);
};

AddOnSchema.methods.decodeID = function (code) {
	return hashids.decodeHex(code);
};

let AddOn = mongoose.model("AddOn", AddOnSchema);

module.exports = AddOn;
