import Vue from "vue";
import toastr from "../../../../core/toastr";
import { LOAD, ADD, SELECT, CLEAR_SELECT, UPDATE, REMOVE } from "./types";
import Service from "../../../../core/service";
let weblinkService = new Service("weblinks");


export const selectRow = ({ commit }, row, multiSelect) => {
	commit(SELECT, row, multiSelect);
};

export const clearSelection = ({ commit }) => {
	commit(CLEAR_SELECT);
};

export const downloadRows = ({ commit }) => {
	weblinkService.rest("find").then((data) => {
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
	weblinkService.rest("create", model).then((data) => {
		if (data) {
			created({ commit }, data, true);
			toastr.success("Created Weblink successfuly");
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
	weblinkService.rest("update", row).then((data) => {
		if (data) {
			commit(UPDATE, data);
			toastr.success("Updated Weblink successfuly");
		}
	}).catch((err) => {
		toastr.error(err.message);
	});
};

export const updated = ({ commit }, row) => {
	commit(UPDATE, row);
};

export const removeRow = ({ commit }, row) => {
	weblinkService.rest("remove", { code: row.code }).then((data) => {
		commit(REMOVE, row);
		toastr.success("Removed Weblink successfuly");
	}).catch((err) => {
		toastr.error(err.message);
	});
};

export const removed = ({ commit }, row) => {
	commit(REMOVE, row);
};
