<template lang="pug">
	.container
		fieldset
			.block
				button.button(@click="create") Create New Event
				button.button.danger(@click="deleteall") Delete All
		fieldset
			.content.list
				.media(v-for="event in events")
					.media-left
						img.avatar(:src="event.creater.avatar")
						div(style="text-align: center;") {{ event.creater.username }}
					.media-content
						strong {{event.name}}
						div
							small.primary.text-muted {{event.startDate | formatDate}} - {{ event.endDate | formatDate}}
						.text-left(style="min-height: 20px;")
							a.tag.pill(v-for="session in event.eventSessions", :style="{backgroundColor: session.sessionType.color}") {{ session.name }}
						div
							p.text-justify {{event.description}}
								a.link(href="#")  Read more...

						.text-right
							a.tag.primary(v-for="weblink in event.weblinks", :href="weblink.url", target="blank") {{ weblink.label }}
							button.button.small(@click="edit(event)") Edit
							button.button.small.danger(@click="removeConfirm(event)")
								i.icon.fa.fa-trash
								| Delete
					.ribbon.right(v-if="event.isPublished")
						span Published

		el-dialog(title="Event information",:visible.sync="modalShow", width="33%", @open="open")
			el-form(label-width="120px")
				el-form-item(label="Event name")
					el-input(v-model="event.name")
				el-form-item(label="Creater")
					el-input(v-model="event.creater.username", disabled)
				el-form-item(label="Description")
					el-input(v-model="event.description", type="textarea", :rows="4")
				el-form-item(label="Date")
					el-date-picker(type="daterange", v-model="event.date", range-separator=":", start-placeholder="Start date", end-placeholder="End date")
				el-form-item(label="Published")
					el-switch(v-model="event.isPublished")
				el-form-item(label="Session")
					el-select(v-model="event.eventSessions", multiple, placeholder="Select")
						el-option(v-for="item in eventsessions", :key="item.code", :label="item.name", :value="item.code")
				el-form-item(label="Weblinks")
					el-select(v-model="event.weblinks", multiple, placeholder="Select")
						el-option(v-for="item in weblinks", :key="item.code", :label="item.label", :value="item.code")
			span(slot="footer", class="dialog-footer")
				el-button(@click="save", type="primary") Save
				el-button(@click="cancel") Cancel

		el-dialog(title="Alert", :visible.sync="dialogFormVisible",  width="400px")
			span Do you want delete this item?
			span(slot="footer", class="dialog-footer")
				el-button(@click="dialogFormVisible = false") Cancel
				el-button(type="primary" @click="remove") OK

		el-dialog(title="Alert", :visible.sync="dialogDeleteAll",  width="400px")
			span Do you want delete all?
			span(slot="footer", class="dialog-footer")
				el-button(@click="dialogDeleteAll = false") Cancel
				el-button(type="primary" @click="removeall") OK
</template>

