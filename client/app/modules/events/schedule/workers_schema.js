import Vue from "vue";
import { mapGetters } from "vuex";
import moment from "moment";
import { validators } from "vue-form-generator";

import { find } from "lodash";

let _ = Vue.prototype._;

module.exports = {

	id: "workers",
	title: _("Workers"),

	table: {
		multiSelect: true,
		columns: [
			{
				title: _("ID"),
				field: "code",
				align: "left",
				formatter(value, model) {
					return model ? model.code : "";
				}
			},
			{
				title: _("Title"),
				field: "title"
			},
			{
				title: _("Description"),
				field: "description"
			},
			{
				title: _("Role"),
				field: "role"
			}
		]
	},

	form: {
		fields: [
			{
				type: "text",
				label: _("ID"),
				model: "code",
				readonly: true,
				disabled: true,
				multi: false,
				get(model) {
					if (model.code)
						return model.code;
					else
						return _("willBeGenerated");
				}
			},
			{
				type: "text",
				label: _("Title"),
				model: "title",
				required: true,
				validator: validators.required

			},
			{
				type: "text",
				label: _("Description"),
				model: "description",
				required: true,

			},
			{
				type: "text",
				label: _("Role"),
				model: "role",
				featured: true,
				required: true,
				validator: validators.string
			}
		]
	},

	options: {
		searchable: true,

		enableNewButton: true,
		enabledSaveButton: true,
		enableDeleteButton: true,
		enableCloneButton: false,

		validateAfterLoad: false, // Validate after load a model
		validateAfterChanged: false, // Validate after every changes on the model
		validateBeforeSave: true // Validate before save a model
	},

	events: {
		onSelect: null,
		onNewItem: null,
		onCloneItem: null,
		onSaveItem: null,
		onDeleteItem: null,
		onChangeItem: null,
		onValidated(model, errors, schema) {
			if (errors.length > 0)
				console.warn("Validation error in page! Errors:", errors, ", Model:", model);
		}
	},

	resources: {
		addCaption: _("AddNewWorker"),
		saveCaption: _("Save"),
		cloneCaption: _("Clone"),
		deleteCaption: _("Delete")
	}

};
