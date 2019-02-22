import Vue from "vue";
import toastr from "../../../core/toastr";
import Service from "../../../core/service";
import {
	LOAD,
	LOADMORE,
	ADD,
	SELECT,
	CLEAR_SELECT,
	UPDATE,
	REMOVE,

	WEBLINKPOPULATE,
	PEOPLEPOPULATE,
	VENUPOPULATE,
	SESSIONTYPEPOPULATE,
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
	UPDATE_EVENT,

	UPDATEEVENTPEOPLE,
	UPDATEEVENTWEBLINK,
	UPDATEEVENTVENUE,
	UPDATEEVENTSESSIONTYPE

} from "./types";
import axios from "axios";

export const NAMESPACE = "/api/events";

let eventService = new Service("events");
let sessionService = new Service("eventsessions");
let venueService = new Service("venues");
let weblinkService = new Service("weblinks");
let sessionTypeService = new Service("sessiontypes");
let peopleService = new Service("workers");

export const downloadEvents = ({ commit }) => {
	eventService.rest("find").then((data) => {
		if (data) {
			commit(LOAD, data);
		} else {
			toastr.error("Request error!");
		}
	}).catch((err) => {
		toastr.error(err.message);
	});
};

export const downloadMoreEvents = ({ commit }, model) => {
	eventService.rest("find", model).then((data) => {
		commit(LOADMORE, { data, add_events: model.add_events });
	}).catch((err) => {
		toastr.error(err.message);
	});
}


export const saveEvent = ({ commit }, model) => {

	model.data.startDate = model.data.date[0];
	model.data.endDate = model.data.date[1];


	if (!model.data.startDate || !model.data.endDate || !model.data.name) {
		if (!model.data.startDate) {
			toastr.info("Please input Start Date");
		}
		if (!model.data.endDate) {
			toastr.info("Please input End Date");
		}
		if (!model.data.name) {
			toastr.info("Please input Name");
		}
		return;
	}

	let obj = {
		startDate: model.data.startDate,
		endDate: model.data.endDate,
		description: model.data.description,
		name: model.data.name,
		weblinks: model.data.weblinks,
		image: model.data.image
	};
	if (model.data.code !== undefined) {
		obj.code = model.data.code
		eventService.rest("update", obj).then((data) => {
			if (data) {
				commit(UPDATE_EVENT, obj);
				model.router.push("/");
				toastr.success("Updated Event successfuly");
			} else {
				toastr.error("Request error!");
			}
		}).catch((err) => {
			toastr.error(err.message);
		});
	} else {
		eventService.rest("create", obj).then((data) => {
			if (data) {
				commit(ADD, data);
				model.router.push("schedule/" + data.code);
				toastr.success("Created Event successfuly");
			} else {
				toastr.error("Request error!");
			}
		}).catch((err) => {
			toastr.error(err.message);
		});
	}
};

///////Sessions/////////
export const loadSessions = ({ commit }) => {
	sessionService.rest("find").then((data) => {
		commit(LOADSESSIONS, data);
	}).catch((err) => {
		toastr.error(err.message);
	});
};

export const saveSession = ({ commit }, model) => {

	if (!model.session.date || !model.session.startTime || !model.session.endTime || !model.session.name || !model.session.venue || !model.session.sessionType) {
		if (!model.session.date) {
			toastr.info("Please input correct date");
		}
		if (!model.session.startTime) {
			toastr.info("Please input session start time");
		}
		if (!model.session.endTime) {
			toastr.info("Please input session end time");
		}
		if (!model.session.name) {
			toastr.info("Please input session name");
		}
		if (!model.session.venue) {
			toastr.info("Please select a venue");
		}
		if (!model.session.sessionType) {
			toastr.info("Please select a session type");
		}
		return;
	}

	sessionService.rest("create", model.session).then((data) => {
		model.router.push("/schedule/" + model.session.event);
		commit(ADDSESSION, { session: data, event: model.session.event });
		toastr.success("Created Session successfuly");
	}).catch((err) => {
		toastr.error(err.message);
	});
};


