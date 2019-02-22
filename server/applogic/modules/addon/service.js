"use strict";

let logger = require("../../../core/logger");
let config = require("../../../config");
let C = require("../../../core/constants");

let _ = require("lodash");

let AddOn = require("./models/addon");

module.exports = {
	settings: {
		name: "addons",
		version: 1,
		namespace: "addons",
		rest: true,
		ws: true,
		graphql: true,
		permission: C.PERM_LOGGEDIN,
		role: "user",
		collection: AddOn,

		modelPropFilter: "code limited restrictedRegistration ticketCode ticketName validSessionIDs amount",
		modelPopulates: {
			"validSessionIDs": "eventsessions"
		}
	},

	actions: {
		find: {
			cache: true,
			handler(ctx) {
				let filter = {};
				let query = AddOn.find(filter);
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
				ctx.assertModelIsExist(ctx.t("app:AddOnNotFound"));
				return Promise.resolve(ctx.model);
			}
		},

		create(ctx) {
			this.validateParams(ctx, true);

			let addon = new AddOn({
				ticketCode: ctx.params.ticketCode,
				limited: ctx.params.limited,
				restrictedRegistration: ctx.params.restrictedRegistration,
				ticketName: ctx.params.ticketName,
				amount: ctx.params.amount
			});

			return addon.save()
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

					if (ctx.params.limited != null)
						doc.limited = ctx.params.limited;

					if (ctx.params.restrictedRegistration != null)
						doc.restrictedRegistration = ctx.params.restrictedRegistration;

					if (ctx.params.ticketName != null)
						doc.ticketName = ctx.params.ticketName;

					if (ctx.params.amount != null)
						doc.amount = ctx.params.amount;

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
			return AddOn.remove({
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
			if (strictMode || ctx.hasParam("ticketName"))
				ctx.validateParam("ticketName").trim().notEmpty(ctx.t("app:AddOnsCannotBeBlank")).end();

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
	}

};
