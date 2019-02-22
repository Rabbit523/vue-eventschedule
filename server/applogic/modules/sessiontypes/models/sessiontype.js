"use strict";

// let ROOT 			= "../../../../";
let config = require("../../../../config");
let logger = require("../../../../core/logger");

let db = require("../../../../core/mongo");
let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let hashids = require("../../../../libs/hashids")("sessiontypes");
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

let SessionTypeScheam = new Schema({
	name: {
		type: String,
		trim: true
	},
	color: {
		type: String,
		default: "#000000"
	}
}, schemaOptions);


SessionTypeScheam.virtual("code").get(function () {
	return this.encodeID();
});

SessionTypeScheam.plugin(autoIncrement.plugin, {
	model: "SessionType",
	startAt: 1
});

SessionTypeScheam.methods.encodeID = function () {
	return hashids.encodeHex(this._id);
};

SessionTypeScheam.methods.decodeID = function (code) {
	return hashids.decodeHex(code);
};

let SessionType = mongoose.model("SessionType", SessionTypeScheam);

module.exports = SessionType;
