"use strict";

let logger = require("../../../core/logger");
let config = require("../../../config");
let C = require("../../../core/constants");

let _ = require("lodash");

let AddOnsBought = require("./models/addonsbought");

module.exports = {
	settings: {
		name: "addonsboughts",
		version: 1,
		namespace: "addonsboughts",
		rest: true,
		ws: true,
		graphql: true,
		permission: C.PERM_LOGGEDIN,
		role: "user",
		collection: AddOnsBought,

		modelPropFilter: "ticketCode email participant remainingCount",
		modelPopulates: {
			"participant": "participants"
		}
	},

	actions: {
		find: {
			cache: true,
			handler(ctx) {
				let filter = {};
				let query = AddOnsBought.find(filter);
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
				ctx.assertModelIsExist(ctx.t("app:AddOnsBoughtNotFound"));
				return Promise.resolve(ctx.model);
			}
		},

		create(ctx) {
			this.validateParams(ctx, true);
			let participant = null;
			if (ctx.params.participant) {
				participant = this.participantService.decodeID(ctx.params.participant);
			}
			this.collection.find({ ticketCode: ctx.params.ticketCode }).sort({ createdAt: -1 }).exec()
				.then((doc) => {
					if (doc == undefined) {
						console.log("undefined");
					} else {
						console.log(doc);
					}
				});
			let addonsbought = new AddOnsBought({
				ticketCode: ctx.params.ticketCode,
				email: ctx.params.email,
				participant: participant
			});

			return addonsbought.save()
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
			ctx.assertModelIsExist(ctx.t("app:AddOnsBoughtNotFound"));
			this.validateParams(ctx);
			return this.collection.findById(ctx.modelID).exec()
				.then((doc) => {

					if (ctx.params.ticketCode != null)
						doc.ticketCode = ctx.params.ticketCode;

					if (ctx.params.email != null)
						doc.email = ctx.params.email;

					if (ctx.params.participant != null)
						doc.participant = ctx.params.participant;

					if (ctx.params.remainingCount != null)
						doc.remainingCount = ctx.params.remainingCount;

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
			ctx.assertModelIsExist(ctx.t("app:AddOnsBoughtNotFound"));
			return AddOnsBought.remove({ _id: ctx.modelID })
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
			if (strictMode || ctx.hasParam("email"))
				ctx.validateParam("email").trim().notEmpty(ctx.t("app:AddOnsBoughtCannotBeBlank")).end();

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
		this.participantService = ctx.services("participants");
	}

};
