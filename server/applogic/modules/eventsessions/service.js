"use strict";

let logger = require("../../../core/logger");
let config = require("../../../config");
let C = require("../../../core/constants");

let _ = require("lodash");

let EventSession = require("./models/session");
let Event = require("../events/models/event");

module.exports = {
	settings: {
		name: "eventsessions",
		version: 1,
		namespace: "eventsessions",
		rest: true,
		ws: true,
		graphql: true,
		permission: C.PERM_LOGGEDIN,
		role: "user",
		collection: EventSession,

		modelPropFilter: "code name isPublished creater subtitle date startTime endTime description maxCapacity warnCapacity participants waitlisted venue weblinks sessionType addOnPrice people",
		modelPopulates: {
			"creater": "persons",
			"venue": "venues",
			"weblinks": "weblinks",
			"sessionType": "sessiontypes",
			"people": "workers",
			"participants": "persons"
		}
	},

	actions: {
		find: {
			cache: false,
			handler(ctx) {
				let filter = {};

				let query = EventSession.find(filter);
				return ctx.queryPageSort(query).exec().then((docs) => {
					return this.toJSON(docs);
				}).then((json) => {
					let promises = [];
					json.forEach(element => {
						let session = this.eventSessionService.decodeID(element.code);
						promises.push(
							Event.find({
								eventSessions: session
							}).then((doc) => {
								if (doc[0]) {
									element.startDate = doc[0].startDate;
									element.endDate = doc[0].endDate;
								}
							})
						);
					});
					return Promise.all(promises).then(() => {
						return this.populateModels(json);
					});
				});
			}
		},

		// return a model by ID
		get: {
			cache: true,
			handler(ctx) {
				ctx.assertModelIsExist(ctx.t("app:EventSessionNotFound"));
				return Promise.resolve(ctx.model);
			}
		},

		create(ctx) {
			this.validateParams(ctx, true);
			let weblinks = [];
			let sessionType;

			if (ctx.params.weblinks) {
				ctx.params.weblinks.forEach(element => {
					weblinks.push(this.weblinkService.decodeID(element.code));
				});
			}

			let venue = this.venueService.decodeID(ctx.params.venue.code);

			if (ctx.params.sessionType) {
				sessionType = this.sessionTypeService.decodeID(ctx.params.sessionType.code);
			}

			let people = [];
			if (ctx.params.people) {
				ctx.params.people.forEach(element => {
					people.push(this.peopleService.decodeID(element.code));
				});
				// people = this.peopleService.decodeID(ctx.params.people.code);
			}

			let eventId = this.eventService.decodeID(ctx.params.event);

			let eventSession = new EventSession({
				name: ctx.params.name,
				subtitle: ctx.params.subtitle,
				creater: ctx.user.id,
				date: ctx.params.date,
				startTime: ctx.params.startTime,
				endTime: ctx.params.endTime,
				isPublished: ctx.params.isPublished,
				description: ctx.params.description,
				weblinks: weblinks,
				venue: venue,
				people: people,
				sessionType: sessionType,
				maxCapacity: ctx.params.maxCapacity,
				warnCapacity: ctx.params.warnCapacity,
				addOnPrice: ctx.params.addOnPrice,
				event: eventId
			});

			return eventSession.save()
				.then((doc) => {
					return this.toJSON(doc);
				})
				.then((json) => {
					return this.populateModels(json);
				})
				.then((json) => {
					this.notifyModelChanges(ctx, "created", json);
					return json;
				})
				.then((json) => {
					let sessionId = this.eventSessionService.decodeID(json.code);
					return Event.findByIdAndUpdate(eventId, {
						$push: {
							eventSessions: sessionId
						}
					})
						.then((data) => {
							return json;
						});
				});
		},

		registerSession(ctx) {
			ctx.assertModelIsExist(ctx.t("app:EventSessionNotFound"));
			this.validateParams(ctx);

			let participants = [];
			if (ctx.params.participants) {
				ctx.params.participants.forEach(element => {
					participants.push(this.personService.decodeID(element.code));
				});
			}


			return this.collection.findById(ctx.modelID).exec()
				.then((doc) => {
					let waitlisted = [];
					if (participants.length > doc.maxCapacity) {
						waitlisted = participants.splice(doc.maxCapacity);
					}
					if (ctx.params.participants != null)
						doc.participants = participants;

					if (waitlisted.length) {
						doc.waitlisted = waitlisted;
					}

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
		update(ctx) {
			ctx.assertModelIsExist(ctx.t("app:EventSessionNotFound"));
			this.validateParams(ctx);
			let weblinks = [];
			let sessionType = [];

			if (ctx.params.weblinks) {
				ctx.params.weblinks.forEach(element => {
					weblinks.push(this.weblinkService.decodeID(element));
				});
			}

			let venue = this.venueService.decodeID(ctx.params.venue.code);

			if (ctx.params.sessionType) {
				sessionType = this.sessionTypeService.decodeID(ctx.params.sessionType.code);
			}

			let people = [];
			if (ctx.params.people) {
				ctx.params.people.forEach(element => {
					people.push(this.peopleService.decodeID(element.code));
				});
			}

			let participants = [];
			if (ctx.params.participants) {
				ctx.params.participants.forEach(element => {
					participants.push(this.personService.decodeID(element.code));
				});
			}

			return this.collection.findById(ctx.modelID).exec()
				.then((doc) => {

					if (ctx.params.name != null)
						doc.name = ctx.params.name;

					if (ctx.params.subtitle != null)
						doc.subtitle = ctx.params.subtitle;

					if (ctx.params.isPublished != null)
						doc.isPublished = ctx.params.isPublished;

					if (ctx.params.date != null)
						doc.date = ctx.params.date;

					if (ctx.params.startTime != null)
						doc.startTime = ctx.params.startTime;

					if (ctx.params.endTime != null)
						doc.endTime = ctx.params.endTime;

					if (ctx.params.description != null)
						doc.description = ctx.params.description;

					if (ctx.params.maxCapacity != null)
						doc.maxCapacity = ctx.params.maxCapacity;

					if (ctx.params.participants != null)
						doc.participants = participants;

					if (ctx.params.waitlisted != null)
						doc.waitlisted = ctx.params.waitlisted;

					if (ctx.params.venue != null)
						doc.venue = venue;

					if (ctx.params.weblinks != null)
						doc.weblinks = weblinks;

					if (ctx.params.sessionType != null)
						doc.sessionType = sessionType;

					if (ctx.params.people != null)
						doc.people = people;

					if (ctx.params.addOnPrice != null)
						doc.addOnPrice = ctx.params.addOnPrice;

					if (ctx.params.isPublished != null)
						doc.isPublished = ctx.params.isPublished;
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

		selupdate(ctx) {
			ctx.assertModelIsExist(ctx.t("app:EventSessionNotFound"));
			this.validateParams(ctx);
			let weblinks = [];

			if (ctx.params.weblinks) {
				ctx.params.weblinks.forEach(element => {
					weblinks.push(this.weblinkService.decodeID(element.code));
				});
			}
			let venue = this.venueService.decodeID(ctx.params.venue.code);

			let sessionType = [];
			if (ctx.params.sessionType) {
				sessionType = this.sessionTypeService.decodeID(ctx.params.sessionType.code);
			}

			let people = [];
			if (ctx.params.people) {
				ctx.params.people.forEach(element => {
					people.push(this.peopleService.decodeID(element.code));
				});
			}
			let participants = [];
			if (ctx.params.participants) {
				ctx.params.participants.forEach(element => {
					participants.push(this.peopleService.decodeID(element.code));
				});
			}
			return this.collection.findById(ctx.modelID).exec()
				.then((doc) => {

					if (ctx.params.name != null)
						doc.name = ctx.params.name;

					if (ctx.params.subtitle != null)
						doc.subtitle = ctx.params.subtitle;

					if (ctx.params.isPublished != null)
						doc.isPublished = ctx.params.isPublished;

					if (ctx.params.date != null)
						doc.date = ctx.params.date;

					if (ctx.params.startTime != null)
						doc.startTime = ctx.params.startTime;

					if (ctx.params.endTime != null)
						doc.endTime = ctx.params.endTime;

					if (ctx.params.description != null)
						doc.description = ctx.params.description;

					if (ctx.params.maxCapacity != null)
						doc.maxCapacity = ctx.params.maxCapacity;

					if (ctx.params.warnCapacity != null)
						doc.warnCapacity = ctx.params.warnCapacity;

					if (ctx.params.participants != null)
						doc.participants = ctx.params.participants;

					if (ctx.params.waitlisted != null)
						doc.waitlisted = ctx.params.waitlisted;

					if (ctx.params.venue != null)
						doc.venue = venue;

					if (ctx.params.weblinks != null)
						doc.weblinks = weblinks;

					if (ctx.params.sessionType != null)
						doc.sessionType = sessionType;

					if (ctx.params.people != null)
						doc.people = people;

					if (ctx.params.addOnPrice != null)
						doc.addOnPrice = ctx.params.addOnPrice;

					if (ctx.params.isPublished != null)
						doc.isPublished = ctx.params.isPublished;
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
			ctx.assertModelIsExist(ctx.t("app:EventSessionNotFound"));

			return EventSession.remove({
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
				ctx.validateParam("name").trim().notEmpty(ctx.t("app:EventSessionNameCannotBeBlank")).end();

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
		this.eventService = ctx.services("events");
		this.eventSessionService = ctx.services("eventsessions");
		this.venueService = ctx.services("venues");
		this.weblinkService = ctx.services("weblinks");
		this.sessionTypeService = ctx.services("sessiontypes");
		this.peopleService = ctx.services("workers");
		this.personService = ctx.services("persons");
	},

	socket: {
		afterConnection(socket, io) {
			// Fired when a new client connected via websocket
		}
	},

	graphql: {

		query: `
			sessions(limit: Int, offset: Int, sort: String): [EventSession]
			session(code: String): EventSession
		`,

		types: `
			type EventSession {
				code: String!
				name: String
				isPublished: Boolean
				creater: Person!
				administrators: [String]
				description: String
				startDate: Timestamp
				endDate: Timestamp
				eventSessions: String
				tags: String
			}
		`,

		mutation: `
			sessionCreate(name: String!, isPublished: Boolean, administrators: String, description: String, startDate: Timestamp, endDate: Timestamp, eventSessions: String, tags: String): Event
			sessionUpdate(code: String!, name: String, description: String, isPublished: Boolean): Event
			sessionRemove(code: String!): Event
		`,

		resolvers: {
			Query: {
				sessions: "find",
				session: "get"
			},

			Mutation: {
				sessionCreate: "create",
				sessionUpdate: "update",
				sessionRemove: "remove"
			}
		}
	}

};