export const updateSession = ({ commit }, model) => {

	if (!model.session.date || !model.session.startTime || !model.session.endTime || !model.session.name || !model.session.venue || !model.session.sessionType) {
		if (!model.session.date) {
			toastr.info("Please input correct date");
		}
		if (!model.session.startTime) {
			toastr.info("Please input session start time");
		}
		if (!model.session.endTime) {
			toastr.info("Please input session end time");
		}
		if (!model.session.name) {
			toastr.info("Please input session name");
		}
		if (!model.session.venue) {
			toastr.info("Please select a venue");
		}
		if (!model.session.sessionType) {
			toastr.info("Please select a session type");
		}
		return;
	}

	sessionService.rest("selupdate", model.session).then((data) => {
		model.router.go(-1);
		commit(SELECTSESSION, { ...data, event: model.session.event });
		toastr.success("Update Session successfuly");
	}).catch((err) => {
		toastr.error(err.message);
	});
};

export const registerSession = ({ commit }, payload) => {
	sessionService.rest("registerSession", payload).then((data) => {
		console.log(data);
	}).catch((err) => {
		toastr.error(err.message);
	})
}

export const isSession = ({ commit }, model) => {

	commit(ISSESSION, model);

};

export const setselSession = ({ commit }, sync) => {
	commit(SETSELSESSION, sync);
};

export const loadVenue = ({ commit }) => {
	venueService.rest("find").then((data) => {
		commit(LOADVENUE, data);
	}).catch((err) => {
		toastr.error(err.message);
	});
};

export const setVenueDisplay = ({ commit }, display) => {
	commit(VENUEDISPLAY, display);
};

export const setNewVenue = ({ commit }, venue) => {
	if (venue.id != "newVenue") {
		venueService.rest("create", venue).then((data) => {
			commit(ADDVENUE, data);
			commit(SETSELECTEDVENUE, data);

			toastr.success("Created Venue successfuly");
		}).catch((err) => {
			toastr.error(err.message);
		});
	} else {
		commit(SETNEWVENUENAME, venue);
	}
};

export const setSelectedVenue = ({ commit }, venue) => {

	if (venue.id == "updated") {
		venueService.rest("update", venue).then((data) => {
			commit(SETSELECTEDVENUE, data);
			toastr.success("Updated Venue successfuly");
		}).catch((err) => {
			toastr.error("Updated Venue Failed");
		});
	} else {
		commit(SETSELECTEDVENUE, venue);
	}
};


export const updateEventVenue = ({ commit }, model) => {
	venueService.rest("update", model.venue).then((data) => {
		commit(UPDATEEVENTVENUE, model);
		toastr.success("Updated Venue successfuly");
	}).catch((err) => {
		toastr.error("Updated Venue Failed");
	});

}

/////////weblinks/////////
export const loadWeblinks = ({ commit }) => {
	weblinkService.rest("find").then((data) => {
		commit(LOADWEBLINKS, data);
	}).catch((err) => {
		toastr.error(err.message);
	});
};

export const saveWeblink = ({ commit }, model) => {

	var _model = {
		label: model.label,
		url: model.url
	};

	weblinkService.rest("create", _model).then((data) => {
		if (data) {
			commit(ADDWEBLINKS, data);
			commit(SELECTWEBLINK, data);

			toastr.success("Created Weblink successfuly");
		} else {
			toastr.error("Request error!");
		}
	}).catch((err) => {
		toastr.error(err.message);
	});
};

export const updateWeblink = ({ commit }, model) => {

	weblinkService.rest("update", model).then((data) => {
		if (data) {
			commit(SELECTWEBLINK, data);
			toastr.success("Update Weblink successfuly");
		} else {
			toastr.error("Request error!");
		}
	}).catch((err) => {
		toastr.error(err.message);
	});
};

export const updateEventWeblink = ({ commit }, model) => {
	weblinkService.rest("update", model.weblink).then((data) => {
		if (data) {
			commit(UPDATEEVENTWEBLINK, model);
			toastr.success("Update Weblink successfuly");
		} else {
			toastr.error("Request error!");
		}
	}).catch((err) => {
		toastr.error(err.message);
	});
}

export const setWeblinkDisplay = ({ commit }, display) => {
	commit(WEBLINKDISPLAY, display);
};

