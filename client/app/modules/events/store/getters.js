import { find } from "lodash";

export function events(state) {
	return state.events;
}

export function event(state) {
	return (eventCode) => {
		return state.events.find((event) => {
			return event.code === eventCode
		})
	}
}

export function currentEvent(state) {
	return state.currentEvent;
}

///////sessions//////
export function sessions(state) {
	return state.sessions;
}

export function vsession(state) {
	return state.vsession;
}

export function selsession(state) {
	return state.selsession;
}
/////schedule///////
export function weekgrounds(state) {
	return state.weekgrounds;
}

export function colors(state) {
	return state.colors;
}

////////venue///////
export function venueDisplay(state) {
	return state.venueDisplay;
}

export function selectedVenue(state) {
	return state.selectedVenue;
}

export function newVenue(state) {
	return state.newVenue;
}

export function venues(state) {
	return state.venues;
}

////////weblinks////////
export function weblinkDisplay(state) {
	return state.weblinkDisplay;
}

export function weblinks(state) {
	return state.weblinks;
}

export function weblink(state) {
	return state.weblink;
}

export function selweblink(state) {
	return state.selweblink;
}

////////sessiontypes////////
export function sessiontypeDisplay(state) {
	return state.sessiontypeDisplay;
}

export function sessiontype(state) {
	return state.sessiontype;
}

export function selsessiontype(state) {
	return state.selsessiontype;
}
export function sessiontypes(state) {
	return state.sessiontypes;
}

////////peoples////////
export function peopleDisplay(state) {
	return state.peopleDisplay;
}

export function peoples(state) {
	return state.peoples;
}

export function people(state) {
	return state.people;
}

export function selpeople(state) {
	return state.selpeople;
}

export function weblinkPopulate(state) {
	return state.weblinkPopulate;
}

export function peoplePopulate(state) {
	return state.peoplePopulate
}

export function venuePopulate(state) {
	return state.venuePopulate
}

export function sessionTypePopulate(state) {
	return state.sessionTypePopulate
}