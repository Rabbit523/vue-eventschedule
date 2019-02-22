"use strict";

import Vue from "vue";
import VueRouter from "vue-router";

import Home from "../modules/home";
import AdminHome from "../modules/admin/home";
import Events from "../modules/admin/events";
import Eventsessions from "../modules/admin/eventsessions";
import Participants from "../modules/admin/participants";
import Speaker from "../modules/admin/speaker";
import Venues from "../modules/admin/venues";
import Weblinks from "../modules/admin/weblinks";
import Sessiontypes from "../modules/admin/sessiontypes";
import Addon from "../modules/admin/addon";
import Participant from "../modules/admin/participants";

import Posts from "../modules/admin/posts";
import Profile from "../modules/profile";
import CreateEvent from "../modules/events/create";
import EditEvent from "../modules/events/edit";
import Schedule from "../modules/events/schedule";
import Session from "../modules/events/session";
import Venue from "../modules/events/venue";
// import Participant from "../modules/events/participant";
const Event = {
	template: `
	  <div>
		<router-view></router-view>
	  </div>
	`
}

Vue.use(VueRouter);

export default new VueRouter({
	// mode: "hash",
	routes: [
		{ path: "/", component: Home },
		{ path: "/admin/events", component: Events },
		{ path: "/admin/eventsessions", component: Eventsessions },
		{ path: "/admin/participants", component: Participants },
		{ path: "/admin/speaker", component: Speaker },
		{ path: "/admin/venues", component: Venues },
		{ path: "/admin/weblinks", component: Weblinks },
		{ path: "/admin/sessiontypes", component: Sessiontypes },
		{ path: "/admin/home", component: AdminHome },
		{ path: "/admin/addon", component: Addon },
		{ path: "/admin/participant", component: Participant },
		{ path: "/profile", component: Profile },
		{ path: "/createEvent", component: CreateEvent },
		{
			path: "/schedule/:ecode", component: Event,
			children: [
				{
					path: "",
					props: true,
					component: Schedule
				},
				{
					path: "session",
					component: Session,
					props: true
				},
				{
					path: "venues",
					component: Venues,
					props: true
				},
				{
					path: "weblinks",
					component: Weblinks,
					props: true
				},
				{
					path: "workers",
					component: Speaker,
					props: true
				},
				{
					path: "editEvent",
					component: EditEvent,
					props: true
				}
			]
		},
		{ path: "/venue", component: Venue },
		// { path: "/participant", component: Participant },
		// { path: "/users", component: User, meta: { needRole: "admin" } },
		//{ path: "*", component: NotFound }
	]
});
