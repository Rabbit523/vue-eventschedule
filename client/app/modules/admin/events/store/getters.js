import { find } from "lodash";

export function events(state) {
	return state.rows;
}

export function selected(state) {
	return state.selected;
}

export function deviceTypes(state) {
	return state.deviceTypes;
}

export function event(state) {
	return (eventCode) => {
		return state.rows.find((event) => {
			return event.code === eventCode
		})
	}
}