<script>
	import Vue from "vue";
	import AdminPage from "../../../core/DefaultAdminPage.vue";
	import schema from "./schema";
	import toast from "../../../core/toastr";

	import { mapGetters, mapActions } from "vuex";

	export default {
	  components: {
	    AdminPage: AdminPage
	  },

	  computed: {
	    ...mapGetters("admin_events", ["events", "selected"]),
	    ...mapGetters("admin_weblinks", ["weblinks"]),
	    ...mapGetters("admin_eventsessions", ["eventsessions"])
	  },

	  /**
	   * Set page schema as data property
	   */
	  data() {
	    return {
	      schema,
				dialogFormVisible: false,
				dialogDeleteAll: false,
	      modalShow: false,
	      event: {
	        name: "",
	        description: "",
	        date: [],
	        startDate: "",
	        endDate: "",
	        isPublished: false,
					eventSessions: [],
					weblinks: [],
	        creater: {
	          username: ""
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
	    ...mapActions("admin_events", [
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
	    ...mapActions({
	      eventsessions_download: "admin_eventsessions/downloadRows"
	    }),
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
	      this.clearSelection();
			},
			removeall: function() {
				this.dialogDeleteAll = false;
				var i;
				console.log("!!!events:");
				console.log(this.events);
				for( i in this.events)
				{
					this.selectRow(this.events[i]);
					this.removeRow(this.selected[0]);
					this.clearSelection();
				}	      
			},			
	    open: function() {
	      if (this.selected[0]) {
	        this.event = Object.assign({}, this.selected[0]);
	        this.event.weblinks = [];
	        this.event.eventSessions = [];
	        this.selected[0].weblinks.forEach(element => {
	          this.event.weblinks.push(element.code);
	        });
	        this.selected[0].eventSessions.forEach(element => {
	          this.event.eventSessions.push(element.code);
			});
			this.event.date = [];
			this.event.date.push(this.event.startDate);
			this.event.date.push(this.event.endDate);
	      } else {
	        this.event = Object.assign(
	          {},
	          {
	            name: "",
	            description: "",
	            date: "",
	            startDate: "",
	            endDate: "",
	            isPublished: false,
	            creater: {
	              username: ""
	            },
	            weblinks: [],
	            eventSessions: []
	          }
	        );
	      }
	    },
	    cancel: function() {
	      this.modalShow = false;
	    },
	    save: function() {
	      this.modalShow = false;
	      if (this.event.code) {
	        this.event.startDate = this.event.date[0];
	        this.event.endDate = this.event.date[1];
	        this.updateRow(this.event);
	      } else {
	        this.event.startDate = this.event.date[0];
	        this.event.endDate = this.event.date[1];
	        this.saveRow(this.event);
	      }
	      this.clearSelection();
	    },
	    create: function() {
	      this.clearSelection();
	      this.modalShow = true;
			},
			deleteall: function() {
	    //  this.selectRow();
	      this.dialogDeleteAll = true;
			}
	  },

	  /**
	   * Call if the component is created
	   */
	  mounted() {
	    // Download rows for the page
	    this.downloadRows();
	    this.weblinks_download();
	    this.eventsessions_download();
	  }
	};
</script>

<style lang="scss" scoped>
@import "../../../../scss/themes/blurred/variables";
.tag {
  float: left;
  text-decoration: none;
}
.button.danger {
  margin-left: 3em;
}
.button.small {
  margin-left: 0.3em;
}
.media {
  margin-left: 200px;
  margin-right: 200px;
}
.text-muted {
  margin-top: 5px;
  margin-bottom: 5px;
}
.container {
  margin-left: 220px;
  padding: 0 1rem;
}

section {
  &:not(:last-child) {
    margin-bottom: 40px;
  }

  > h2 {
    font-size: 1.5rem;
    margin-bottom: 20px;
    padding: 8px 10px;

    background-color: rgba(darken($backgroundColor, 10%), 0.6);
    border: 1px solid darken($backgroundColor, 8%);
    border-radius: 8px;

    .number {
      color: #888;
    }

    .text {
      margin-left: 4px;
      font-weight: $fontLight;
      text-transform: uppercase;
    }

    clear: both;
  } // .title
} //. section

.buttons {
  margin-bottom: 20px;
}

.list {
  > * {
    margin-bottom: 20px;
  }
}

.panels {
  align-items: flex-start;
  .panel,
  .card {
    margin: 20px;
  }

  .card {
    max-width: 350px;
  }
}

.colors {
  $boxSize: 150px;

  .box {
    width: $boxSize;
    height: $boxSize + 20px;

    border: 1px solid darken($backgroundColor, 10%);
    border-radius: 6px;

    margin: 5px 20px;
    padding: 2px;

    .caption {
      float: left;
      width: 100%;
      text-align: center;
    }

    .main {
      float: left;
      width: 100%;
      height: $boxSize - 60px;
    } // .main

    .light {
      float: left;
      width: 50%;
      height: 30px;
    } // .light

    .dark {
      float: right;
      width: 50%;
      height: 30px;
    } // .dark

    .code {
      float: left;
      width: 100%;
      position: relative;
      margin-top: 5px;

      &:after {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        width: 100%;
        text-align: center;
        font-family: "Consolas";
        color: White;
      }
    } // .code

    $colors: $color1, $color2, $color3, $color4, $color5;

    $colors-light: $color1-light, $color2-light, $color3-light, $color4-light,
      $color5-light;
    $colors-dark: $color1-dark, $color2-dark, $color3-dark, $color4-dark,
      $color5-dark;

    @for $i from 1 through 5 {
      $c: nth($colors, $i);

      &.box#{$i} {
        .main {
          background-color: $c;
        }
        .light {
          background-color: nth($colors-light, $i);
        }
        .dark {
          background-color: nth($colors-dark, $i);
        }
        .code:after {
          content: "" + $c;
        }
      } // box
    } // for
  } // .box
} // .colors
</style>
<style>
.el-select {
  width: 100%;
}
</style>
