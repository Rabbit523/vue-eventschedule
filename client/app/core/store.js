import Vue from "vue";
import Vuex from "vuex";

import admin_events from "../modules/admin/events/store";
import admin_weblinks from "../modules/admin/weblinks/store";
import admin_venues from "../modules/admin/venues/store";
import admin_eventsessions from "../modules/admin/eventsessions/store";
import admin_sessiontypes from "../modules/admin/sessiontypes/store";
import admin_addons from "../modules/admin/addon/store";
import admin_participants from "../modules/admin/participants/store";
import admin_workers from "../modules/admin/speaker/store";
import posts from "../modules/admin/posts/store";

import users from "../modules/users/store";
import events from "../modules/events/store";
import counter from "../modules/admin/counter/store";
import profile from "../modules/profile/store";
import session from "../modules/session/store";

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		session,
		counter,
		admin_events,
		admin_weblinks,
		admin_venues,
		admin_eventsessions,
		admin_sessiontypes,
		admin_addons,
		admin_participants,
		admin_workers,
		users,
		posts,
		profile,
		events
	}
});
