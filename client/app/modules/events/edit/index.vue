<template lang="pug">
	.container
		.form-group
			span(class="demonstration") {{ "Event Name" }}
			input(placeholder="Event Name", v-model="event.name").form-control
		.form-group
			span(class="demonstration") {{ "Event Description" }}
			textarea(v-model="event.description", placeholder='Event Description', rows=5).form-control
		el-row
			el-col(:span="10")
				.form-group
					span(class="demonstration") {{ "Event Date Period" }}
					el-date-picker(type="daterange", v-model="event.date", range-separator="To", start-placeholder="Start date", end-placeholder="End date", @change="ValidateEventDate")
			el-col(:span="12", :offset="2")
				el-row
					el-col(:span="24")
						.form-group(style="padding-top: 5px")
							span(class="demonstration") {{ "WebLinks" }}
					el-col(:span="24")
						.form-group
							weblink-select(label="label", taggable, multiple, push-tags, :options="weblinks", key="code", v-model="event.weblinks", :create-option="createWeblink")
			.block
				button.button(@click="createEvent") Save Event

		venue-modal

		el-dialog(title="New Weblinks", :visible.sync="weblinkmodal",  width="400px", @open="Open")
			el-form(label-width="120px")
				el-form-item(label="Label", :label-width="formLabelWidth")
					el-input(v-model="modalweblink.label")
				el-form-item(label="URL", :label-width="formLabelWidth")
					el-input(v-model="modalweblink.url")
			span(slot="footer", class="dialog-footer")
				el-button(type="primary" @click="SaveWeblink") Save
				el-button(@click="CloseWeblink") Cancel	

</template>

<script>
import Service from "../../../core/service";
import { mapGetters, mapActions } from "vuex";
import VenueSelect from "../VenueSelect.vue";
import WeblinkSelect from "../WeblinkSelect.vue";
import VenueModal from "../VenueModal.vue";
import toastr from "../../../core/toastr";
import { find } from "lodash";

// import vSelect from "vue-select";
var d1 = new Date();
var d2 = new Date(d1);
d2.setHours(d1.getHours() + 24 * 5);

