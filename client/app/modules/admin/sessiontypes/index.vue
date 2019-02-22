<template lang="pug">
	.container
		fieldset
			.block
				button.button(@click="create") Create New Session Type
		.content.tables
			table.table.stripped.bordered
				thead
					tr
						th #
						th.sortable Name
						th.sortable Color
						th Functions
				tbody
					tr(v-for="(sessiontype, index) in sessiontypes")
						td {{ index }}
						td {{ sessiontype.name }}
						td
							div(:style="{width:size, height:size, backgroundColor: sessiontype.color, marginLeft: auto, marginRight: auto}")
						td
							button.button.small(@click="edit(sessiontype)") Edit
							button.button.small.danger(@click="removeConfirm(sessiontype)")
								i.icon.fa.fa-trash
								| Delete

		el-dialog(title="Event Session information",:visible.sync="modalShow", width="30%", @open="open")
			el-form(label-width="120px")
				el-form-item(label="Session Type")
					el-input(v-model="sessiontype.name")
				el-form-item(label="Session Color")
					el-color-picker(v-model="sessiontype.color")

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
	import Vue from "vue";
	import toast from "../../../core/toastr";

	import { mapGetters, mapActions } from "vuex";

	export default {
	  computed: mapGetters("admin_sessiontypes", ["sessiontypes", "selected"]),

	  /**
	   * Set page schema as data property
	   */
	  data() {
	    return {
	      dialogFormVisible: false,
	      size: "20px",
	      auto: "auto",
	      modalShow: false,
	      sessiontype: {
	        name: "",
	        color: ""
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
	    ...mapActions("admin_sessiontypes", [
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
	    edit: function(row) {
	      this.modalShow = true;
	      this.selectRow(row);
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
	    open: function() {
	      if (this.selected[0]) {
	        this.sessiontype = Object.assign({}, this.selected[0]);
	      } else {
	        this.sessiontype = Object.assign(
	          {},
	          {
	            name: "",
	            color: ""
	          }
	        );
	      }
	    },
	    cancel: function() {
	      this.modalShow = false;
	    },
	    save: function() {
	      this.modalShow = false;
	      if (this.sessiontype.code) {
	        this.updateRow(this.sessiontype);
	      } else {
	        this.saveRow(this.sessiontype);
	      }
	      this.clearSelection();
	    },
	    create: function() {
	      this.modalShow = true;
	    }
	  },

	  /**
	   * Call if the component is created
	   */
	  created() {
	    // Download rows for the page
	    this.downloadRows();
	  }
	};
</script>
<style scoped>
	.tag {
	  float: left;
	  text-decoration: none;
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