export const selectWeblink = ({ commit }, weblink) => {
	commit(SELECTWEBLINK, weblink);
};

export const setselWeblink = ({ commit }, sync) => {
	commit(SETSELWEBLINK, sync);
};

/////////SessionType/////////
export const loadSessionTypes = ({ commit }) => {
	sessionTypeService.rest("find").then((data) => {
		commit(LOADSESSIONTYPES, data);
	}).catch((err) => {
		toastr.error(err.message);
	});
};

export const saveSessionType = ({ commit }, model) => {

	sessionTypeService.rest("create", model).then((data) => {
		if (data) {
			commit(ADDSESSIONTYPES, data);
			commit(SELECTSESSIONTYPE, data);

			toastr.success("Created SessionType successfuly");
		} else {
			toastr.error("Request error!");
		}
	}).catch((err) => {
		toastr.error(err.message);
	});
};

export const updateSessionType = ({ commit }, model) => {

	sessionTypeService.rest("update", model).then((data) => {
		if (data) {
			commit(SELECTSESSIONTYPE, data);
			toastr.success("Update Weblink successfuly");
		} else {
			toastr.error("Request error!");
		}
	}).catch((err) => {
		toastr.error(err.message);
	});
};

export const updateEventSessionType = ({ commit }, model) => {

	sessionTypeService.rest("update", model.sessionType).then((data) => {
		if (data) {
			commit(UPDATEEVENTSESSIONTYPE, model);
			toastr.success("Update SessionType successfuly");
		} else {
			toastr.error("Request error!");
		}
	}).catch((err) => {
		toastr.error(err.message);
	});
};

export const setSessionTypeDisplay = ({ commit }, display) => {
	commit(SESSIONTYPEDISPLAY, display);
};

export const selectSessionType = ({ commit }, sessiontype) => {
	commit(SELECTSESSIONTYPE, sessiontype);
};

export const setselSessionType = ({ commit }, sync) => {
	commit(SETSELSESSIONTYPE, sync);
};

/////////peopels/////////
export const loadPeoples = ({ commit }) => {
	peopleService.rest("find").then((data) => {
		commit(LOADPEOPLES, data);
	}).catch((err) => {
		toastr.error(err.message);
	});
};

export const savePeople = ({ commit }, model) => {
	var _model = {
		description: model.description,
		role: model.role,
		title: model.title
	}
	peopleService.rest("create", _model).then((data) => {
		if (data) {
			commit(ADDPEOPLES, data);
			commit(SELECTPEOPLE, data);

			toastr.success("Created PEOPLE successfuly");
		} else {
			toastr.error("Request error!");
		}
	}).catch((err) => {
		toastr.error(err.message);
	});
};

export const updatePeople = ({ commit }, model) => {

	peopleService.rest("update", model).then((data) => {
		if (data) {
			commit(SELECTPEOPLE, data);
			toastr.success("Update People successfuly");
		} else {
			toastr.error("Request error!");
		}
	}).catch((err) => {
		toastr.error(err.message);
	});
};

export const updateEventPeople = ({ commit }, model) => {
	peopleService.rest("update", model.people).then((data) => {
		if (data) {
			commit(UPDATEEVENTPEOPLE, model);
			toastr.success("Update People successfuly");
		} else {
			toastr.error("Request error!");
		}
	}).catch((err) => {
		toastr.error(err.message);
	});
}

export const setPeopleDisplay = ({ commit }, display) => {
	commit(PEOPLEDISPLAY, display);
};

export const selectPeople = ({ commit }, people) => {
	commit(SELECTPEOPLE, people);
};

export const setselPeople = ({ commit }, sync) => {
	commit(SETSELPEOPLE, sync);
};

export const setWeblinkPopulate = ({ commit }, payload) => {
	commit(WEBLINKPOPULATE, payload);
}

export const setPeoplePopulate = ({ commit }, payload) => {
	commit(PEOPLEPOPULATE, payload);
}

export const setVenuePopulate = ({ commit }, payload) => {
	commit(VENUPOPULATE, payload);
}

export const setSessionTypePopulate = ({ commit }, payload) => {
	commit(SESSIONTYPEPOPULATE, payload);
}

