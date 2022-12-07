<template>
  <div
    :class="[
      'flex flex-col mt-2 items-center px-3',
      clickableStyle,
      opacityStyle,
    ]"
  >
    <p class="uppercase mb-1 h-8 leading-none flex items-center">
      {{ team.name }}
    </p>
    <TeamBadge :flag="team.badgeUrl" :score="team.score" :etScore="team.etScore" :psScore="team.psScore" :status="status" />
  </div>
</template>

<script>
import TeamBadge from './TeamBadge'

export default {
  components: { TeamBadge },

  props: {
    team: Object,
    status: {
      type: String,
      required: false,
    },
    clickable: {
      type: Boolean,
      default: false,
    },
    greyOut: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    clickableStyle() {
      return this.clickable ? 'cursor-pointer' : 'cursor-default'
    },
    opacityStyle() {
      if (this.greyOut) {
        return 'opacity-40'
      } else if (this.clickable) {
        return 'opacity-80'
      } else {
        return 'opacity-100'
      }
    },
  },
}
</script>
