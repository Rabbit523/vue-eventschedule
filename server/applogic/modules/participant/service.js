"use strict";

let logger = require("../../../core/logger");
let config = require("../../../config");
let C = require("../../../core/constants");

let _ = require("lodash");

let Participant = require("./models/participant");

module.exports = {
	settings: {
		name: "participants",
		version: 1,
		namespace: "participants",
		rest: true,
		ws: true,
		graphql: true,
		permission: C.PERM_LOGGEDIN,
		role: "user",
		collection: Participant,

		modelPropFilter: "code user email event registeredTimeStamp isRegistered registrationCode notes favoriteSession registeredSession seeNotRegisteredPopUp",
		modelPopulates: {
			"user": "persons",
			"event": "events",
			"favoriteSession": "eventsessions",
			"registeredSession": "eventsessions"
		}
	},

	actions: {
		find: {
			cache: false,
			handler(ctx) {
				let filter = {};

				let query = Participant.find(filter);
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
				ctx.assertModelIsExist(ctx.t("app:ParticipantNotFound"));
				return Promise.resolve(ctx.model);
			}
		},

		create(ctx) {
			this.validateParams(ctx, true);

			let event = this.eventService.decodeID(ctx.params.event);
			let user = this.personService.decodeID(ctx.params.user);
			let favoriteSession = [];
			let registeredSession = [];

			ctx.params.favoriteSession.forEach(element => {
				favoriteSession.push(this.eventSessionService.decodeID(element));
			});

			ctx.params.registeredSession.forEach(element => {
				registeredSession.push(this.eventSessionService.decodeID(element));
			});

			let participant = new Participant({
				user: user,
				event: event,
				favoriteSession: favoriteSession,
				registeredSession: registeredSession,
				seeNotRegisteredPopUp: ctx.params.seeNotRegisteredPopUp,
				notes: ctx.params.notes,
				registrationCode: ctx.params.registrationCode,
				isRegistered: ctx.params.isRegistered,
				registeredTimeStamp: ctx.params.registeredTimeStamp,
				email: ctx.params.email
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
			ctx.assertModelIsExist(ctx.t("app:ParticipantNotFound"));
			this.validateParams(ctx);

			let event = this.eventService.decodeID(ctx.params.event);
			let user = this.personService.decodeID(ctx.params.user);
			let favoriteSession = [];
			let registeredSession = [];

			ctx.params.favoriteSession.forEach(element => {
				favoriteSession.push(this.eventSessionService.decodeID(element));
			});

			ctx.params.registeredSession.forEach(element => {
				registeredSession.push(this.eventSessionService.decodeID(element));
			});

			return this.collection.findById(ctx.modelID).exec()
				.then((doc) => {

					if (user != null)
						doc.name = user;

					if (event != null)
						doc.event = event;

					if (favoriteSession != null)
						doc.favoriteSession = favoriteSession;

					if (registeredSession != null)
						doc.name = registeredSession;

					if (ctx.params.email != null)
						doc.email = ctx.params.email;

					if (ctx.params.registeredTimeStamp != null)
						doc.registeredTimeStamp = ctx.params.registeredTimeStamp;

					if (ctx.params.isRegistered != null)
						doc.isRegistered = ctx.params.isRegistered;

					if (ctx.params.registrationCode != null)
						doc.registrationCode = ctx.params.registrationCode;

					if (ctx.params.notes != null)
						doc.notes = ctx.params.notes;

					if (ctx.params.seeNotRegisteredPopUp != null)
						doc.seeNotRegisteredPopUp = ctx.params.seeNotRegisteredPopUp;

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
			ctx.assertModelIsExist(ctx.t("app:ParticipantNotFound"));

			return Participant.remove({
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
			if (strictMode || ctx.hasParam("email"))
				ctx.validateParam("email").trim().notEmpty(ctx.t("app:ParticipantCannotBeBlank")).end();

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
		this.eventSessionService = ctx.services("eventsessions");
		this.eventService = ctx.services("events");
	},

	socket: {
		afterConnection(socket, io) {
			// Fired when a new client connected via websocket
		}
	}
};
