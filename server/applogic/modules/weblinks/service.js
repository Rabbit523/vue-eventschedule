"use strict";

let logger = require("../../../core/logger");
let config = require("../../../config");
let C = require("../../../core/constants");

let _ = require("lodash");

let Weblink = require("./models/Weblink");

module.exports = {
	settings: {
		name: "weblinks",
		version: 1,
		namespace: "weblinks",
		rest: true,
		ws: true,
		graphql: true,
		permission: C.PERM_LOGGEDIN,
		role: "user",
		collection: Weblink,

		modelPropFilter: "code label url creater",
		modelPopulates: {
			"creater": "persons"
		}
	},

	actions: {
		find: {
			cache: false,
			handler(ctx) {
				let filter = {};
				let query = Weblink.find(filter);
				return ctx.queryPageSort(query).exec().then((docs) => {
					return this.toJSON(docs);
				});
			}
		},

		// return a model by ID
		get: {
			cache: true,
			handler(ctx) {
				ctx.assertModelIsExist(ctx.t("app:WeblinkNotFound"));
				return Promise.resolve(ctx.model);
			}
		},

		create(ctx) {
			this.validateParams(ctx, true);
			let weblink = new Weblink({
				label: ctx.params.label,
				url: ctx.params.url,
				creater: ctx.user.id
			});

			return weblink.save()
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
			ctx.assertModelIsExist(ctx.t("app:WeblinkNotFound"));
			this.validateParams(ctx);
			return this.collection.findById(ctx.modelID).exec()
				.then((doc) => {

					if (ctx.params.label != null)
						doc.label = ctx.params.label;

					if (ctx.params.url != null)
						doc.url = ctx.params.url;

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
			ctx.assertModelIsExist(ctx.t("app:WeblinkNotFound"));
			return Weblink.remove({ _id: ctx.modelID })
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
			if (strictMode || ctx.hasParam("label"))
				ctx.validateParam("label").trim().notEmpty(ctx.t("app:WeblinkLabelCannotBeBlank")).end();

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
