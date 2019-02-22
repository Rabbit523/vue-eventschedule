import toastr from "../../../core/toastr";
import {
	LOAD,
	LOADMORE,
	ADD,
	SELECT,
	CLEAR_SELECT,
	UPDATE,
	REMOVE,

	VENUEDISPLAY,
	SETSELECTEDVENUE,
	ADDVENUE,
	LOADVENUE,
	SETNEWVENUENAME,

	LOADSESSIONS,
	ADDSESSION,
	ISSESSION,
	SELECTSESSION,
	SETSELSESSION,

	LOADWEBLINKS,
	ADDWEBLINKS,
	WEBLINKDISPLAY,
	SELECTWEBLINK,
	SETSELWEBLINK,

	LOADSESSIONTYPES,
	ADDSESSIONTYPES,
	SESSIONTYPEDISPLAY,
	SELECTSESSIONTYPE,
	SETSELSESSIONTYPE,

	LOADPEOPLES,
	ADDPEOPLES,
	PEOPLEDISPLAY,
	SELECTPEOPLE,
	SETSELPEOPLE,
	WEBLINKPOPULATE,
	PEOPLEPOPULATE,
	VENUPOPULATE,
	SESSIONTYPEPOPULATE,
	UPDATE_EVENT,
	UPDATEEVENTPEOPLE,
	UPDATEEVENTWEBLINK,
	UPDATEEVENTVENUE,
	UPDATEEVENTSESSIONTYPE
} from "./types";

import {
	each,
	find,
	assign,
	remove,
	isArray
} from "lodash";

const state = {
	weblinkPopulate: "",
	venuePopulate: "",
	sessionTypePopulate: "",
	peoplePopulate: "",
	selectedVenue: {
		id: "",
		name: "",
		subname: "",
		description: "",
		address: "",
		city: "",
		country: "",
		zipcode: "",
		weblinks: [],
		leaflet: {
			long: "",
			lat: ""
		}
	},
	newVenue: {
		id: "",
		name: ""
	},

	weblink: {
		label: "",
		url: ""
	},

	sessiontype: {
		name: "",
		color: ""
	},

	people: {
		title: "",
		description: "",
		role: ""
	},

	selweblink: false,
	selsessiontype: false,
	selpeople: false,
	selsession: false,

	vsession: {
		dateStart: "",
		dateEnd: "",
		title: "",
		color: "",

		session: {
			name: "",
			subtitle: "",
			date: "",
			startTime: "",
			endTime: "",
			isPublished: false,
			description: "",
			weblinks: [],
			venue: "",
			sessionType: "",
			people: [],
			maxCapacity: "",
			warnCapacity: "",
			addOnPrice: "",
			event: ""
		}
	},

	sessions: [],
	weekgrounds: [],
	venues: [],
	weblinks: [],
	sessiontypes: [],
	peoples: [],
	venueDisplay: false,
	weblinkDisplay: false,
	sessiontypeDisplay: false,
	peopleDisplay: false,
	currentEvent: "",
	events: [],
	myEvents: [],
};

