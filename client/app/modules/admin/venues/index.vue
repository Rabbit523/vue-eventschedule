<template lang="pug">
	.container
		fieldset
			.block
				button.button(@click="create") Create New Venue
		fieldset
			.content.card-columns
					.card(v-for="venue in venues")
						google-map(:name="venue.name", :long="venue.leaflet.long", :lat="venue.leaflet.lat")
						.block.title {{venue.name}}   -   {{venue.subname}}
							p.text-muted {{venue.address}}, {{venue.city}}, {{venue.country}}, {{venue.zipcode}}
							a.tag.primary(v-for="weblink in venue.weblinks", :href="weblink.url", target="blank") {{weblink.label}}
							p 
							| {{venue.description}}
						.block.text-right
							button.button(@click="edit(venue)") EDIT
							button.button.danger(@click="removeConfirm(venue)") DELETE

		el-dialog(title="Venue information", :visible.sync="modalShow", width="30%", @open="open")
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

		el-dialog(title="Alert", :visible.sync="dialogFormVisible",  width="400px")
			span Do you want delete this item?
			span(slot="footer", class="dialog-footer")
				el-button(@click="dialogFormVisible = false") Cancel
				el-button(type="primary" @click="remove") OK

</template>

<script>
import Vue from "vue";
import AdminPage from "../../../core/DefaultAdminPage.vue";
import GoogleMap from "../googlemap";
import schema from "./schema";
import toast from "../../../core/toastr";

import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    AdminPage: AdminPage,
    GoogleMap: GoogleMap
  },

  computed: {
    ...mapGetters("admin_venues", ["venues", "selected"]),
    ...mapGetters("admin_weblinks", ["weblinks"])
  },

  /**
   * Set page schema as data property
   */
  data() {
    return {
      schema,
      modalShow: false,
      dialogFormVisible: false,
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

  /**
   * Socket handlers. Every property is an event handler
   */
  socket: {
    prefix: "/devices/",

    events: {
      /**
       * New device added
       * @param  {Object} res Device object
       */
      created(res) {
        this.created(res.data);
        toast.success(this._("DeviceNameAdded", res), this._("DeviceAdded"));
      },

      /**
       * Device updated
       * @param  {Object} res Device object
       */
      updated(res) {
        this.updated(res.data);
        toast.success(
          this._("DeviceNameUpdated", res),
          this._("DeviceUpdated")
        );
      },

      /**
       * Device removed
       * @param  {Object} res Response object
       */
      removed(res) {
        this.removed(res.data);
        toast.success(
          this._("DeviceNameDeleted", res),
          this._("DeviceDeleted")
        );
      }
    }
  },

  methods: {
    ...mapActions("admin_venues", [
      "downloadRows",
      "created",
      "updated",
      "removed",
      "selectRow",
      "clearSelection",
      "saveRow",
      "updateRow",
      "removeRow"
    ]),
    ...mapActions({ weblinks_download: "admin_weblinks/downloadRows" }),
    edit: function(row) {
      this.selectRow(row);
      this.modalShow = true;
    },
    removeConfirm: function(row) {
      this.selectRow(row);
      this.dialogFormVisible = true;
    },
    remove: function() {
      this.dialogFormVisible = false;
      this.removeRow(this.selected[0]);
    },
    open: function() {
      if (this.selected[0]) {
        this.venue = Object.assign({}, this.selected[0]);
        this.venue.weblinks = [];
        this.selected[0].weblinks.forEach(element => {
          this.venue.weblinks.push(element.code);
        });
      } else {
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
      }
    },
    cancelVenue: function() {
      this.modalShow = false;
    },
    saveVenue: function() {
      this.modalShow = false;
      if (this.venue.code) {
        this.updateRow(this.venue);
      } else {
        this.saveRow(this.venue);
      }
    },
    create: function() {
      this.clearSelection();
      this.modalShow = true;
    }
  },

  /**
   * Call if the component is created
   */
  mounted() {
    // Download rows for the page
    this.downloadRows();
    this.weblinks_download();
  },
  created() {
    // Download rows for the page
    if (this.venues.length == 0) this.downloadRows();
    if (this.weblinks.length == 0) this.weblinks_download();
  }
};
</script>
<style scoped>
.container {
  margin-left: 210px;
  padding: 0 1rem;
}
.tag {
  margin-bottom: 1em;
  text-decoration: none;
}
.card-columns {
  column-count: 4;
}
</style>
