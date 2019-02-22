<template lang="pug">
	.container
		fieldset
			.block
				button.button(@click="create") Create New Ticket
		fieldset
			.content.card-columns
					.card.primary(v-for="addon in addons")
						.block
							.title {{addon.ticketName}}
							p {{addon.limited ? "limited" : "unlimited"}}
							p Ticket Amount : {{addon.amount}}
							p {{addon.restrictedRegistration ? "restrictedRegistration" : "unrestrictedRegistration"}}
							p {{addon.ticketCode}}
						.block.text-right
							button.button.small(@click="edit(addon)") EDIT
							button.button.danger.small(@click="removeConfirm(addon)") DELETE

		el-dialog(title="Ticket information",:visible.sync="modalShow", width="30%", @open="open")
			el-form(label-width="120px")
				el-form-item(label="Ticket name")
					el-input(v-model="addon.ticketName")
				el-form-item(label="Ticket Code")
					el-input(v-model="addon.ticketCode")
				el-form-item(label="Ticket Limited")
					el-switch(v-model="addon.limited")
				el-form-item(label="Restricted")
					el-switch(v-model="addon.restrictedRegistration")
				el-form-item(label="Ticket Amount")
					el-input-number(v-model="addon.amount", :max="10000", :min="1")
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
	    ...mapGetters("admin_addons", ["addons", "selected"])
	  },

	  /**
	   * Set page schema as data property
	   */
	  data() {
	    return {
	      modalShow: false,
	      dialogFormVisible: false,
	      addon: {
	        id: "",
	        limited: false,
	        restrictedRegistration: false,
	        ticketCode: "",
	        ticketName: "",
	        amount: 1,
	        validSessionIDs: []
	      }
	    };
	  },

	  methods: {
	    ...mapActions("admin_addons", [
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
	      this.selectRow(row);
	      this.modalShow = true;
	    },
	    removeConfirm: function(row) {
	      this.selectRow(row);
	      this.dialogFormVisible = true;
	    },
	    remove: function() {
	      this.dialogFormVisible = false;
	      this.removeRow(this.selected);
	    },
	    open: function() {
			if (this.selected) {
				this.addon = Object.assign({}, this.selected);
			} else {
				this.addon = Object.assign({}, {limited: true, restrictedRegistration: true, amount: 1});
			}
	    },
	    cancel: function() {
	      this.modalShow = false;
	    },
	    save: function() {
		  this.modalShow = false;
	      if (this.addon.code) {
	        this.updateRow(this.addon);
	      } else {
			  this.saveRow(this.addon);
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
	.container {
	  margin-left: 210px;
	  padding: 0 1rem;
	}
	.tag {
	  margin-bottom: 1em;
	  text-decoration: none;
	}
	.card-columns {
	  column-count: 6;
	}
</style>
