import Vue from "vue";
import { mapGetters } from "vuex";
import moment from "moment";
import { validators } from "vue-form-generator";

import { find } from "lodash";

let _ = Vue.prototype._;

module.exports = {

	id: "weblinks",
	title: _("Weblinks"),

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
				title: _("Label"),
				field: "label",
				formatter(value, model) {
					return model ? model.label : "";
				}
			},
			{
				title: _("Url"),
				field: "url"
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
				label: _("Label"),
				model: "label",
				featured: true,
				required: true,
				placeholder: _("Weblink Label"),
				validator: validators.string

			},
			{
				type: "text",
				label: _("Url"),
				model: "url",
				featured: true,
				required: true,
				placeholder: _("Weblink Url"),
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
		addCaption: _("Add New Weblink"),
		saveCaption: _("Save"),
		cloneCaption: _("Clone"),
		deleteCaption: _("Delete")
	}

};
