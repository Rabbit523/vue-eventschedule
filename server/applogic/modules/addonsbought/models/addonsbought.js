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

let AddOnsBoughtSchema = new Schema({
	ticketCode: {
		type: String
	},
	email: {
		type: String
	},
	participant: {
		type: Number,
		ref: "Participant"
	},
	remainingCount: {
		type: Number //will initially match AddOn amount, everytime addOn is used -1 to value
	}
}, schemaOptions);



AddOnsBoughtSchema.virtual("code").get(function () {
	return this.encodeID();
});

AddOnsBoughtSchema.plugin(autoIncrement.plugin, {
	model: "AddOn",
	startAt: 1
});

AddOnsBoughtSchema.methods.encodeID = function () {
	return hashids.encodeHex(this._id);
};

AddOnsBoughtSchema.methods.decodeID = function (code) {
	return hashids.decodeHex(code);
};

let AddOnsBought = mongoose.model("AddOnsBought", AddOnsBoughtSchema);

module.exports = AddOnsBought;
