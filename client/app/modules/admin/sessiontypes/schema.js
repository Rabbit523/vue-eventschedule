import Vue from "vue";
import { mapGetters } from "vuex";
import moment from "moment";
import { colorTypes } from "./types";
import { validators } from "vue-form-generator";

import { find } from "lodash";

let _ = Vue.prototype._;

module.exports = {

	id: "sessiontypes",
	title: _("Session Type"),

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
				title: _("Name"),
				field: "name",
			},
			{
				title: _("color"),
				field: "color"
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
				label: _("Name"),
				model: "name",
				featured: true,
				required: true,
				placeholder: _("Name"),
				validator: validators.required

			},
			{
				type: "select",
				label: _("Color"),
				values: colorTypes,
				model: "color",
				required: true,
				placeholder: _("Color"),
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
		addCaption: _("Add New Color"),
		saveCaption: _("Save"),
		cloneCaption: _("Clone"),
		deleteCaption: _("Delete")
	}

};
