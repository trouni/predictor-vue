<template>
  <div class="app-header">

    <div :class="$slots.default ? 'px-5 pt-5 pb-0' : 'px-5 pt-5 pb-4'">
      <div class="flex items-center gap-3">

        <!-- Competition photo — only shown when the title is the competition name -->
        <div
          v-if="competitionPhoto"
          class="flex-shrink-0 w-8 h-8 rounded-lg overflow-hidden shadow"
          style="border: 1px solid rgba(255,255,255,0.2)"
        >
          <img
            :src="competitionPhoto"
            :alt="title"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- Page / competition title -->
        <h1
          v-if="title"
          class="text-white font-bold leading-tight truncate"
          style="font-size: 1.35rem; letter-spacing: -0.01em"
        >
          {{ title }}
        </h1>

      </div>
    </div>

    <!-- Sub-header slot: leaderboard tabs, competition context, etc. -->
    <div v-if="$slots.default">
      <slot />
    </div>

    <!-- Hairline separator -->
    <div style="height: 1px; background: linear-gradient(90deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 100%)" />

  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    title: {
      type: String,
      required: false,
    },
    // Kept for backwards-compat with route meta — no longer rendered
    img: {
      type: String,
      required: false,
    },
  },

  computed: {
    ...mapGetters({
      currentCompetition: 'competitions/currentCompetition',
    }),

    // Only surface the photo when this header is actually showing the competition name,
    // i.e. title === competition name. Prevents it appearing on Profile, New Leaderboard, etc.
    competitionPhoto() {
      if (
        this.currentCompetition &&
        this.currentCompetition.photoUrl &&
        this.title === this.currentCompetition.name
      ) {
        return this.currentCompetition.photoUrl
      }
      return null
    },
  },
}
</script>