const mutations = {
	[LOAD](state, models) {
		state.events.splice(0);
		state.events.push(...models);
	},

	[LOADMORE](state, models) {
		if (models.add_events) {
			state.events.push(...models.data);
		} else {
			state.events.splice(0);
			state.events.push(...models.data);
		}
	},

	[ADD](state, model) {
		let found = find(state.events, (item) => item.code == model.code);
		if (!found) {
			state.currentEvent = model.code;
			state.events.push(model);

			let startdate = new Date(model.startDate);

			let enddate = new Date(model.endDate);

			let n = (enddate.getTime() - startdate.getTime()) / (3600 * 24 * 1000) + 1;


			// if (n < 7)
			// 	n = 7;
			let weeks = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

			let cur = startdate.getDay();

			state.sessions = [];
			state.weekgrounds = [];
			for (let i = 0; i < n; i++ , cur++) {
				state.sessions.push(new Array());
				state.weekgrounds.push(weeks[cur % 7]);
			}
		}
	},

	[UPDATE_EVENT](state, model) {
		let found = find(state.events, (item) => item.code == model.code);
		console.log(model)
		console.log(found)
		if (found) {
			found.name = model.name
			found.description = model.description
			found.startDate = model.startDate
			found.endDate = model.endDate
			found.weblinks = model.weblinks
		}
		console.log(found)
	},

	/////SESSIONS/////
	[LOADSESSIONS](state, sessions) {
		sessions.forEach(session => {
			// let t = {
			// 	dateStart: session.startTime.getHours() + ":" + session.startTime.getMinutes(),
			// 	dateEnd: session.endTime.getHours() + ":" + session.endTime.getMinutes(),
			// 	title: session.name
			// };
			let t = Date(session.startTime);
			// https://trello.com/c/V18BEb3d/2-validation

			// state.seesions.push(t);
		});
	},

	[ISSESSION](state, session) {
		state.vsession = session;
	},

	[ADDSESSION](state, model) {
		let found = find(state.events, (item) => item.code == model.event);
		if (found) {
			found.eventSessions.push(model.session);
		}
	},

	[SELECTSESSION](state, model) {
		var event = state.events.find((event) => {
			return event.code === model.event
		})

		var session = event.eventSessions.find((session) => {
			return session.code === model.code
		})

		session.addOnPrice = model.addOnPrice
		session.code = model.code
		session.creater = model.creater
		session.date = model.date
		session.description = model.description
		session.endTime = model.endTime
		session.isPublished = model.isPublished
		session.maxCapacity = model.maxCapacity
		session.warnCapacity = model.warnCapacity
		session.name = model.name
		session.participants = model.participants
		session.people = model.people
		session.sessionType = model.sessionType
		session.startTime = model.startTime
		session.subtitle = model.subtitle
		session.venue = model.venue
		session.waitlisted = model.waitlisted
		session.weblinks = model.weblinks
		event.eventSessions.forEach(sess => {
			if (sess.sessionType.code == session.sessionType.code) {
				sess.sessionType.color = session.sessionType.color;
				sess.sessionType.name = session.sessionType.name;
			}
		});
		// console.log("select session found", model.date);

		// let date = new Date(model.date);
		// let startdate = new Date(state.events[0].startDate);
		// let enddate = new Date(state.events[0].endDate);

		// let h = startdate.getHours();
		// let m = startdate.getMinutes();
		// let s = startdate.getSeconds();
		// let ms = startdate.getMilliseconds();
		// let l = (h * 3600 + m * 60 + s) * 1000 + ms;

		// let d = date.getTime() - (startdate.getTime() - l);

		// if (d < 0) {
		// 	toastr.error("invalued date!");
		// }

		// let n = Math.ceil(d / (3600 * 24 * 1000));


		// let obj = {
		// 	dateStart: model.startTime,
		// 	dateEnd: model.endTime,
		// 	title: model.name,
		// 	color: model.sessionType.color,

		// 	session: model
		// };

		// console.log(obj);
		// console.log("-------------------update ");
		// console.log(n);
		// state.sessions[n].push(obj);

		// state.vsession.session = "";
		// state.vsession = obj;
	},

	[SETSELSESSION](state, sync) {
		state.selsession = sync;
	},
	/////VENUE/////

	[LOADVENUE](state, venues) {
		state.venues.splice(0);
		state.venues.push(...venues);

		state.venues.forEach(element => {
			let temp = [];
			element.weblinks.forEach(el => {
				temp.push(el.code);
			});
			element.weblinks = [];
			element.weblinks = temp;
		});

		console.log("alllveneus:", state.venues);
	},

	[ADDVENUE](state, venue) {
		state.newVenue.id = "";
		state.newVenue.name = "";

		let temp = [];
		venue.weblinks.forEach(el => {
			temp.push(el.code);
		});
		venue.weblinks = [];
		venue.weblinks = temp;
		state.venues.push(venue);
	},

	[SETNEWVENUENAME](state, newVenue) {
		state.newVenue = newVenue;
	},

	[SETSELECTEDVENUE](state, venue) {
		state.newVenue.id = "";
		state.newVenue.name = "";
		state.selectedVenue = Object.assign({}, venue);
		console.log(state.selectedVenue);
	},

	[VENUEDISPLAY](state, display) {
		state.venueDisplay = display;
	},

	/////WEBLINKS FUNC/////

	[LOADWEBLINKS](state, weblinks) {
		state.weblinks.splice(0);
		state.weblinks.push(...weblinks);
		// var temp = [];
		// state.weblinks.forEach(el => {
		// 	temp.push(el.code);
		// });
		// state.weblinks = [];
		// state.weblinks = temp;
	},

	[ADDWEBLINKS](state, model) {
		let found = find(state.weblinks, (item) => item.code == model.code);

		if (!found) {

			state.weblinks.push(model);

		}
	},

	[WEBLINKDISPLAY](state, display) {
		state.weblinkDisplay = display;
	},

	[SELECTWEBLINK](state, weblink) {
		state.selweblink = true;
		state.weblink = Object.assign({}, weblink);
		console.log(state.weblink);
	},

	[SETSELWEBLINK](state, sync) {
		state.selweblink = sync;
	},

	/////SESSIONTYPE FUNC/////

	[LOADSESSIONTYPES](state, sessiontypes) {
		state.sessiontypes.splice(0);
		state.sessiontypes.push(...sessiontypes);
		// var temp = [];
		// state.weblinks.forEach(el => {
		// 	temp.push(el.code);
		// });
		// state.weblinks = [];
		// state.weblinks = temp;
	},

	[ADDSESSIONTYPES](state, model) {
		let found = find(state.sessiontypes, (item) => item.code == model.code);

		if (!found) {
			state.sessiontypes.push(model);
		}
	},

	[SESSIONTYPEDISPLAY](state, display) {
		state.sessiontypeDisplay = display;
	},

	[SELECTSESSIONTYPE](state, sessiontype) {
		state.selsessiontype = true;
		state.sessiontype = Object.assign({}, sessiontype);
		console.log(state.sessiontype);
	},

	[SETSELSESSIONTYPE](state, sync) {
		state.selsessiontype = sync;
	},

	/////PEOPLES FUNC/////

	[LOADPEOPLES](state, peoples) {
		state.peoples.splice(0);
		state.peoples.push(...peoples);
	},

	[ADDPEOPLES](state, model) {
		let found = find(state.peoples, (item) => item.code == model.code);
		if (!found) {
			state.peoples.push(model);
		}
	},

	[PEOPLEDISPLAY](state, display) {
		state.peopleDisplay = display;
	},

	[UPDATEEVENTPEOPLE](state, model) {
		let event = find(state.events, (item) => item.code == model.ecode)
		event.eventSessions.forEach(session => {
			session.people.forEach(person => {
				if (person.code == model.people.code) {
					person.description = model.people.description;
					person.role = model.people.role;
					person.title = model.people.title;
				}
			});
		});
	},

	[UPDATEEVENTWEBLINK](state, model) {
		let event = find(state.events, (item) => item.code == model.ecode)
		event.eventSessions.forEach(session => {
			session.weblinks.forEach(weblink => {
				if (weblink.code == model.weblink.code) {
					weblink.label = model.weblink.label;
					weblink.url = model.weblink.url;
				}
			});
		});
		event.weblinks.forEach(weblink => {
			if (weblink.code == model.weblink.code) {
				weblink.label = model.weblink.label;
				weblink.url = model.weblink.url;
			}
		});
	},

	[UPDATEEVENTSESSIONTYPE](state, model) {
		let event = find(state.events, (item) => item.code == model.ecode)
		event.eventSessions.forEach(session => {
			if (session.sessionType.code == model.sessionType.code) {
				session.sessionType.color = model.sessionType.color;
				session.sessionType.name = model.sessionType.name;
			}
		});
	},

	[UPDATEEVENTVENUE](state, model) {
		let event = find(state.events, (item) => item.code == model.ecode)
		event.eventSessions.forEach(session => {
			if (session.venue.code == model.venue.code) {
				session.venue.address = model.venue.address
				session.venue.city = model.venue.city
				session.venue.code = model.venue.code
				session.venue.country = model.venue.country
				session.venue.description = model.venue.description
				session.venue.leaflet = model.venue.leaflet
				session.venue.name = model.venue.name
				session.venue.subname = model.venue.subname
				session.venue.weblinks = Object.assign({}, model.venue.weblinks)
				session.venue.zipcode = model.venue.zipcode
			}
		});
	},

	[SELECTPEOPLE](state, people) {
		state.selpeople = true;
		state.people = Object.assign({}, people);
		let found = find(state.peoples, (item) => item.code == people.code);
		if (found) {
			found = people
		}
	},

	[SETSELPEOPLE](state, sync) {
		state.selpeople = sync;
	},

	[WEBLINKPOPULATE](state, payload) {
		state.weblinkPopulate = payload
	},

	[PEOPLEPOPULATE](state, payload) {
		state.peoplePopulate = payload
	},

	[VENUPOPULATE](state, payload) {
		state.venuePopulate = payload
	},

	[SESSIONTYPEPOPULATE](state, payload) {
		state.sessionTypePopulate = payload
	}
};

import * as getters from "./getters";
import * as actions from "./actions";


export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
};
