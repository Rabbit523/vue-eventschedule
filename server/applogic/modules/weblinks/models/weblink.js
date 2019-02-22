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

let WeblinkSchema  = new Schema({
	label: {
		type: String,
		trim: true
	},
	url: {
		type: String,
		trim: true
	},
	creater: {
		type: Number,
		ref: "User"
	},
	metadata: {}
}, schemaOptions);


WeblinkSchema.virtual("code").get(function () {
	return this.encodeID();
});

WeblinkSchema.plugin(autoIncrement.plugin, {
	model: "Weblink",
	startAt: 1
});

WeblinkSchema.methods.encodeID = function () {
	return hashids.encodeHex(this._id);
};

WeblinkSchema.methods.decodeID = function (code) {
	return hashids.decodeHex(code);
};

let Weblink = mongoose.model("Weblink", WeblinkSchema);

module.exports = Weblink;
