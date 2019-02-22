"use strict";

let logger = require("../../../core/logger");
let config = require("../../../config");
let C = require("../../../core/constants");

let _ = require("lodash");

let Venue = require("./models/venue");

module.exports = {
	settings: {
		name: "venues",
		version: 1,
		namespace: "venues",
		rest: true,
		ws: true,
		graphql: true,
		permission: C.PERM_LOGGEDIN,
		role: "user",
		collection: Venue,

		modelPropFilter: "code name subname description address city country zipcode weblinks leaflet creater",
		modelPopulates: {
			"weblinks": "weblinks",
			"creater": "persons"
		}
	},

	actions: {
		find: {
			cache: false,
			handler(ctx) {
				let filter = {};

				let query = Venue.find(filter);
				return ctx.queryPageSort(query).exec().then((docs) => {
					return this.toJSON(docs);
				}).then((json) => {
					return this.populateModels(json);
				});
			}
		},

		// return a model by ID
		get: {
			cache: true,
			handler(ctx) {
				ctx.assertModelIsExist(ctx.t("app:VenueNotFound"));
				return Promise.resolve(ctx.model);
			}
		},

		create(ctx) {
			this.validateParams(ctx, true);
			let weblinks = [];
			ctx.params.weblinks.forEach(element => {
				weblinks.push(this.weblinkService.decodeID(element));
			});
			let venue = new Venue({
				name: ctx.params.name,
				subname: ctx.params.subname,
				description: ctx.params.description,
				address: ctx.params.address,
				city: ctx.params.city,
				country: ctx.params.country,
				zipcode: ctx.params.zipcode,
				leaflet: ctx.params.leaflet,
				weblinks: weblinks,
				creater: ctx.user.id
			});

			return venue.save()
				.then((doc) => {
					return this.toJSON(doc);
				})
				.then((json) => {
					return this.populateModels(json);
				})
				.then((json) => {
					this.notifyModelChanges(ctx, "created", json);
					return json;
				});
		},

		update(ctx) {
			console.log("updatevenue:::", ctx);
			ctx.assertModelIsExist(ctx.t("app:VenueNotFound"));
			
			this.validateParams(ctx);
			let weblinks = [];
			ctx.params.weblinks.forEach(element => {
				weblinks.push(this.weblinkService.decodeID(element));
			});
			console.log("updatevenue:::", ctx);
			return this.collection.findById(ctx.modelID).exec()
				.then((doc) => {

					if (ctx.params.name != null)
						doc.name = ctx.params.name;

					if (ctx.params.description != null)
						doc.description = ctx.params.description;

					if (ctx.params.subname != null)
						doc.subname = ctx.params.subname;

					if (ctx.params.city != null)
						doc.city = ctx.params.city;

					if (ctx.params.address != null)
						doc.address = ctx.params.address;

					if (ctx.params.country != null)
						doc.country = ctx.params.country;

					if (ctx.params.zipcode != null)
						doc.zipcode = ctx.params.zipcode;

					if (ctx.params.weblinks != null)
						doc.weblinks = weblinks;

					if (ctx.params.leaflet != null)
						doc.leaflet = ctx.params.leaflet;

					return doc.save();
				})
				.then((doc) => {
					return this.toJSON(doc);
				})
				.then((json) => {
					return this.populateModels(json);
				})
				.then((json) => {
					this.notifyModelChanges(ctx, "updated", json);
					return json;
				});
		},

		remove(ctx) {
			ctx.assertModelIsExist(ctx.t("app:EventNotFound"));

			return Venue.remove({
					_id: ctx.modelID
				})
				.then(() => {
					return ctx.model;
				})
				.then((json) => {
					this.notifyModelChanges(ctx, "removed", json);
					return json;
				});
		}

	},

	methods: {
		/**
		 * Validate params of context.
		 * We will call it in `create` and `update` actions
		 *
		 * @param {Context} ctx 			context of request
		 * @param {boolean} strictMode 		strictMode. If true, need to exists the required parameters
		 */
		validateParams(ctx, strictMode) {
			if (strictMode || ctx.hasParam("name"))
				ctx.validateParam("name").trim().notEmpty(ctx.t("app:EventNameCannotBeBlank")).end();

			// if (strictMode || ctx.hasParam("status"))
			// 	ctx.validateParam("status").isNumber();

			// ctx.validateParam("description").trim().end();
			// ctx.validateParam("address").trim().end();
			// ctx.validateParam("type").trim().end();

			if (ctx.hasValidationErrors())
				throw ctx.errorBadRequest(C.ERR_VALIDATION_ERROR, ctx.validationErrors);
		}
	},

	init(ctx) {
		// Fired when start the service
		this.personService = ctx.services("persons");
		this.weblinkService = ctx.services("weblinks");
	},

	socket: {
		afterConnection(socket, io) {
			// Fired when a new client connected via websocket
		}
	},

};
