<template lang="pug">
	.container
		fieldset
			.block
				button.button(@click="create") Create New Participant
		fieldset
			.list
				.item(v-for="participant in participants")
					img.avatar(:src="participant.user.avatar")
					.body
						strong {{ participant.user.username }}
							.tag.success(v-if="participant.isRegistered") Registered
						p
							small.text-muted {{ participant.user.email}}
							em(style="margin-left: 15px;") {{ participant.event.name }}
							strong(style="margin-left: 15px;") {{ participant.registeredTimeStamp | formatDate}}
						p.text-justify {{ participant.notes }}

					.footer.text-right
						button.button.small.outline(@click="edit(participant)", style="margin-right: 15px;") Edit
						button.button.small.danger(@click="removeConfirm(participant)")
							| Delete

		el-dialog(title="Participant information",:visible.sync="modalShow", width="30%", @open="open")
			el-form(label-width="120px")
				el-form-item(label="User")
					el-select(v-model="participant.user", placeholder="Select")
						el-option(v-for="item in users", :key="item.code", :label="item.username", :value="item.code")
				el-form-item(label="Event")
					el-select(v-model="participant.event", placeholder="Select")
						el-option(v-for="item in events", :key="item.code", :label="item.name", :value="item.code")
				el-form-item(label="Email", :rules="[{ required: true, message: 'Please input email address', trigger: 'blur' }, { type: 'email', message: 'Please input correct email address', trigger: 'blur,change' }]")
					el-input(v-model="participant.email")
				el-form-item(label="Reg Date")
					el-date-picker(type="date", v-model="participant.registeredTimeStamp", placeholder="Pick a day")
				el-form-item(label="Registered")
					el-switch(v-model="participant.isRegistered")
				el-form-item(label="Notes")
					el-input(v-model="participant.notes", type="textarea", :rows="3")
				el-form-item(label="Pop up")
					el-switch(v-model="participant.seeNotRegisteredPopUp")
				el-form-item(label="Fav Session")
					el-select(v-model="participant.favoriteSession", multiple, placeholder="Select")
						el-option(v-for="item in eventsessions", :key="item.code", :label="item.name", :value="item.code")
				el-form-item(label="Reg Session")
					el-select(v-model="participant.registeredSession", multiple, placeholder="Select")
						el-option(v-for="item in eventsessions", :key="item.code", :label="item.name", :value="item.code")
			span(slot="footer", class="dialog-footer")
				el-button(@click="save", type="primary") Save
				el-button(@click="cancel") Cancel

		el-dialog(title="Alert", :visible.sync="dialogFormVisible",  width="400px")
			span Do you want delete this item?
			span(slot="footer", class="dialog-footer")
				el-button(@click="dialogFormVisible = false") Cancel
				el-button(type="primary" @click="remove") OK
</template>

<script>
	import toast from "../../../core/toastr";

	import { mapGetters, mapActions } from "vuex";

	export default {
	  computed: {
	    ...mapGetters("admin_participants", ["participants", "selected"]),
	    ...mapGetters("admin_events", ["events"]),
	    ...mapGetters("admin_eventsessions", ["eventsessions"]),
	    ...mapGetters("users", ["users"])
	  },

	  data() {
	    return {
	      modalShow: false,
	      dialogFormVisible: false,
	      participant: {
	        user: "",
	        email: "",
	        event: "",
	        registeredTimeStamp: "",
	        isRegistered: false,
	        registrationCode: "",
	        notes: "",
	        seeNotRegisteredPopUp: false,
	        favoriteSession: [],
	        registeredSession: []
	      }
	    };
	  },

	  methods: {
	    ...mapActions("admin_participants", [
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
	    ...mapActions({ events_download: "admin_events/downloadRows" }),
	    ...mapActions({
	      eventsessions_download: "admin_eventsessions/downloadRows"
	    }),
	    ...mapActions({ users_download: "users/downloadRows" }),
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
	        this.participant = Object.assign({}, this.selected[0]);
	      } else {
	        this.participant = Object.assign(
	          {},
	          {
	            user: "",
	            email: "",
	            event: "",
	            registeredTimeStamp: "",
	            isRegistered: false,
	            registrationCode: "",
	            notes: "",
	            seeNotRegisteredPopUp: false,
	            favoriteSession: [],
	            registeredSession: []
	          }
	        );
	      }
	    },
	    cancel: function() {
	      this.modalShow = false;
	    },
	    save: function() {
	      this.modalShow = false;
	      if (this.participant.code) {
	        this.updateRow(this.participant);
	      } else {
	        this.saveRow(this.participant);
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
	  created() {
	    // Download rows for the page
	    console.log(this.participants);
	    this.downloadRows();
	    this.events_download();
	    this.eventsessions_download();
	    this.users_download();
	  }
	};
</script>
<style scoped>
	.container {
	  margin-left: 210px;
	  padding: 0 1rem;
	}
</style>
