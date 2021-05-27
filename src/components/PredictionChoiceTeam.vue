<template>
  <div :class="['flex flex-col my-2 items-center px-3', cursor]">
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
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    cursor() {
      return this.disabled ? 'cursor-default' : 'cursor-pointer'
    },
  },
}
</script>
