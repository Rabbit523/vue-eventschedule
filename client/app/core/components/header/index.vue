<template lang="pug">
	section.page-header

		.menu-toggle.left
			i.fa.fa-bars

		logo.left

		user-box.right

		search-box.right

		create-event.right
</template>

<script>
	import Logo from "./logo";
	import SearchBox from "./search-box";
	import UserBox from "./user-box";
	import CreateEvent from "./create-event";

	export default {
		components: {
			Logo,
			SearchBox,
			UserBox,
			CreateEvent
		},

		props: [
			"toggleSidebar"
		]

	};

</script>

<style lang="scss">
</style>
