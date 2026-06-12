<template>
  <div
    class="ranking-row bg-ranking-card rounded-2xl shadow-sm overflow-hidden mx-auto w-full"
  >
    <div class="flex items-center gap-3 px-4" :class="paddingClass">

      <!-- Medal / position -->
      <div
        v-if="!preTournament"
        class="flex-shrink-0 flex items-center justify-center w-9"
      >
        <span
          v-if="position"
          class="font-bold text-gray-400 text-sm leading-none"
          v-html="ordinalize(position)"
        />
        <!-- Unranked user placeholder (no position available) -->
        <span
          v-else-if="paddingStart && userRankings[0] && userRankings[0].rank"
          class="font-bold text-gray-400 text-sm leading-none"
          v-html="ordinalize(userRankings[0].rank)"
        />
      </div>

      <!-- User rows (handles ties: multiple users at same rank) -->
      <div class="flex-1 min-w-0 flex flex-col" :class="position && position <= 3 ? 'gap-2.5' : 'gap-1.5'">
        <div
          v-for="ranking in userRankings"
          :key="ranking.userId || ranking.id"
          class="flex items-center gap-3"
        >
          <!-- Avatar -->
          <div
            class="flex-shrink-0 rounded-full overflow-hidden border-2 border-white shadow w-9 h-9"
          >
            <cld-context v-if="ranking.photoKey || ranking.photo_key" :cloudName="cloudName">
              <cld-image :publicId="ranking.photoKey || ranking.photo_key">
                <cld-transformation
                  width="100"
                  height="100"
                  gravity="face"
                  radius="max"
                  crop="fill"
                />
              </cld-image>
            </cld-context>
            <img
              v-else
              :src="require('../assets/player.png')"
              :alt="ranking.name"
              class="w-full h-full object-cover"
            />
          </div>

          <!-- Name -->
          <BaseLink
            :to="{ name: 'predictions', query: { userId: ranking.userId || ranking.id } }"
            :disabled="!linkPredictions"
            class="flex-1 min-w-0 truncate text-white font-medium text-shadow text-sm"
          >
            {{ ranking.name }}
          </BaseLink>
        </div>
      </div>

      <!-- Points -->
      <div
        v-if="!preTournament"
        class="flex-shrink-0 text-right text-shadow flex flex-col items-center gap-1"
      >
        <p
          class="font-black leading-none text-xl text-shadow"
          style="color: #fa5151"
        >
          {{ userRankings[0].points }}
        </p>
        <small
          class="leading-none text-xs text-shadow font-normal"
          style="color: #fa5151"
          >PTS</small
        >
      </div>

    </div>
  </div>
</template>

<script>
import { CldContext, CldImage, CldTransformation } from 'cloudinary-vue'
import { config } from '@/constants'
import { ordinalize } from '@/utils/helpers'

export default {
  name: 'LeaderboardRanking',

  components: { CldContext, CldImage, CldTransformation },

  props: {
    userRankings: {
      type: Array,
      required: true,
    },
    position: {
      type: Number,
      default: null,
    },
    points: {
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

  data() {
    return {
      cloudName: config.cloudName,
    }
  },

  computed: {
    paddingClass() {
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
.ranking-row {
  // Make Cloudinary images fill their circular containers correctly
  :deep(.cld-image),
  :deep(.cld-image img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}
.bg-ranking-card {
  background: rgba(255, 255, 255, 0.07);
}
.text-shadow {
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
}
</style>
