import { ADD_MESSAGE, ADD_NOTIFICATION, SET_USER, SEARCH, SET_CURRENT, SET_ADMINVIEW} from "./types";

const state = {
	user: null,
	notifications: [
		{ id: 1, text: "Something happened!", time: 1, user: null }
	],
	messages: [],
	searchText: "",
	currentPage: "Urban Tribuu",
	adminView: true
};

const mutations = {
	[ADD_MESSAGE] (state, item) {
		state.messages.splice(0);
		state.messages.push(item);
	},

	[ADD_NOTIFICATION] (state, item) {
		state.notifications.splice(0);
		state.notifications.push(item);
	},

	[SET_USER] (state, user) {
		state.user = user;
	},

	[SEARCH] (state, text) {
		state.searchText = text;
	},

	[SET_CURRENT](state, current) {
		state.currentPage = current;
	},

	[SET_ADMINVIEW](state, adminView) {
		state.adminView = adminView;
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
