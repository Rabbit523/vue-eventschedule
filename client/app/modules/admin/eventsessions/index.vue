<template lang="pug">
	.container
		fieldset
			.block
				button.button(@click="create") Create New Event Session
				button.button.danger(@click="deleteall") Delete All
		fieldset
			.content.list
				.media(v-for="session in eventsessions", :style="{backgroundColor: session.sessionType.color}")
					.media-left
						img.avatar(:src="session.creater.avatar")
						div(style="text-align: center;") {{ session.creater.username }}
					.media-content
						strong {{session.name}}
						div
							small.primary.text-muted {{session.startTime}} - {{ session.endTime}} {{session.date | date}}
						p.text-justify {{session.description}}
							a.link(href="#")  Read more...

						.text-right
							a.tag.primary(v-for="weblink in session.weblinks", :href="weblink.url", target="blank") {{ weblink.label }}
							button.button.small(@click="edit(session)") Edit
							button.button.small.danger(@click="removeConfirm(session)")
								i.icon.fa.fa-trash
								| Delete
					.ribbon.right(v-if="session.isPublished")
						span Published

		el-dialog(title="Event Session information",:visible.sync="modalShow", width="33%", @open="open")
			el-form(label-width="120px")
				el-form-item(label="Session name")
					el-input(v-model="eventsession.name")
				el-form-item(label="Session subtitle")
					el-input(v-model="eventsession.subtitle")
				el-form-item(label="Session Description")
					el-input(v-model="eventsession.description", type="textarea", :rows="3")
				el-form-item(label="Session Date")
					el-date-picker(type="date", v-model="eventsession.date", placeholder="Pick a day", @change="confirm")
				el-form-item(label="Start Time")
					el-time-select(:picker-options="{start: '06:00', step: '00:15', end: '21:00'}", v-model="eventsession.startTime", placeholder="Pick a start time", format="HH:mm")
				el-form-item(label="End Time")
					el-time-select(:picker-options="{start: '06:00', step: '00:15', end: '21:00'}", v-model="eventsession.endTime", placeholder="Pick a end time", format="HH:mm")
				el-form-item(label="Published")
					el-switch(v-model="eventsession.isPublished")
				el-form-item(label="MaxCapacity")
					el-input-number(v-model="eventsession.maxCapacity")
				el-form-item(label="AddOnPrice")
					el-input-number(v-model="eventsession.addOnPrice")
				el-form-item(label="Event")
					el-select(v-model="eventsession.eventId", placeholder="Select")
						el-option(v-for="item in events", :key="item.code", :label="item.name", :value="item.code")
				el-form-item(label="Sessiontype")
					el-select(v-model="eventsession.sessionType", placeholder="Select")
						el-option(v-for="item in sessiontypes", :key="item.code", :label="item.name", :value="item.code")
				el-form-item(label="Venues")
					el-select(v-model="eventsession.venue", placeholder="Select")
						el-option(v-for="item in venues", :key="item.code", :label="item.name", :value="item.code")
				el-form-item(label="Weblinks")
					el-select(v-model="eventsession.weblinks", multiple, placeholder="Select")
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
import Select from "vue-select";

import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    "v-select": Select
  },

  computed: {
    ...mapGetters("admin_eventsessions", ["eventsessions", "selected"]),
    ...mapGetters("admin_weblinks", ["weblinks"]),
    ...mapGetters("admin_venues", ["venues"]),
    ...mapGetters("admin_events", ["events"]),
    ...mapGetters("admin_sessiontypes", ["sessiontypes"])
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
      eventsession: {
        name: "",
        subtitle: "",
        isPublished: false,
        creater: {
          username: ""
        },
        date: "",
        startTime: "",
        endTime: "",
        description: "",
        maxCapacity: 1,
        participants: [],
        waitlisted: [],
        venue: "",
        weblinks: [],
        eventId: "",
        sessionType: "",
        people: "",
        addOnPrice: null
      }
    };
  },

  methods: {
    ...mapActions("admin_eventsessions", [
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
    ...mapActions({ venues_download: "admin_venues/downloadRows" }),
    ...mapActions({ events_download: "admin_events/downloadRows" }),
    ...mapActions({ sessiontypes_download: "admin_sessiontypes/downloadRows" }),
    edit: function(row) {
      this.selectRow(row);
      this.modalShow = true;
    },
    confirm: function(date) {
      if (this.eventsession.startDate > date) {
        this.eventsession.date = this.eventsession.startDate;
        alert(
          "wrong date: event date is from" +
            this.eventsession.startDate +
            " to " +
            this.eventsession.endDate
        );
      } else if (this.eventsession.endDate < date) {
        this.eventsession.date = this.eventsession.endDate;
        alert(
          "wrong date: event date is from" +
            this.eventsession.startDate +
            " to " +
            this.eventsession.endDate
        );
      }
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
				console.log(this.eventsessions);
				for( i in this.eventsessions)
				{
					this.selectRow(this.eventsessions[i]);
					this.removeRow(this.selected[0]);
					this.clearSelection();
				}	      
			},
    open: function() {
      console.log("admin selected", this.selected[0]); 
      if (this.selected[0]) {
        this.eventsession = Object.assign({}, this.selected[0]);
        this.eventsession.startTime = this.selected[0].startTime;
        this.eventsession.endTime = this.selected[0].endTime;
        this.eventsession.sessionType = this.selected[0].sessionType.code;
        this.eventsession.venue = this.selected[0].venue.code;
        this.eventsession.poeple = this.selected[0].poeple.code;
        this.eventsession.eventId = this.selected[0].eventId;
        this.eventsession.startDate = this.selected[0].startDate;
        this.eventsession.endDate = this.selected[0].endDate;
        this.eventsession.weblinks = [];
        this.selected[0].weblinks.forEach(element => {
          this.eventsession.weblinks.push(element.code);
        });
      } else {
        this.eventsession = Object.assign(
          {},
          {
            name: "",
            subtitle: "",
            isPublished: false,
            creator: {
              username: ""
            },
            startTime: "",
            endTime: "",
            description: "",
            maxCapacity: 1,
            participants: [],
            waitlisted: [],
            venue: "",
            eventId: "",
            weblinks: [],
            sessionType: "",
            people: "",
            addOnPrice: null
          }
        );
      }
    },
    cancel: function() {
      this.modalShow = false;
    },
    save: function() {
      this.modalShow = false;
      console.log("admin session", this.eventsession);
      if (this.eventsession.code) {
        this.updateRow(this.eventsession);
      } else {
        this.saveRow(this.eventsession);
      }
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
  created() {
    // Download rows for the page
    console.log("eventsession", this.eventsessions);
    this.downloadRows();
    this.weblinks_download();
    this.venues_download();
    this.events_download();
    this.sessiontypes_download();
  }
};
</script>
<style scoped>
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
.text-muted {
  margin-top: 5px;
  margin-bottom: 5px;
}
.container {
  margin-left: 220px;
  padding: 0 1rem;
}
</style>
<style lang="scss" scoped>
@import "../../../../scss/themes/blurred/variables";
.tag {
  float: left;
  text-decoration: none;
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
