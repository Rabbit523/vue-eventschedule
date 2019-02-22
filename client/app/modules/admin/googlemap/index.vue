<template lang="pug">
  .google-map(:id="mapName")
</template>

<script>
export default {
  name: "google-map",
  props: ["name", "long", "lat"],
  data: function() {
    return {
      mapName: this.name,
      markerCoordinates: {
        latitude: this.lat,
        longitude: this.long
      }
    };
  },
  mounted: function() {
    const element = document.getElementById(this.mapName);
    const options = {
      zoom: 4,
      center: new google.maps.LatLng(this.lat, this.long)
    };
    const map = new google.maps.Map(element, options);
    const position = new google.maps.LatLng(
      this.markerCoordinates.latitude,
      this.markerCoordinates.longitude
    );
    const marker = new google.maps.Marker({
      position,
      map
    });
  }
};
</script>
<style scoped>
.google-map {
  height: 150px;
  margin: 0 auto;
  border-radius: 5px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
</style>
