<template>
  <div
    :class="[
      'flex flex-col items-center p-3 relative',
      clickableStyle,
      opacityStyle,
    ]"
  >
    <!-- Subtle flag wash -->
    <img
      v-if="team.flagUrl && chosen"
      :src="team.flagUrl"
      class="absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-300 opacity-5 group-hover:opacity-8"
    />
    <p class="uppercase mb-1 h-8 leading-none flex items-center text-white font-bold">
      {{ team.name }}
    </p>
    <TeamBadge :flag="team.badgeUrl" :score="team.score" :etScore="team.etScore" :psScore="team.psScore" :status="status" />
    <span v-if="team.ranking" class="relative z-10 inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full mt-2 text-gray-200 bg-gray-500">
      FIFA #{{ team.ranking }}
    </span>
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
    chosen: {
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
