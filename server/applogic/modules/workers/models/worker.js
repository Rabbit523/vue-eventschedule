"use strict";

// let ROOT 			= "../../../../";
let config = require("../../../../config");
let logger = require("../../../../core/logger");

let db = require("../../../../core/mongo");
let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let hashids = require("../../../../libs/hashids")("workers");
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

let WorkerSchema = new Schema({
	creater: {
		type: Number,
		ref: "User"
	},
	title: {
		type: String,
		trim: true
	},
	description: {
		type: String,
		trim: true
	},
	role: {
		type: String,
		trim: true
	},
	metadata: {}
}, schemaOptions);


WorkerSchema.virtual("code").get(function () {
	return this.encodeID();
});

WorkerSchema.plugin(autoIncrement.plugin, {
	model: "Worker",
	startAt: 1
});

WorkerSchema.methods.encodeID = function () {
	return hashids.encodeHex(this._id);
};

WorkerSchema.methods.decodeID = function (code) {
	return hashids.decodeHex(code);
};

let Worker = mongoose.model("Worker", WorkerSchema);

module.exports = Worker;
