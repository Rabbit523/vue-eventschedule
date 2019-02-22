<template lang="pug">
  div.container
    el-row
      el-col(:span="6")
        .card
          img.img(src="http://lorempixel.com/600/300/city")
          .block
            small.primary.text-muted {{selected_event.startDate | date}} - {{ selected_event.endDate | date}}
            .title {{selected_event.name}}
            p
              | {{ selected_event.description }}
          .block.text-right
            button.button.success(v-if="me.code === selected_event.creater.code", @click="addSession") Add Session
        .form-group
          button.button.outline(@click="is_calendar_view=true;is_weblinks_view=is_venues_view=is_workers_view=false") Calendar          
        .form-group
          button.button.outline(@click="is_venues_view=true;is_calendar_view=is_weblinks_view=is_workers_view=false") Venues
        .form-group          
          button.button.outline(@click="is_weblinks_view=true;is_venues_view=is_calendar_view=is_workers_view=false") Weblinks
        .form-group          
          button.button.outline(@click="is_workers_view=true;is_weblinks_view=is_venues_view=is_calendar_view=false") Workers                    
      el-col(:span="16", :offset="2", v-if="is_calendar_view")
        .panel
          .header
            small.primary {{selected_event.startDate | date}} - {{ selected_event.endDate | date}}
          .body
            Schedule(:time-ground="['00:00', '24:00']",:week-ground="event_during_days",:task-detail="event_sessions", :router="this.$router")
      el-col(:span="17", :offset="1", class="calendar", v-if="is_weblinks_view")
        section 
          h2
            span.text Weblinks
          .content.tables
            table.table.stripped.bordered
              thead
                tr
                  th #
                  th Label
                  th
                    i.fa.fa-globe
                    | URL
                  th Action
              tbody
                tr(v-for="(weblink, key) in event_weblinks")
                  td {{key}}
                  td {{weblink.label}}
                  td {{weblink.url}}
                  td 
                    button.button.success(@click="editWeblink(weblink)") edit
      el-col(:span="17", :offset="1", class="calendar", v-if="is_venues_view")        
        section 
          h2
            span.text Venues
          .content.card-columns
            .card(v-for="venue in event_venues")
              //- google-map(v-if="venue.leaflet", :name="venue.name", :long="venue.leaflet.long", :lat="venue.leaflet.lat")
              .block.title {{venue.name}}   -   {{venue.subname}}
                p.text-muted {{venue.address}}, {{venue.city}}, {{venue.country}}, {{venue.zipcode}}
                a.tag.primary(v-for="weblink in venue.weblinks", :href="weblink.url", target="blank") {{weblink.label}}
                p 
                | {{venue.description}}
              .block.text-right
                button.button(@click="editVenue(venue)") EDIT
      el-col(:span="17", :offset="1", class="calendar", v-if="is_workers_view") 
        section 
          h2
            span.text Workers
        .body
          .list
            .item(v-for="worker in event_workers")
              img.avatar(src="https://s3.amazonaws.com/uifaces/faces/twitter/kolage/73.jpg")
              .body
                strong {{worker.title}}
                p.text-justify {{worker.description}}
                p.text-right 
                  button.button(@click="editPeople(worker)") EDIT
              .footer.text-right
                small.text-muted {{worker.role}}

    el-dialog(title="New weblinks", :visible.sync="weblinkmodal",  width="400px")
      el-form(:model="modalweblink")
        el-form-item(label="Label", :label-width="formLabelWidth")
          el-input(v-model="modalweblink.label", auto-complete="on")
        el-form-item(label="URL", :label-width="formLabelWidth")
          el-input(v-model="modalweblink.url", auto-complete="on")
      span(slot="footer", class="dialog-footer")
        el-button(type="primary" @click="SaveModalWeblink") Save
        el-button(@click="CloseWeblink") Cancel
    el-dialog(title="Venue information", :visible.sync="modalShow", width="30%")
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

    el-dialog(title="People", :visible.sync="peoplemodal",  width="400px")
      el-form(label-width="120px")
        el-form-item(label="Title", :label-width="formLabelWidth")
          el-input(v-model="modalpeople.title", auto-complete="off")
        el-form-item(label="Descr", :label-width="formLabelWidth")
          el-input(v-model="modalpeople.description", auto-complete="off")
        el-form-item(label="Role", :label-width="formLabelWidth")
          el-input(v-model="modalpeople.role", auto-complete="off")
          span(slot="footer", class="dialog-footer")
        el-button(type="primary" @click="SavePeople") Save
        el-button(@click="ClosePeople") Cancel        
