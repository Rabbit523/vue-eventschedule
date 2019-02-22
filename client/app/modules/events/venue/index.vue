<template lang="pug">
	div.container
		.form-group
			el-tag(type="success") Create Venue
		.form-group
			el-row
				el-col(:span="10")
					span(class="demonstration") {{ "Venue Name" }}
					input(placeholder="Venue Name", v-model="data.name").form-control
				el-col(:span="4")
					span &nbsp;
				el-col(:span="10")
					span(class="demonstration") {{ "Venue Subname" }}
					input(placeholder="Venue Subname", v-model="data.subname").form-control
		.form-group
			span(class="demonstration") {{ "Description" }}
			textarea(v-model="data.description", rows="4").form-control
		.form-group
			el-row
				el-col(:span="10")
					span(class="demonstration") {{ "Address" }}
					input(placeholder="address", v-model="data.name").form-control
				el-col(:span="4")
					span &nbsp;
				el-col(:span="10")
					span(class="demonstration") {{ "City" }}
					input(placeholder="City", v-model="data.subname").form-control
		.form-group
			el-row
				el-col(:span="10")
					span(class="demonstration") {{ "Country" }}
					input(placeholder="Country", v-model="data.name").form-control
				el-col(:span="4")
					span &nbsp;
				el-col(:span="10")
					span(class="demonstration") {{ "Zip Code" }}
					input(placeholder="Zip Code", v-model="data.subname").form-control
		.form-group
			el-row
				el-col(:span="10")
					span(class="demonstration") {{ "Weblinks" }}
					el-row
						el-col(:span="20")
							input(placeholder="Weblinks", v-model="data.name").form-control
						el-col(:span="4" style="text-align: center;")
							el-button(type="text", icon="el-icon-circle-plus-outline", class="weblinks-button", @click="dialogFormVisible = true")
		.form-group
			el-row
				el-col(:span="24")
					.form-group
						el-button(type="primary", round, @click="createEvent") {{ "Create Venue" }}
		el-dialog(title="New weblinks", :visible.sync="dialogFormVisible",  width="400px")
			el-form(:model="form")
				el-form-item(label="Label", :label-width="formLabelWidth")
					el-input(v-model="form.label", auto-complete="off")
				el-form-item(label="URL", :label-width="formLabelWidth")
					el-input(v-model="form.url", auto-complete="off")
			span(slot="footer", class="dialog-footer")
				el-button(@click="dialogFormVisible = false") Cancel
				el-button(type="primary" @click="dialogFormVisible = false") Create
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
			  endTime: "",
		  },
			dialogFormVisible: false,
			form: {
				label: "",
				url: ""
			},
			formLabelWidth: '60px'
	    };
	  },
	  computed: {
		  ...mapGetters("events", ["events"]),
	  },
	  methods: {
	    ...mapActions("events", ["saveEvent", "created"]),
		...mapActions("session", ["setCurrentPage"]),
		createEvent: function() {
			this.saveEvent({ data: this.data, router: this.$router});
		}
	  },
	  mounted: function() {
		this.setCurrentPage("Create Venue");
	  }
	};
</script>

<style lang="scss" scoped>
	@import "../../../../scss/themes/blurred/variables";
	@import "../../../../scss/common/mixins";

	.container {
	  margin-top: 2em;
	}
	.weblinks-button {
		font-weight: 700;
		color: white;
		text-align: center;
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
