<template lang="pug">
	el-dialog(title="Venue information",:visible.sync="modalShow", width="30%", @open="open")
		el-form(label-width="120px")
			el-form-item(label="Venue name")
				el-input(v-model="venue.name")
			el-form-item(label="Venue Sub name")
				el-input(v-model="venue.subname")
			el-form-item(label="Description")
				el-input(v-model="venue.description", type="textarea", :rows="4")
			el-form-item(label="Address")
				el-input(v-model="venue.address")
			el-form-item(label="City")
				el-input(v-model="venue.city")
			el-form-item(label="Country")
				el-input(v-model="venue.country")
			el-form-item(label="Zip Code")
				el-input(v-model="venue.zipcode")
			el-form-item(label="Longitude")
				el-input(v-model="venue.leaflet.long")
			el-form-item(label="Latitude")
				el-input(v-model="venue.leaflet.lat")
			el-form-item(label="Weblinks")
				el-select(v-model="venue.weblinks", multiple, placeholder="Select")
					el-option(v-for="item in weblinks", :key="item.code", :label="item.label", :value="item.code")
		span(slot="footer", class="dialog-footer")
			el-button(@click="saveVenue", type="primary") Save
			el-button(@click="cancelVenue") Cancel
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      venue: {
        id: "",
        name: "",
        subname: "",
        description: "",
        address: "",
        city: "",
        country: "",
        zipcode: "",
        weblinks: [],
        leaflet: {
          long: "",
          lat: ""
        }
      }
    };
  },
  computed: {
    modalShow: {
      get: function() {
        return this.venueDisplay;
      },
      set: function(newVal) {
        this.setVenueDisplay(newVal);
      }
    },
    ...mapGetters("admin_venues", ["venues", "selected"]),
    ...mapGetters("admin_weblinks", ["weblinks"]),
    ...mapGetters("events", [
      "venueDisplay",
      "selectedVenue",
      "venuePopulate",
      "newVenue"
    ])
  },
  methods: {
    ...mapActions("events", [
      "setVenueDisplay",
      "setSelectedVenue",
      "setNewVenue",
      "loadVenue"
    ]),
    ...mapActions({ weblinks_download: "admin_weblinks/downloadRows" }),
    cancelVenue: function() {
      this.modalShow = false;
      // this.newVenue.name = "";
      // this.newVenue.id = "";
    },
    saveVenue: function() {
      this.modalShow = false;
      if (this.venue.id == "createdVenue") {
        this.setNewVenue(this.venue);
      } else {
        console.log("updatevenue1", this.venue);
        this.venue.id = "updated";
        //	this.venue.weblinks = [];
        this.setSelectedVenue(this.venue);
      }
    },
    open: function() {
      console.log("modal venue name", this.selectedVenue);
      if (this.newVenue.id == "newVenue") {
        console.log("new venue name", this.newVenue);
        this.venue = Object.assign(
          {},
          {
            id: "",
            name: "",
            subname: "",
            description: "",
            address: "",
            city: "",
            country: "",
            zipcode: "",
            weblinks: [],
            leaflet: {
              long: "",
              lat: ""
            }
          }
        );
        this.venue.name = this.newVenue.name;
        this.venue.id = "createdVenue";
        if (this.venuePopulate) {
          this.venue.name = this.venuePopulate;
        }
      } else {
        this.venue = this.selectedVenue;
      }
    }
  },
  created() {
    if (this.weblinks.length == 0) this.weblinks_download();

    console.log("weblinks", this.weblinks);
    console.log("selectvenue", this.selectedVenue);
  }
};
</script>
