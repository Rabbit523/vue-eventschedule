<template lang="pug">
	.logo
		a.nav-item(href="#")
			span
				strong {{first}}
				| {{last}}
</template>

<script>
	import { mapGetters } from "vuex";

	export default {
		computed: {
			...mapGetters("session", [
				"currentPage"
			]),
			first: {
				get: function() {
					return this.currentPage.split(" ")[0];
				}
			},
			last: {
				get: function() {
					return this.currentPage.split(" ")[1];
				}
			}
		}
	};

</script>

<style lang="scss">
</style>
