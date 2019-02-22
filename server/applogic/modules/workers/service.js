"use strict";

let logger = require("../../../core/logger");
let config = require("../../../config");
let C = require("../../../core/constants");

let _ = require("lodash");

let Worker = require("./models/worker");

module.exports = {
	settings: {
		name: "workers",
		version: 1,
		namespace: "workers",
		rest: true,
		ws: true,
		graphql: true,
		permission: C.PERM_LOGGEDIN,
		role: "user",
		collection: Worker,

		modelPropFilter: "code title description role creater",
		modelPopulates: {
			"creater": "persons"
		}
	},

	actions: {
		find: {
			cache: false,
			handler(ctx) {
				let filter = {};

				let query = Worker.find(filter);
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
				ctx.assertModelIsExist(ctx.t("app:WorkerNotFound"));
				return Promise.resolve(ctx.model);
			}
		},

		create(ctx) {
			this.validateParams(ctx, true);


			let participant = new Worker({
				title: ctx.params.title,
				description: ctx.params.description,
				role: ctx.params.role,
				creater: ctx.user.id
			});

			return participant.save()
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
			ctx.assertModelIsExist(ctx.t("app:WorkerNotFound"));
			this.validateParams(ctx);


			return this.collection.findById(ctx.modelID).exec()
				.then((doc) => {
					if (ctx.params.title != null)
						doc.title = ctx.params.title;

					if (ctx.params.description != null)
						doc.description = ctx.params.description;

					if (ctx.params.role != null)
						doc.role = ctx.params.role;

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
			ctx.assertModelIsExist(ctx.t("app:WorkerNotFound"));

			return Worker.remove({
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
			if (strictMode || ctx.hasParam("title"))
				ctx.validateParam("title").trim().notEmpty(ctx.t("app:WorkerCannotBeBlank")).end();

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
	},

	socket: {
		afterConnection(socket, io) {
			// Fired when a new client connected via websocket
		}
	}
};
