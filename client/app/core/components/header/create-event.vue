<template lang="pug">
	.event
		router-link.create-event(to="/createEvent" v-if="currentPage=='Urban Tribuu'")
			span.label {{ "Create Event" | i18n }}

</template>

<script>
	import { mapGetters } from "vuex";

	export default {
	  computed: {
		  ...mapGetters("session", ["currentPage"])
	  }
	};
</script>

<style lang="scss">
	.page-header {
	  .create-event {
	    font-size: 1.2em;
	    line-height: 70px;
	    font-weight: 700;
	    padding: 0em;
	    vertical-align: middle;
	    margin-right: 2em;
	    transition: 0.5s;
	    text-decoration: none;
	    color: #00a8e8;
	  }
	  .create-event:hover {
	    color: white;
	  }
	}
</style>