export default {
  props: ["ecode"],
  data() {
    return {
      event: {
        name: "",
        description: "",
        date: [],
        time: [],
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        venue: null,
        weblinks: []
      },

      modalweblink: {
        label: "",
        url: ""
      },

      fcreate: false,

      formLabelWidth: "60px"
    };
  },
  components: {
    "venue-select": VenueSelect,
    "venue-modal": VenueModal,
    "weblink-select": WeblinkSelect
  },
  computed: {
    weblinkmodal: {
      get: function() {
        return this.weblinkDisplay;
      },
      set: function(sync) {
        this.setWeblinkDisplay(sync);
      }
    },
    ...mapGetters({loadedEvent: "events/event"}),
    ...mapGetters("events", [
      "events",
      "venues",
      "selectedVenue",
      "weblinks",
      "weblink",
      "weblinkDisplay",
      "selweblink",
      "weblinkPopulate"
    ])
  },
  watch: {
    weblink: function(newWeblink, oldWeblink) {
      let found = find(
        this.event.weblinks,
        item => item.code == "qwer123" || item.code == newWeblink.code
      );
      if (found) {
        found.code = newWeblink.code;
        found.label = newWeblink.label;
        found.url = newWeblink.url;
      } else {
        this.event.weblinks.push(Object.assign({}, newWeblink));
      }
    },
    weblinkPopulate: function(newVal, oldVal) {
      this.modalweblink.label = newVal;
    }
  },
  methods: {
    ...mapActions("events", [
      "saveEvent",
      "created",
      "loadVenue",
      "setNewVenue",
      "setVenueDisplay",
      "setSelectedVenue",
      "loadWeblinks",
      "saveWeblink",
      "updateWeblink",
      "selectWeblink",
      "setselWeblink",
      "setWeblinkDisplay",
      "downloadEvents"
    ]),
    ...mapActions("session", ["setCurrentPage"]),
    createEvent: function() {
      this.saveEvent({ data: this.event, router: this.$router });
    },

    createVenue: function(newOption) {
      this.setNewVenue({ name: newOption, id: "newVenue" });
      this.setVenueDisplay(true);
    },

    createWeblink: function(newOption) {

      this.fcreate = true;

      this.weblinkmodal = true;
      this.setselWeblink(false);
      this.modalweblink = Object.assign(
        {},
        {
          code: "qwer123",
          label: "",
          url: ""
        }
      );

      this.modalweblink.label = newOption;
      this.modalweblink.url = "";
      return this.modalweblink;
    },

    createBtnWeblink: function() {
      this.weblinkmodal = true;
      this.setselWeblink(false);
      this.modalweblink = Object.assign(
        {},
        {
          code: "qwer123",
          label: "",
          url: ""
        }
      );
    },

    SaveWeblink: function() {
      this.weblinkmodal = false;
      if (this.selweblink == true) {
        this.updateWeblink(this.modalweblink);
        this.setselWeblink(false);
      } else {
        this.saveWeblink(this.modalweblink);
      }
    },

    CloseWeblink: function() {
      this.weblinkmodal = false;
      if (this.selweblink == true) {
        this.setselWeblink(false);
      }
    },

    ValidateEventDate: function() {
      this.event.startDate = this.event.date[0];
      this.event.endDate = this.event.date[1];
      var today = new Date();
      var date = new Date(this.event.startDate);

      var l =
        today.getHours() * 3600 * 1000 +
        today.getMinutes() * 60 * 1000 +
        today.getSeconds() * 1000 +
        today.getMilliseconds();

      if (date < today - l) {
        toastr.error(
          "Invalid Date Range! Start date must be prior than today!"
        );
        this.event.date = [];
      }
    },

    Open: function(newOption) {
      if (this.selweblink == true) {
        this.modalweblink = this.weblink;
      } else {
        if (!this.fcreate) {
          this.modalweblink = Object.assign(
            {},
            {
              label: "",
              url: ""
            }
          );
          if (this.weblinkPopulate) {
            this.modalweblink.label = this.weblinkPopulate;
          } else {
            this.modalweblink.label = newOption;
          }
        } else this.fcreate = false;
      }
    }
  },

  created: function() {
    this.loadVenue();
    this.loadWeblinks();
    this.setCurrentPage("Create Event");
    this.event.code = this.ecode;
    this.event.name = this.loadedEvent(this.ecode).name;
    this.event.description = this.loadedEvent(this.ecode).description;
    this.loadedEvent(this.ecode).weblinks.forEach(element => {
      this.event.weblinks.push(element);
    });
    this.event.date.push(new Date(this.loadedEvent(this.ecode).startDate));
    this.event.date.push(new Date(this.loadedEvent(this.ecode).endDate));
  }
};
</script>

<style lang="scss" scoped>
@import "../../../../scss/themes/blurred/variables";
@import "../../../../scss/common/mixins";

.container {
  margin-top: 2em;
  margin-left: 15em;
  margin-right: 15em;
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
<style>
.el-date-editor .el-range-input {
  background-color: #0c3241;
  color: white;
}
.form-group .el-input__inner {
  border: 1px solid #1c95b8;
  background-color: #0c3241;
  color: #ffffff;
}
.v-select .dropdown-toggle .clear {
  color: white;
}
.v-select .dropdown-toggle {
  border: 1px solid #14546d;
  background-color: #0c3241;
}
.v-select input[type="search"]:focus {
  box-shadow: 0 0 8px rgba(0, 168, 232, 0.6);
}
.v-select .open-indicator:before {
  border-color: white;
}
.v-select .dropdown-menu {
  visibility: visible;
  opacity: 1;
  background-color: rgba(0, 23, 31, 0.9);
  z-index: 2002;
}
.dropdown-menu li .highlight {
  color: black;
}
.v-select .selected-tag {
  color: white;
  background-color: #00a8e8;
  border: 1px solid #14546d;
}
.v-select .dropdown-menu .active > a {
  color: #00a8e8;
}
.v-select .dropdown-menu > .highlight > a {
  background: transparent;
  color: #00a8e8;
}
/* .card {
  background-color: #0c3241;
  margin-bottom: 0em;
} */
</style>
