<template lang="pug">
  div.container
    el-row
      el-col(:span="12")
        .panel
          .header
            small.primary {{selected_event.startDate | date}} - {{ selected_event.endDate | date}}
          .body
            Schedule(:time-ground="['00:00', '24:00']", :week-ground="event_during_days", :task-detail="event_sessions")    
      el-col.buttonshow(:span="12")
        .form-group       
          button.button(@click="hideSession") Hide
      el-col.session(:span="12" v-if="me.code === selected_event.creater.code")
        .form-group
          p(class="demonstration new-session") Session information
        .form-group
          input(placeholder="Session Name", v-model="session.name").form-control
        .form-group
          textarea(placeholder="Session details....", v-model="session.description", rows="4").form-control
        .form-group
          p(class="demonstration") Session Date
          el-date-picker(type="date", v-model="session.date", placeholder="Pick a session day", :default-value="new Date()", @change="validateSessionDate")
        .form-group
          el-row
            el-col(:span="12")
              .form-group
                p(class="demonstration") {{ "Start Time" }}
                el-time-select( :picker-options="{start: '00:00', step: '00:15', end: '23:59'}", v-model="session.startTime", placeholder="Pick a start time", format="HH:mm", @change="validateStartTime")
            el-col(:span="12")
              .form-group
                p(class="demonstration") {{ "End Time" }}
                el-time-select( :picker-options="{start: '00:00', step: '00:15', end: '23:59'}", v-model="session.endTime", placeholder="Pick a end time", format="HH:mm", @change="validateEndTime")
        .form-group
          el-row
            .form-group
              el-radio(v-model="session.isPublished", label="1") Private
              el-radio(v-model="session.isPublished", label="2") Publish
          el-row
            el-col(:span="11")
              p(class="demonstration") {{ "Venue" }}
              venue-select(label="name", taggable, push-tags, :options="venues", v-model="session.venue", :create-option="createVenue")
            el-col(:span="11", :offset="2")
              p(class="demonstration") {{ "Weblinks" }}
              weblink-select(label="label", key="code", taggable, multiple, push-tags, :options="weblinks", v-model="session.weblinks", :create-option="createWeblink")
          el-row            
            el-col(:span="11")
              p(class="demonstration") {{ "Session Type" }}
              sessiontype-select(label="name", taggable, push-tags, :options="sessiontypes", v-model="session.sessionType", :create-option="createSessionType")
            el-col(:span="11", :offset="2")
              p(class="demonstration") {{ "People" }}
              people-select(label="title", taggable, multiple, key="code", push-tags, :options="peoples", v-model="session.people", :create-option="createPeople")
          el-row            
            el-col(:span="11")
              p(class="demonstration") {{ "Session Max Capacity" }}
              input(placeholder="Session Max Capacity", v-model="session.maxCapacity").form-control
            el-col(:span="11", :offset="2")
              p(class="demonstration") {{ "Session Warn Capacity" }}
              input(placeholder="Session Warn Capacity", v-model="session.warnCapacity").form-control              
        .content.flex.align-center.justify-space-around.buttons
          button.button(@click="createSession") Save Session
          //- button.button(@click="showParticipants") Show Participants
          //- button.button(@click="createTicketBtnClick") Create Tickets
      el-col.session(:span="12" v-if="me.code !== selected_event.creater.code")
        .card
          .ribbon.right.red
            span published
          .block.item
            .title {{session.name}}
            small.text-muted {{session.startTime}} - {{ session.endTime}} {{session.date | date}}        
            p
              | {{session.description}}
          .block.item
            p(style="border-bottom: 1px solid #14546d;padding-bottom: 10px;")
              strong {{session.creater.fullName}}
              small.text-muted {{session.creater.email}}
          .block
            .title Venue
            p
              | {{session.venue.name}} &nbsp;&nbsp;&nbsp;
              small.text-muted {{session.venue.subname}}
            p
              | {{session.venue.description}}
            p.text-muted              
              | {{session.venue.address}} {{session.venue.city}} {{session.venue.country}}
            google-map(v-if="session.venue.leaflet", :name="session.venue.name", :long="session.venue.leaflet.long", :lat="session.venue.leaflet.lat")
          .block.item
            .title Weblinks
            span(v-for="weblink in session.weblinks")
              a.link(:href="weblink.url") {{weblink.label}}
          .block.text-right
            button.button.success(v-if="me.code !== selected_event.creater.code && !isRegisteredEventSession(me)", @click="registerEventSession") Register Session            
            button.button.success(v-if="me.code !== selected_event.creater.code && isRegisteredEventSession(me)", @click="unregisterEventSession") Unregister Session            
    el-dialog(title="New weblinks", :visible.sync="weblinkmodal",  width="400px", @open="Open")
      el-form(:model="modalweblink")
        el-form-item(label="Label", :label-width="formLabelWidth")
          el-input(v-model="modalweblink.label", auto-complete="on")
        el-form-item(label="URL", :label-width="formLabelWidth")
          el-input(v-model="modalweblink.url", auto-complete="on")
      span(slot="footer", class="dialog-footer")
        el-button(type="primary" @click="SaveWeblink") Save
        el-button(@click="CloseWeblink") Cancel
    el-dialog(title="Event Session information",:visible.sync="sessiontypemodal", width="30%", @open="OpenSessionType")
      el-form(label-width="120px")
        el-form-item(label="Session Type")
          el-input(v-model="modalsessiontype.name")
        el-form-item(label="Session Color")
          el-color-picker(v-model="modalsessiontype.color")
      span(slot="footer", class="dialog-footer")
        el-button(@click="SaveSessionType", type="primary") Save
        el-button(@click="CloseSessionType") Cancel
    el-dialog(title="People", :visible.sync="peoplemodal",  width="400px", @open="OpenPeople")
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
    venue-modal
