<template>
  <div
    class="ranking-row bg-ranking-card rounded-2xl shadow-sm overflow-hidden mx-auto w-full"
  >
    <div class="flex flex-col px-4" :class="containerPaddingClass">
      <div
        v-for="(ranking, index) in userRankings"
        :key="ranking.userId || ranking.id"
        class="flex items-center gap-3"
        :class="index > 0 ? 'border-t border-white/10 mt-2 pt-2' : ''"
      >
        <!-- Medal / position — shown only on the first row of a tied group -->
        <div
          v-if="!preTournament"
          class="flex-shrink-0 flex items-center justify-center w-9"
        >
          <template v-if="index === 0">
            <span
              v-if="position"
              class="font-bold text-gray-400 text-sm leading-none"
              v-html="ordinalize(position)"
            />
            <span
              v-else-if="paddingStart && ranking.rank"
              class="font-bold text-gray-400 text-sm leading-none"
              v-html="ordinalize(ranking.rank)"
            />
          </template>
        </div>

        <!-- Avatar -->
        <UserAvatar
          :photo-key="ranking.photoKey || ranking.photo_key"
          :name="ranking.name"
          :size="36"
        />

        <!-- Name + secondary stat -->
        <div class="flex-1 min-w-0">
          <BaseLink
            :to="{ name: 'predictions', query: { userId: ranking.userId || ranking.id } }"
            :disabled="!linkPredictions"
            class="block truncate text-white font-medium text-shadow text-sm"
          >
            {{ ranking.name }}
          </BaseLink>
          <p
            v-if="ranking.correctPredictions > 0"
            class="text-white/40 text-xs mt-0.5 leading-none"
          >
            {{ ranking.correctPredictions }} correct
          </p>
        </div>

        <!-- Points -->
        <div
          v-if="!preTournament"
          class="flex-shrink-0 flex items-baseline gap-0.5"
        >
          <span
            class="font-black leading-none text-shadow"
            :class="pointsFontClass"
            style="color: #ffffff"
          >
            {{ ranking.points }}
          </span>
          <span class="text-white/30 text-xs leading-none">pts</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UserAvatar from '@/components/UserAvatar'
import { ordinalize } from '@/utils/helpers'

export default {
  name: 'LeaderboardRanking',

  components: { UserAvatar },

  props: {
    userRankings: {
      type: Array,
      required: true,
    },
    position: {
      type: Number,
      default: null,
    },
    linkPredictions: {
      type: Boolean,
      default: false,
    },
    paddingStart: {
      type: Boolean,
      default: false,
    },
    preTournament: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    containerPaddingClass() {
      if (this.position === 1) return 'py-4'
      if (this.position === 2) return 'py-3.5'
      if (this.position === 3) return 'py-3'
      return 'py-2.5'
    },
    pointsFontClass() {
      if (this.position === 1) return 'text-2xl'
      if (this.position === 2) return 'text-xl'
      if (this.position === 3) return 'text-lg'
      return 'text-base'
    },
  },

  methods: {
    ordinalize,
  },
}
</script>

<style lang="scss" scoped>
.bg-ranking-card {
  background: rgba(255, 255, 255, 0.07);
}
.text-shadow {
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
}
</style>