</template>

<script>
import Service from "../../../core/service";
import Schedule from "vue-schedule";
import datepicker from "vue-date";
import weblink_schema from "./weblinks_schema";
import workers_schema from "./workers_schema";
import AdminPage from "../../../core/DefaultAdminPage.vue";
import { find } from "lodash";
import GoogleMap from "../../admin/googlemap";

import { mapGetters, mapActions } from "vuex";

export default {
  props: ["ecode"],
  data() {
    return {
      is_calendar_view: true,
      is_weblinks_view: false,
      is_venues_view: false,
      is_workers_view: false,
      modalShow: false,
      weblink_schema,
      workers_schema,
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      dateRange: "",
      peoplemodal: false,
      value: "",
      selected: [],
      filterText: "",
      modalpeople: {
        title: "",
        description: "",
        role: ""
      },
      modalweblink: {
        label: "",
        url: "",
        code: ""
      },
      weblinkmodal: false,
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
      },
      data2: [
        {
          id: 1,
          label: "Venue",
          children: [
            {
              id: 9,
              label: "Galvanize"
            },
            {
              id: 10,
              label: "Pinterest"
            },
            {
              id: 11,
              label: "Yelp!"
            }
          ]
        }
      ],
      data1: [
        {
          id: 1,
          label: "Session Type",
          children: [
            {
              id: 9,
              label: "Keynote"
            },
            {
              id: 10,
              label: "Networking"
            },
            {
              id: 11,
              label: "Marketing Panel"
            },
            {
              id: 12,
              label: "Technology Panel"
            },
            {
              id: 13,
              label: "Workshop"
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      },
      formLabelWidth: "60px"
    };
  },
  components: {
    datepicker,
    Schedule,
    AdminPage,
    GoogleMap
  },
  computed: {
    ...mapGetters("events", [
      "events",
      "sessions",
      "weekgrounds",
      "event",
      "selectedVenue"
    ]),
    ...mapGetters("admin_weblinks", ["weblinks"]),
    ...mapGetters("session", ["me"]),
    event_workers() {
      let workers = [];
      this.event(this.ecode).eventSessions.forEach(session => {
        session.people.forEach(person => {
          let found = find(workers, item => item.code === person.code);
          if (!found) {
            workers.push(person);
          }
        });
      });
      return workers;
    },
    event_weblinks() {
      let weblinks = [];
      weblinks.push(...this.event(this.ecode).weblinks);
      this.event(this.ecode).eventSessions.forEach(session => {
        session.weblinks.forEach(weblink => {
          let found = find(weblinks, item => item.code === weblink.code);
          if (!found) {
            weblinks.push(weblink);
          }
        });
      });
      return weblinks;
    },
    event_venues() {
      let venues = [];
      this.event(this.ecode).eventSessions.forEach(session => {
        let found = find(venues, item => item.code === session.venue.code);
        if (!found) {
          venues.push(session.venue);
        }
      });
      return venues;
    },
    event_sessions() {
      if (this.ecode) {
        let event = this.event(this.ecode);
        let startdate = new Date(event.startDate);

        let enddate = new Date(event.endDate);

        let n =
          (enddate.getTime() - startdate.getTime()) / (3600 * 24 * 1000) + 1;

        let weeks = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        let cur = startdate.getDay();
        let sessions = [];
        for (let i = 0; i < n; i++, cur++) {
          sessions.push(new Array());
        }

        this.event(this.ecode).eventSessions.forEach(session => {
          let date = new Date(session.date);
          let startdate = new Date(this.event(this.ecode).startDate);
          let enddate = new Date(this.event(this.ecode).endDate);

          let h = startdate.getHours();
          let m = startdate.getMinutes();
          let s = startdate.getSeconds();
          let ms = startdate.getMilliseconds();
          let l = (h * 3600 + m * 60 + s) * 1000 + ms;

          let d = date.getTime() - (startdate.getTime() - l);

          if (d < 0) {
            toastr.error("invalued date!");
          }

          let n = Math.ceil(d / (3600 * 24 * 1000));

          let obj = {
            dateStart: session.startTime,
            dateEnd: session.endTime,
            title: session.name,
            color: session.sessionType.color,
            session: session
          };

          sessions[n].push(obj);
        });

        return sessions;
      } else {
        return this.sessions;
      }
    },
    event_during_days() {
      if (this.ecode) {
        let event = this.event(this.ecode);
        let startdate = new Date(event.startDate);

        let enddate = new Date(event.endDate);

        let n =
          (enddate.getTime() - startdate.getTime()) / (3600 * 24 * 1000) + 1;

        let weeks = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        let cur = startdate.getDay();

        let weekgrounds = [];
        for (let i = 0; i < n; i++, cur++) {
          weekgrounds.push(weeks[cur % 7]);
        }
        return weekgrounds;
      } else {
        return this.weekgrounds;
      }
    },
    selected_event() {
      let event = this.event(this.ecode);
      return event;
    }
  },
  methods: {
    ...mapActions("events", [
      "saveEvent",
      "created",
      "loadSessions",
      "setSelectedVenue",
      "updateWeblink",
      "updatePeople",
      "updateEventPeople",
      "updateEventWeblink",
      "updateEventVenue"
    ]),
    ...mapActions("session", ["setCurrentPage"]),
    ...mapActions({ weblinks_download: "admin_weblinks/downloadRows" }),
    addSession: function() {
      this.$router.push(this.$router.currentRoute.path + "/session");
    },
    cancelVenue: function() {
      this.modalShow = false;
    },
    saveVenue: function() {
      this.venue.id = "updated";
      this.updateEventVenue({venue: this.venue, ecode: this.ecode});
      this.modalShow = false;
    },
    editVenue: function(row) {
      this.venue = Object.assign({}, row);
      this.venue.weblinks = [];
      row.weblinks.forEach(element => {
        this.venue.weblinks.push(element.code);
      });
      this.modalShow = true;
    },
    editWeblink: function(weblink) {
      this.weblinkmodal = true;
      this.modalweblink = Object.assign({}, weblink);
    },
    editPeople: function(people) {
      this.peoplemodal = true;
      this.modalpeople = Object.assign({}, people);
    },
    SavePeople: function() {
      this.updateEventPeople({people: this.modalpeople, ecode: this.ecode, });
      this.peoplemodal = false;
    },
    ClosePeople: function() {
      this.peoplemodal = false;
    },
    SaveModalWeblink: function() {
      this.weblinkmodal = false;
      this.updateEventWeblink({weblink: this.modalweblink, ecode: this.ecode});
    },
    CloseWeblink: function() {
      this.weblinkmodal = false;
      this.modalweblink = {};
    }
  },
  mounted: function() {
    if (this.weblinks.length == 0) this.weblinks_download();
    this.setCurrentPage("Scheduling");
    this.loadSessions();
  }
};
</script>

<style lang="scss">
.filter-tree {
  min-height: 150px;
}
.el-tree {
  background: transparent;
  color: #aebbcd;
}
.el-tree-node:focus > .el-tree-node__content,
.el-tree-node__content:hover {
  background: transparent;
}
.el-tree-node:focus > .el-tree-node__content,
.el-tree-node__content:hover > .el-tree-node__label {
  font-size: 20px;
}
.el-tree-node__label {
  font-size: 18px;
}
.message {
  &:not(.selected) {
    span {
      color: black;
    }
  }
}
ol,
ul {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
  list-style: none;
}
blockquote,
q {
  quotes: none;
}
blockquote:before,
blockquote:after,
q:before,
q:after {
  content: "";
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}

.github-corner:hover .octo-arm {
  animation: octocat-wave 560ms ease-in-out;
}
@keyframes octocat-wave {
  0%,
  100% {
    transform: rotate(0);
  }
  20%,
  60% {
    transform: rotate(-25deg);
  }
  40%,
  80% {
    transform: rotate(10deg);
  }
}
@media (max-width: 500px) {
  .github-corner:hover .octo-arm {
    animation: none;
  }
  .github-corner .octo-arm {
    animation: octocat-wave 560ms ease-in-out;
  }
}

.tit {
  text-align: center;
  font-size: 4rem;
  margin-top: 4rem;
}
.auther {
  font-size: 2rem;
  text-align: center;
  margin-top: 1.5rem;
  margin-bottom: 4rem;
  color: #95a5a6;
}
.container {
  margin-top: 2em;
  margin-left: 10em;
  margin-right: 10em;
}
</style>
<style scoped>
.demonstration {
  display: block;
  color: #aebbcd;
  font-size: 18px;
  margin-bottom: 20px;
}
.calendar .container {
  margin: 0px;
}
section > h2 {
  font-size: 1.5rem;
  margin-bottom: 20px;
  padding: 8px 10px;
  background-color: rgba(8, 34, 44, 0.6);
  border: 1px solid #0a2835;
  border-radius: 8px;
  clear: both;
}
</style>