</template>

<script>
import Service from "../../../core/service";
import Schedule from "vue-schedule";
import VenueSelect from "../VenueSelect";
import WeblinkSelect from "../WeblinkSelect";
import SessionTypeSelect from "../SessionTypeSelect";
import PeopleSelect from "../PeopleSelect";
import VenueModal from "../VenueModal";
import { mapGetters, mapActions } from "vuex";
import { weekdaysMin } from "moment";
import toastr from "../../../core/toastr";
import moment from "moment";
import { find } from "lodash";
import GoogleMap from "../../admin/googlemap";

export default {
  props: ["ecode"],
  data() {
    return {
      data: {
        startDate: "",
        startTime: "",
        date: Date.now,
        endTime: "",
        venue: "",
        eventId: this.currentEvent
      },
      venue: "",
      form: {
        name: "",
        region: "",
        date1: Date.now,
        date2: Date.now,
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      session: {
        name: "",
        subtitle: "",
        date: "",
        startTime: "",
        endTime: "",
        description: "",
        weblinks: [],
        venue: "",
        sessionType: "",
        people: [],
        warnCapacity: "",
        maxCapacity: "",
        addOnPrice: "",
        event: "",
        isPublished: "1"
      },

      modalweblink: {
        label: "",
        url: ""
      },

      isShow: true,

      fweblink: false,

      modalsessiontype: {
        name: "",
        color: ""
      },

      fsessiontype: false,

      modalpeople: {
        title: "",
        description: "",
        role: ""
      },

      fpeople: false,

      fsession: false,

      formLabelWidth: "60px"
    };
  },
  components: {
    Schedule,
    "venue-select": VenueSelect,
    "venue-modal": VenueModal,
    "weblink-select": WeblinkSelect,
    "sessiontype-select": SessionTypeSelect,
    "people-select": PeopleSelect,
    GoogleMap
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

    sessiontypemodal: {
      get: function() {
        return this.sessiontypeDisplay;
      },
      set: function(sync) {
        this.setSessionTypeDisplay(sync);
      }
    },

    peoplemodal: {
      get: function() {
        return this.peopleDisplay;
      },
      set: function(sync) {
        this.setPeopleDisplay(sync);
      }
    },
    ...mapGetters("events", [
      "events",
      "venues",
      "currentEvent",
      "selectedVenue",
      "setSelectedVenue",
      "sessions",
      "selsession",
      "vsession",
      "weekgrounds",
      "weblinks",
      "weblink",
      "weblinkDisplay",
      "selweblink",
      "sessiontypes",
      "sessiontype",
      "sessiontypeDisplay",
      "selsessiontype",
      "peoples",
      "people",
      "peopleDisplay",
      "selpeople",
      "weblinkPopulate",
      "sessionTypePopulate",
      "peoplePopulate"
    ]),
    ...mapGetters("events", ["event"]),
    ...mapGetters("session", ["me"]),
    selected_event() {
      let event = this.event(this.ecode);
      return event;
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
          console.log(obj);

          sessions[n].push(obj);
        });

        return sessions;
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
    }
  },
  methods: {
    ...mapActions("events", [
      "saveSession",
      "updateSession",
      "setselSession",
      "isSession",
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
      "loadSessionTypes",
      "saveSessionType",
      "updateSessionType",
      "selectSessionType",
      "setselSessionType",
      "setSessionTypeDisplay",
      "loadPeoples",
      "savePeople",
      "updatePeople",
      "selectPeople",
      "setselPeople",
      "setPeopleDisplay",
      "updateEventPeople",
      "updateEventWeblink",
      "updateEventSessionType",
      "registerSession"
    ]),
    ...mapActions("session", ["setCurrentPage"]),
    // ...mapActions("admin_weblinks", ["downloadRows"]),
    // ...mapActions("admin_sessiontypes", ["downloadRows"]),
    hideSession() {
      this.$router.go(-1);
    },
    createSession() {
      if (this.currentEvent) this.session.event = this.currentEvent;
      this.session.event = this.ecode;

      if (this.fsession) {
        this.updateSession({ session: this.session, router: this.$router });
        this.setselSession(false);
        this.fsession = false;
      } else {
        if (this.session.event === "") this.session.event = this.ecode;
        this.saveSession({ session: this.session, router: this.$router });
      }
    },

    addVenueBtnClick() {
      this.$router.push("venue");
    },
    showParticipants() {
      this.$router.push("participant");
    },
    createTicketBtnClick() {
      this.$router.push("addon");
    },
    createVenue: function(newOption) {
      this.setNewVenue({ name: newOption, id: "newVenue" });
      this.setVenueDisplay(true);
    },

    validateSessionDate: function() {
      var date = new Date(this.session.date);
      var startdate = new Date(this.event(this.ecode).startDate);
      var enddate = new Date(this.event(this.ecode).endDate);
      console.log("validatesessiondate", date, startdate, enddate);
      if (date < startdate || date > enddate) {
        toastr.error("Invalid Date!");
        this.session.date = "";
      }
    },

    validateStartTime: function() {
      var time = this.session.startTime;
      var starttime = "00:00";
      var endtime = "23:59";

      console.log("validatesessiontime", time, starttime, endtime);
      if (time > this.session.endTime) {
        this.session.endTime = "";
      }
    },

    validateEndTime: function() {
      var time = this.session.endTime;
      var starttime = "06:00";
      var endtime = "21:00";

      if (time < this.session.startTime) {
        this.session.startTime = "";
      }
    },

    createWeblink: function(newOption) {
      this.weblinkmodal = true;
      this.setselWeblink(false);

      this.fweblink = true;

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

    SaveWeblink: function() {
      this.weblinkmodal = false;
      if (this.selweblink == true) {
        this.updateEventWeblink({
          weblink: this.modalweblink,
          ecode: this.ecode
        });
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

    Open: function() {
      if (this.selweblink == true) {
        this.modalweblink = this.weblink;
      } else {
        if (!this.fweblink) {
          this.modalweblink = Object.assign(
            {},
            {
              code: "qwer123",
              label: "",
              url: ""
            }
          );
          if (this.weblinkPopulate) {
            this.modalweblink.label = this.weblinkPopulate;
            // this.event.weblinks.push(Object.assign({}, {label: this.weblinkPopulate, url: ""}));
          }
        } else this.fweblink = false;
      }
    },

    /////////sessiontype/////////////
    createSessionType: function(newOption) {
      console.log("CREATEweblink:");
      console.log(this.selsessiontype);
      this.sessiontypemodal = true;
      this.setselSessionType(false);
      this.fsessiontype = true;
      this.modalsessiontype = Object.assign(
        {},
        {
          name: "",
          color: ""
        }
      );
      this.modalsessiontype.name = newOption;
      this.modalsessiontype.color = "";
    },

    SaveSessionType: function() {
      this.sessiontypemodal = false;

      if (this.selsessiontype == true) {
        // this.updateEventSessionType({sessionType: this.modalsessiontype, ecode: this.ecode})
        this.updateSessionType(this.modalsessiontype);
        this.setselSessionType(false);
      } else {
        this.saveSessionType(this.modalsessiontype);
        this.session.sessionType = this.modalsessiontype;
      }
    },

    CloseSessionType: function() {
      this.sessiontypemodal = false;
      if (this.selsessiontype == true) {
        this.setselSessionType(false);
      }
    },

    OpenSessionType: function() {
      if (this.selsessiontype == true) {
        this.modalsessiontype = this.sessiontype;
      } else {
        if (!this.fsessiontype) {
          this.modalsessiontype = Object.assign(
            {},
            {
              name: "",
              color: ""
            }
          );
          if (this.sessionTypePopulate) {
            this.modalsessiontype.name = this.sessionTypePopulate;
          }
        } else this.fsessiontype = false;
      }
    },

    //////////////people//////////////
    createPeople: function(newOption) {
      this.peoplemodal = true;
      this.setselPeople(false);
      this.fpeople = true;
      this.modalpeople = Object.assign(
        {},
        {
          code: "qwer123",
          title: "",
          description: "",
          role: ""
        }
      );
      this.modalpeople.title = newOption;
      this.modalpeople.description = "";
      this.modalpeople.role = "";
      return this.modalpeople;
    },

    SavePeople: function() {
      this.peoplemodal = false;

      if (this.selpeople == true) {
        // this.updatePeople(this.modalpeople);
        this.setselPeople(false);
        this.updateEventPeople({ people: this.modalpeople, ecode: this.ecode });
      } else {
        this.savePeople(this.modalpeople);
      }
    },

    ClosePeople: function() {
      this.peoplemodal = false;
      if (this.selpeople == true) {
        this.setselPeople(false);
      }
    },

    OpenPeople: function() {
      if (this.selpeople == true) {
        this.modalpeople = this.people;
      } else {
        if (!this.fpeople) {
          this.modalpeople = Object.assign(
            {},
            {
              code: "qwer123",
              title: "",
              description: "",
              role: ""
            }
          );
          if (this.peoplePopulate) {
            this.modalpeople.title = this.peoplePopulate;
          }
        } else this.fpeople = false;
      }
    },

    registerEventSession: function() {
      var warnCapacity = this.session.warnCapacity;
      var _warnCapacity;
      if (this.session.maxCapacity !== null) {
        if (warnCapacity.includes("%")) {
          warnCapacity.replace("%", "");
          warnCapacity = parseInt(warnCapacity);
          _warnCapacity = this.session.maxCapacity * warnCapacity / 100;
          if (_warnCapacity <= this.session.participants.length) {
            toastr.error("Participants filling up");
          } else {
          }
        } else {
          if (warnCapacity <= this.session.participants.length) {
            toastr.error("Participants filling up");
          } else {
          }
        }
      }
      this.session.participants.push(this.me);
      this.registerSession(this.session);

    },

    unregisterEventSession: function() {
      var i;
      for (i = 0; i < this.session.participants.length; i++) {
        if (this.session.participants[i].code == this.me.code) {
          break;
        }
      }
      this.session.participants.splice(i, 1);
      this.registerSession(this.session);
    },

    isRegisteredEventSession: function() {
      let found = find(
        this.session.participants,
        item => item.code == this.me.code
      );


      
      return found ? true : false;
    }
  },

  created: function() {
    this.setCurrentPage("Session");
    this.loadVenue();
    this.loadWeblinks();
    this.loadSessionTypes();
    this.loadPeoples();

    if (this.selsession) {
      this.session = this.vsession.session;
      this.setselSession(false);
      this.fsession = true;
    } else {
      // var obj = {
      //   dateStart: "",
      //   dateEnd: "",
      //   title: "",
      //   color: "",
      //   session: {
      //     name: "",
      //     subtitle: "",
      //     date: "",
      //     startTime: "",
      //     endTime: "",
      //     isPublished: false,
      //     description: "",
      //     weblinks: [],
      //     venue: "",
      //     sessionType: "",
      //     maxCapacity: "",
      //     addOnPrice: "",
      //     event: ""
      //   }
      // };
      // this.isSession(obj);
    }
  },
  watch: {
    selsession: function() {
      console.log("watch vsession", this.vsession);
      this.session = Object.assign({}, this.vsession.session);
      this.setselSession(false);
      this.fsession = true;
    },
    selectedVenue: function(newSelectedVenue, oldSelectedVenue) {
      this.session.venue = Object.assign({}, newSelectedVenue);
    },
    weblink: function(newWeblink, oldWeblink) {
      let found = find(
        this.session.weblinks,
        item => item.code == "qwer123" || item.code == newWeblink.code
      );
      if (found) {
        found.code = newWeblink.code;
        found.label = newWeblink.label;
        found.url = newWeblink.url;
      } else {
        this.session.weblinks.push(Object.assign({}, newWeblink));
      }
    },
    sessiontype: function(newSessiontype, oldSessiontype) {
      this.session.sessionType = Object.assign({}, newSessiontype);
    },
    people: function(newPeople, oldPeople) {
      let found = find(
        this.session.people,
        item => item.code == "qwer123" || item.code == newPeople.code
      );
      if (found) {
        found.code = newPeople.code;
        found.label = newPeople.label;
        found.url = newPeople.url;
      } else {
        this.session.people.push(Object.assign({}, newPeople));
      }
    }
  }
};
</script>

<style lang="scss">
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
.form-group .el-input__inner {
  border: 1px solid #1c95b8;
  background-color: #0c3241;
  color: #ffffff;
}
.form-group {
  .el-table {
    color: white;
  }
  .el-table,
  .el-table__expanded-cell {
    background-color: #fff0;
  }
  .el-table td,
  .el-table th.is-leaf {
    border-bottom: none;
  }
  .el-table th,
  .el-table tr {
    cursor: pointer;
    background-color: #fff0;
  }
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #fff0;
  }
  .el-table::before {
    background-color: #fff0;
  }
}
</style>
<style scoped>
.add-venue {
  margin-left: 20px;
  color: white;
  font-weight: 700;
}
.el-dropdown-link {
  cursor: pointer;
  color: white;
}
.el-icon-arrow-down {
  font-size: 15px;
}
.demonstration {
  display: block;
  color: #aebbcd;
  font-size: 18px;
  margin-bottom: 20px;
}
.session {
  padding: 0 2rem;
}
.buttonshow {
  padding: 0 2rem;
  text-align: right;
}
</style>
