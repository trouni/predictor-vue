<template>
  <div :class="['flex flex-col mt-2 items-center px-3', clickableStyle]">
    <p class="uppercase mb-1 h-8 leading-none flex items-center">
      {{ team.name }}
    </p>
    <TeamBadge :flag="team.badgeUrl" :score="team.score" :status="status" />
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
  },

  computed: {
    clickableStyle() {
      return this.clickable ? 'cursor-pointer' : 'cursor-default opacity-80'
    },
  },
}
</script>
