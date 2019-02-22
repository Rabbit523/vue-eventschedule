"use strict";

let logger 		= require("../../../core/logger");
let config 		= require("../../../config");
let C 	 		= require("../../../core/constants");

let _			= require("lodash");

let Type 		= require("./models/sessiontype");

module.exports = {
	settings: {
		name: "sessiontypes",
		version: 1,
		namespace: "sessiontypes",
		rest: true,
		ws: true,
		graphql: true,
		permission: C.PERM_LOGGEDIN,
		role: "user",
		collection: Type,

		modelPropFilter: "code name color",
	},

	actions: {
		find: {
			cache: false,
			handler(ctx) {
				let filter = {};

				let query = Type.find(filter);
				return ctx.queryPageSort(query).exec().then( (docs) => {
					return this.toJSON(docs);
				});
			}
		},

		// return a model by ID
		get: {
			cache: true,
			handler(ctx) {
				ctx.assertModelIsExist(ctx.t("app:SessionTypeNotFound"));
				return Promise.resolve(ctx.model);
			}
		},

		create(ctx) {
			this.validateParams(ctx, true);
			let type = new Type({
				name: ctx.params.name,
				color: ctx.params.color
			});

			return type.save()
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
			ctx.assertModelIsExist(ctx.t("app:SessionTypeNotFound"));
			this.validateParams(ctx);

			return this.collection.findById(ctx.modelID).exec()
			.then((doc) => {

				if (ctx.params.name != null)
					doc.name = ctx.params.name;

				if (ctx.params.color != null)
					doc.color = ctx.params.color;

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
			ctx.assertModelIsExist(ctx.t("app:SessionTypeNotFound"));

			return Type.remove({ _id: ctx.modelID })
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
	},

	socket: {
		afterConnection(socket, io) {
			// Fired when a new client connected via websocket
		}
	},

};
