<template>
  <FontAwesomeIcon
    v-if="source === 'font-awesome'"
    v-on="$listeners"
    v-bind="$attrs"
    :icon="[prefix, name]"
  />
  <span
    v-else-if="source === 'custom'"
    v-on="$listeners"
    v-bind="$attrs"
    :class="customIconClass"
  />
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library as fontAwesomeIconLibrary } from '@fortawesome/fontawesome-svg-core'
import camelCase from 'lodash/camelCase'
// https://fontawesome.com/icons
fontAwesomeIconLibrary.add(
  require('@fortawesome/free-solid-svg-icons/faSync').definition,
  require('@fortawesome/free-solid-svg-icons/faBullseye').definition,
  require('@fortawesome/free-solid-svg-icons/faSquarePollVertical').definition,
  require('@fortawesome/free-solid-svg-icons/faUser').definition
)
export default {
  components: {
    FontAwesomeIcon,
  },
  inheritAttrs: false,
  props: {
    source: {
      type: String,
      default: 'font-awesome',
    },
    name: {
      type: String,
      required: true,
    },
    prefix: {
      type: String,
      default: 'fa',
    }
  },
  computed: {
    // Gets a CSS module class, e.g. iconCustomLogo
    customIconClass() {
      return this.$style[camelCase('icon-custom-' + this.name)]
    },
  },
}
</script>
