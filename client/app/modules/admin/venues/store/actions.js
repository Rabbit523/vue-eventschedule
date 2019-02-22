import Vue from "vue";
import toastr from "../../../../core/toastr";
import { LOAD, ADD, SELECT, CLEAR_SELECT, UPDATE, REMOVE } from "./types";
import Service from "../../../../core/service";
let venueService = new Service("venues");


export const selectRow = ({ commit }, row, multiSelect) => {
	commit(SELECT, row, multiSelect);
};

export const clearSelection = ({ commit }) => {
	commit(CLEAR_SELECT);
};

export const downloadRows = ({ commit }) => {
	venueService.rest("find").then((data) => {
		if (data) {
			commit(LOAD, data);
		} else {
			toastr.error("Request error!");
		}
	}).catch((err) => {
		toastr.error(err.message);
	});
};

export const saveRow = ({ commit }, model) => {
	venueService.rest("create", model).then((data) => {
		if (data) {
			created({ commit }, data, true);
			toastr.success("Created Venue successfuly");
		} else {
			toastr.error("Request error!");
		}
	}).catch((err) => {
		toastr.error(err.message);
	});
};

export const created = ({ commit }, row, needSelect) => {
	commit(ADD, row);
	if (needSelect)
		commit(SELECT, row, false);
};

export const updateRow = ({ commit }, row) => {
	venueService.rest("update", row).then((data) => {
		if (data) {
			updated({ commit }, data);
			toastr.success("Updated Venue successfuly");
		}
	}).catch((err) => {
		toastr.error(err.message);
	});
};

export const updated = ({ commit }, row) => {
	commit(UPDATE, row);
};

export const removeRow = ({ commit }, row) => {
	venueService.rest("remove", { code: row.code }).then((data) => {
		commit(REMOVE, row);
		toastr.success("Removed Venue successfuly");
	}).catch((err) => {
		toastr.error(err.message);
	});
};

export const removed = ({ commit }, row) => {
	commit(REMOVE, row);
};
