<template lang="pug">
	aside.nav(:class="{ mini: minimized }")
		.menu
			.title {{ "General" | i18n }}
			ul
				router-link(tag="li", to="/admin/home")
					a(:title="_('Home')")
						span.icon
							i.fa.fa-home
						span.label {{ "Home" | i18n }}

				router-link(tag="li", to="/admin/events")
					a(:title="_('Events')")
						span.icon
							i.fa.fa-calendar
						span.label {{ "Events" | i18n }}

				router-link(tag="li", to="/admin/eventsessions")
					a(:title="_('Event Sessions')")
						span.icon
							i.fa.fa-flag
						span.label {{ "Event Sessions" | i18n }}

				router-link(tag="li", to="/admin/sessiontypes")
					a(:title="_('Session Types')")
						span.icon
							i.fa.fa-tags
						span.label {{ "Session Types" | i18n }}

				router-link(tag="li", to="/admin/venues")
					a(:title="_('Venues')")
						span.icon
							i.fa.fa-venus
						span.label {{ "Venues" | i18n }}

				router-link(tag="li", to="/admin/weblinks")
					a(:title="_('Weblinks')")
						span.icon
							i.fa.fa-globe
						span.label {{ "Weblinks" | i18n }}

				router-link(tag="li", to="/admin/participants")
					a(:title="_('Participant')")
						span.icon
							i.fa.fa-users
						span.label {{ "Participant" | i18n }}

				router-link(tag="li", to="/admin/speaker")
					a(:title="_('Worker')")
						span.icon
							i.fa.fa-bullhorn
						span.label {{ "Worker" | i18n }}

				router-link(tag="li", to="/admin/addon")
					a(:title="_('Addon')")
						span.icon
							i.fa.fa-ticket
						span.label {{ "Addon" | i18n }}

			.title {{ "Profile" | i18n }}
			ul
				li
					a(href="/logout", :title="_('Logout')")
						span.icon
							i.fa.fa-sign-out
						span.label {{ "Logout" | i18n }}

		.footer
			.social
				a(href="", target="_blank")
					i.fa.fa-facebook
				a(href="https://twitter.com/Icebobcsi", target="_blank")
					i.fa.fa-twitter
				a(href="https://github.com/icebob/vue-express-mongo-boilerplate", target="_blank")
					i.fa.fa-github
			.copyright &copy; Copyright, 2016
</template>

<script>
	export default {
	  props: ["minimized"]
	};
</script>

<style lang="scss">

</style>
