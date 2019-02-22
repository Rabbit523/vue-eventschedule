<template>
	<div class="container">
  <el-table
    :data="tableData4"
    style="width: 100%; background: transparent;"
    max-height="1000">
    <el-table-column
      fixed
      prop="date"
      label="Date"
      width="150">
    </el-table-column>
    <el-table-column
      prop="name"
      label="Name"
      width="120">
    </el-table-column>
    <el-table-column
      prop="state"
      label="State"
      width="120">
    </el-table-column>
    <el-table-column
      prop="city"
      label="City"
      width="120">
    </el-table-column>
    <el-table-column
      prop="address"
      label="Address"
      width="300">
    </el-table-column>
    <el-table-column
      prop="zip"
      label="Zip"
      width="120">
    </el-table-column>
    <el-table-column
      fixed="right"
      label="Operations"
      width="120">
      <template slot-scope="scope">
        <el-button
          @click.native.prevent="deleteRow(scope.$index, tableData4)"
          type="text"
          size="small">Remove</el-button>
      </template>
    </el-table-column>
  </el-table>
</div>
</template>

<script>
	import Service from "../../../core/service";
	import { mapGetters, mapActions } from "vuex";

	export default {
	  methods: {
	    deleteRow(index, rows) {
	      rows.splice(index, 1);
	    }
	  },
	  data() {
	    return {
	      tableData4: [
	        {
	          date: "2016-05-03",
	          name: "Tom",
	          state: "California",
	          city: "Los Angeles",
	          address: "No. 189, Grove St, Los Angeles",
	          zip: "CA 90036"
	        },
	        {
	          date: "2016-05-02",
	          name: "Tom",
	          state: "California",
	          city: "Los Angeles",
	          address: "No. 189, Grove St, Los Angeles",
	          zip: "CA 90036"
	        },
	        {
	          date: "2016-05-04",
	          name: "Tom",
	          state: "California",
	          city: "Los Angeles",
	          address: "No. 189, Grove St, Los Angeles",
	          zip: "CA 90036"
	        },
	        {
	          date: "2016-05-01",
	          name: "Tom",
	          state: "California",
	          city: "Los Angeles",
	          address: "No. 189, Grove St, Los Angeles",
	          zip: "CA 90036"
	        },
	        {
	          date: "2016-05-08",
	          name: "Tom",
	          state: "California",
	          city: "Los Angeles",
	          address: "No. 189, Grove St, Los Angeles",
	          zip: "CA 90036"
	        },
	        {
	          date: "2016-05-06",
	          name: "Tom",
	          state: "California",
	          city: "Los Angeles",
	          address: "No. 189, Grove St, Los Angeles",
	          zip: "CA 90036"
	        },
	        {
	          date: "2016-05-07",
	          name: "Tom",
	          state: "California",
	          city: "Los Angeles",
	          address: "No. 189, Grove St, Los Angeles",
	          zip: "CA 90036"
	        }
	      ]
	    };
	  }
	};
</script>

<style lang="scss" scoped>
	@import "../../../../scss/themes/blurred/variables";
	@import "../../../../scss/common/mixins";
	.container {
	  margin-top: 2em;
	}
	.demonstration {
	  display: block;
	  color: #aebbcd;
	  font-size: 18px;
	  margin-bottom: 20px;
	}
	.el-tag--success {
	  background-color: rgb(103, 194, 58);
	  border-color: rgba(103, 194, 58, 0.2);
	  color: #000000;
	  font-size: 17px;
	  font-weight: 700;
	}
</style>
<style>
	.el-table th, .el-table tr {
		background: transparent
	}
	.el-table {
		color: white;
	}
</style>
