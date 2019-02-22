<template lang="pug">
	div.container
		.form-group
			el-tag(type="success") Create Ticket
		.form-group
			span(class="demonstration") {{ "Ticket Name" }}
			input(placeholder="Ticket Name", v-model="data.name").form-control
		.form-group
			span(class="demonstration") {{ "Ticket Limited " }}
			input(placeholder="Ticket Limited: quantity of tickets ", v-model="data.name").form-control
		.form-group
			span(class="demonstration") {{ "Ticket Amount " }}
			input(placeholder="Ticket Amount: amount of tickets per person ", v-model="data.name").form-control
		.form-group
			span(class="demonstration") {{ "Session Ticket " }}
			input(placeholder="Session Ticket ", v-model="data.name").form-control
		.form-group
			span(class="demonstration") {{ "Restircted Registration" }}
			el-radio(v-model="radio", label="1") Yes
			el-radio(v-model="radio", label="2") No
		.form-group
			el-button(type="primary", round, @click="createEvent") {{ "Create Ticket" }}
</template>

<script>
	import Service from "../../../core/service";
	import { mapGetters, mapActions } from "vuex";

	export default {
	  data() {
	    return {
	      data: {
	        startDate: "",
	        startTime: "",
	        endDate: "",
	        endTime: ""
		  },
		  radio: "1"
	    };
	  },
	  computed: {
	    ...mapGetters("events", ["events"])
	  },
	  methods: {
	    ...mapActions("events", ["saveEvent", "created"]),
	    ...mapActions("session", ["setCurrentPage", "setAdminView"]),
	    createEvent: function() {
	      this.saveEvent({ data: this.data, router: this.$router });
	    }
	  },
	  mounted: function() {
			this.setAdminView(false);
	    this.setCurrentPage("Create Addon");
	  }
	};
</script>

<style lang="scss" scoped>
	@import "../../../../scss/themes/blurred/variables";
	@import "../../../../scss/common/mixins";

	.container {
	  margin-top: 2em;
		margin-left: 15em!important;
		margin-right: 15em!important;
	}
	.demonstration {
	  display: block;
	  color: #aebbcd;
	  font-size: 18px;
	  margin-bottom: 20px;
	}
	.el-tag--success {
	  background-color: rgb(103, 194, 58);
	  border-color: rgba(103, 194, 58, 0.2);
	  color: #000000;
	  font-size: 17px;
	  font-weight: 700;
	}
</style>
