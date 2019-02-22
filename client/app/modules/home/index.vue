<template lang="pug">
  .container
    .guide
      section
        h2
          span.text My Events
        fieldset
          h2(v-if="loaded_my_events.length == 0") No upcoming your events.
          .content.card-columns(v-if="loaded_my_events.length > 0")
            .card(v-for="item in loaded_my_events")
              img.img(src="http://lorempixel.com/600/300/city")
              .block
                small.primary.text-muted {{item.startDate | date}} - {{ item.endDate | date}}
                .title {{item.name}}
                p
                  | {{item.description | truncate(130)}}
                p.text-right
                  button.button(@click="onEdit(item.code)") 
                    | Edit
                  button.button.success(@click="onDetail(item.code)")                     
                    | Details
        fieldset.text-center(v-if="loaded_my_events.length > 0")
          button.button(@click="loadMore(true)") Load More...  
      section
        h2
          span.text Events Near you    
        fieldset
          .content.card-columns
            .card(v-for="item in loaded_events")
              img.img(src="http://lorempixel.com/600/300/city")
              .block
                small.primary.text-muted {{item.startDate | date}} - {{ item.endDate | date}}
                .title {{item.name}}
                p
                  | {{item.description | truncate(130)}}
                p
                  a.tag(v-for="weblink in item.weblinks", :href="weblink.url", target="blank") {{ weblink.label }}
                  a.link(:href="'#/schedule/' + item.code", style="float: right;") Details     
        fieldset.text-center(v-if="loaded_events.length > 0")
          button.button(@click="loadMore(false)") Load More...                    
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { each, find, assign, remove, isArray } from "lodash";

export default {
  data() {
    return {
      page_num: 0,
      page_size: 6
    };
  },
  computed: {
    ...mapGetters("session", ["me"]),
    ...mapGetters("events", ["events"]),
    loaded_my_events() {
      let loaded_my_events = [];
      if (this.me) {
        each(this.events, (value, key) => {
          if (value.creater.code === this.me.code) {
            loaded_my_events.push(value);
          }
        });
      }
      return loaded_my_events;
    },
    loaded_events() {
      let loaded_events = [];
      if (this.me) {
        each(this.events, (value, key) => {
          if (value.creater.code !== this.me.code) {
            loaded_events.push(value);
          }
        });
      }
      return loaded_events;
    }
  },
  methods: {
    ...mapActions("session", ["setCurrentPage", "setAdminView"]),
    ...mapActions("events", ["downloadEvents", "downloadMoreEvents"]),
    getTypographyInfo(elType) {
      if (this.$el) {
        let element = this.$el.querySelector(elType);
        if (element) {
          let style = window.getComputedStyle(element, null);
          return (
            style.fontFamily.split(",")[0] +
            " " +
            style.fontWeight +
            ", " +
            style.fontSize
          );
        }
      }
    },
    selEvent() {
      this.$router.push("schedule");
    },
    loadMore(my_events) {
      ++this.page_num;
      this.downloadMoreEvents({
        page_size: this.page_size,
        page_num: this.page_num,
        creater: this.me,
        add_events: true,
        my_events
      });
    },
    onEdit(eventId) {
      this.$router.push("/schedule/" + eventId + "/editEvent");
    },
    onDetail(eventId) {
      this.$router.push("/schedule/" + eventId);
    }
  },
  created: function() {
    this.setAdminView(false);
    this.setCurrentPage("Urban Tribuu");
    if (this.me) {
      this.downloadMoreEvents({
        page_size: this.page_size,
        page_num: this.page_num,
        creater: this.me,
        my_events: false,
        add_events: false
      });
      this.downloadMoreEvents({
        page_size: this.page_size,
        page_num: this.page_num,
        creater: this.me,
        my_events: true,
        add_events: true
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../scss/themes/blurred/variables";
.card-columns {
  column-count: 3;
  column-gap: 2.25em;
}
.container {
  margin-top: 2em;
  margin-left: 15em;
  margin-right: 15em;
}
a {
  text-decoration: none;
}
.button {
  margin-top: 50px;
}
.text {
  text-align: center;
}
.panel {
  cursor: pointer;
}
.headguide {
  font-size: 1.5rem;
  margin-bottom: 20px;
  padding: 8px 10px;
  text-align: center;

  background-color: rgba(darken($backgroundColor, 10%), 0.6);
  border: 1px solid darken($backgroundColor, 8%);
}
.form-group {
  border-radius: 0px;
}
section {
  &:not(:last-child) {
    margin-bottom: 40px;
  }

  > h2 {
    font-size: 1.5rem;
    margin-bottom: 20px;
    padding: 8px 10px;
    text-align: center;

    .number {
      color: #888;
    }

    .text {
      margin-left: 4px;
      font-weight: $fontLight;
      text-transform: uppercase;
    }

    clear: both;
  } // .title
} //. section

.buttons {
  margin-bottom: 20px;
}

.list {
  > * {
    margin-bottom: 20px;
  }
}

.panels {
  align-items: flex-start;
  .panel,
  .card {
    margin: 20px;
  }

  .card {
    max-width: 350px;
  }
}

.colors {
  $boxSize: 150px;

  .box {
    width: $boxSize;
    height: $boxSize + 20px;

    border: 1px solid darken($backgroundColor, 10%);
    border-radius: 6px;

    margin: 5px 20px;
    padding: 2px;

    .caption {
      float: left;
      width: 100%;
      text-align: center;
    }

    .main {
      float: left;
      width: 100%;
      height: $boxSize - 60px;
    } // .main

    .light {
      float: left;
      width: 50%;
      height: 30px;
    } // .light

    .dark {
      float: right;
      width: 50%;
      height: 30px;
    } // .dark

    .code {
      float: left;
      width: 100%;
      position: relative;
      margin-top: 5px;

      &:after {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        width: 100%;
        text-align: center;
        font-family: "Consolas";
        color: White;
      }
    } // .code

    $colors: $color1, $color2, $color3, $color4, $color5;

    $colors-light: $color1-light, $color2-light, $color3-light, $color4-light,
      $color5-light;
    $colors-dark: $color1-dark, $color2-dark, $color3-dark, $color4-dark,
      $color5-dark;

    @for $i from 1 through 5 {
      $c: nth($colors, $i);

      &.box#{$i} {
        .main {
          background-color: $c;
        }
        .light {
          background-color: nth($colors-light, $i);
        }
        .dark {
          background-color: nth($colors-dark, $i);
        }
        .code:after {
          content: "" + $c;
        }
      } // box
    } // for
  } // .box
} // .colors
</style>
