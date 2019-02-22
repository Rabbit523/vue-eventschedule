"use strict";

let logger = require("../../../core/logger");
let config = require("../../../config");
let C = require("../../../core/constants");

let _ = require("lodash");

let Event = require("./models/event");

module.exports = {
	settings: {
		name: "events",
		version: 1,
		namespace: "events",
		rest: true,
		ws: true,
		graphql: true,
		permission: C.PERM_LOGGEDIN,
		role: "user",
		collection: Event,

		modelPropFilter: "code name isPublished creater administrators description startDate endDate eventSessions weblinks",
		modelPopulates: {
			"creater": "persons",
			"weblinks": "weblinks",
			"eventSessions": "eventsessions"
		}
	},

	actions: {
		find: {
			cache: false,
			handler(ctx) {
				let page_size = ctx.params.page_size;
				let page_num = ctx.params.page_num;
				let filter = {}
				
				if (ctx.params.creater) {
					let creater = this.personService.decodeID(ctx.params.creater.code)
					filter = { creater: ctx.params.my_events ? { $eq: creater } : { $ne: creater } };
				}

				let query = Event.find(filter);
				return ctx.queryPageSort(query).skip(page_size * page_num).limit(page_size).exec().then((docs) => {
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
				ctx.assertModelIsExist(ctx.t("app:EventNotFound"));
				return Promise.resolve(ctx.model);
			}
		},

		create(ctx) {
			this.validateParams(ctx, true);
			let weblinks = [];
			let eventSessions = [];

			if (ctx.params.weblinks) {
				ctx.params.weblinks.forEach(element => {
					weblinks.push(this.weblinkService.decodeID(element.code));
				});
			}

			if (ctx.params.eventSessions) {
				ctx.params.eventSessions.forEach(element => {
					eventSessions.push(this.eventSessionService.decodeID(element.code));
				});
			}

			let event = new Event({
				name: ctx.params.name,
				description: ctx.params.description,
				startDate: ctx.params.startDate,
				endDate: ctx.params.endDate,
				isPublished: ctx.params.isPublished,
				weblinks: weblinks,
				eventSessions: eventSessions,
				creater: ctx.user.id
			});
			return event.save()
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
			ctx.assertModelIsExist(ctx.t("app:EventNotFound"));
			this.validateParams(ctx);

			let weblinks = [];
			let eventSessions = [];

			if (ctx.params.weblinks) {
				ctx.params.weblinks.forEach(element => {
					weblinks.push(this.weblinkService.decodeID(element.code));
				});
			}

			if (ctx.params.eventSessions) {
				ctx.params.eventSessions.forEach(element => {
					eventSessions.push(this.eventSessionService.decodeID(element));
				});
			}

			return this.collection.findById(ctx.modelID).exec()
				.then((doc) => {

					if (ctx.params.name != null)
						doc.name = ctx.params.name;

					if (ctx.params.description != null)
						doc.description = ctx.params.description;

					if (ctx.params.startDate != null)
						doc.startDate = ctx.params.startDate;

					if (ctx.params.description != null)
						doc.endDate = ctx.params.endDate;

					if (weblinks.length > 0)
						doc.weblinks = weblinks;

					if (eventSessions.length > 0)
						doc.eventSessions = eventSessions;

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
			ctx.assertModelIsExist(ctx.t("app:EventNotFound"));

			return Event.remove({
				_id: ctx.modelID
			})
				.then(() => {
					return ctx.model;
				})
				.then((json) => {
					this.notifyModelChanges(ctx, "removed", json);
					return json;
				});
		},
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
		this.venueService = ctx.services("venues");
		this.eventSessionService = ctx.services("eventsessions");
	},

	socket: {
		afterConnection(socket, io) {
			// Fired when a new client connected via websocket
		}
	},

	graphql: {

		query: `
			events(limit: Int, offset: Int, sort: String): [Event]
			event(code: String): Event
		`,

		types: `
			type Event {
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
			eventCreate(name: String!, isPublished: Boolean, administrators: String, description: String, startDate: Timestamp, endDate: Timestamp, eventSessions: String, tags: String): Event
			eventUpdate(code: String!, name: String, description: String, isPublished: Boolean): Event
			eventRemove(code: String!): Event
		`,

		resolvers: {
			Query: {
				events: "find",
				event: "get"
			},

			Mutation: {
				eventCreate: "create",
				eventUpdate: "update",
				eventRemove: "remove"
			}
		}
	}

};

/*
## GraphiQL test ##

# Find all devices
query getDevices {
  devices(sort: "lastCommunication", limit: 5) {
    ...deviceFields
  }
}

# Create a new device
mutation createDevice {
  deviceCreate(name: "New device", address: "192.168.0.1", type: "raspberry", description: "My device", status: 1) {
    ...deviceFields
  }
}

# Get a device
query getDevice($code: String!) {
  device(code: $code) {
    ...deviceFields
  }
}

# Update an existing device
mutation updateDevice($code: String!) {
  deviceUpdate(code: $code, address: "127.0.0.1") {
    ...deviceFields
  }
}

# Remove a device
mutation removeDevice($code: String!) {
  deviceRemove(code: $code) {
    ...deviceFields
  }
}

fragment deviceFields on Device {
    code
    address
    type
    name
    description
    status
    lastCommunication
}

*/
