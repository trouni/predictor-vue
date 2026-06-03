<template>
  <div
    class="ranking-row bg-white rounded-2xl shadow-sm overflow-hidden mx-auto"
    :class="rowWidthClass"
  >
    <div class="flex items-center gap-3 px-4" :class="paddingClass">

      <!-- Medal / position -->
      <div class="flex-shrink-0 flex items-center justify-center" :class="posColClass">
        <span v-if="position === 1" class="text-3xl leading-none">🥇</span>
        <span v-else-if="position === 2" class="text-2xl leading-none">🥈</span>
        <span v-else-if="position === 3" class="text-xl leading-none">🥉</span>
        <span
          v-else-if="position"
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
            class="flex-shrink-0 rounded-full overflow-hidden border-2 border-white shadow"
            :class="avatarClass"
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
            class="flex-1 min-w-0 truncate text-gray-800 font-medium"
            :class="nameFontClass"
          >
            {{ ranking.name }}
          </BaseLink>
        </div>
      </div>

      <!-- Points -->
      <div class="flex-shrink-0 text-right">
        <template v-if="userRankings[0].totalPredictions || userRankings[0].total_predictions">
          <p class="font-black leading-none" :class="pointsFontClass" style="color: #fa5151">
            {{ userRankings[0].points }}
          </p>
          <p v-if="userRankings[0].possiblePoints" class="text-xs text-gray-400 font-normal mt-0.5">
            / {{ userRankings[0].possiblePoints }}
          </p>
        </template>
        <p v-else class="text-xs text-gray-400 italic font-normal leading-none">yet to predict</p>
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
  },

  data() {
    return {
      cloudName: config.cloudName,
    }
  },

  computed: {
    rowWidthClass() {
      if (this.position === 1) return 'w-full'
      if (this.position === 2) return 'w-[97%]'
      if (this.position === 3) return 'w-[94%]'
      return 'w-[91%]'
    },
    paddingClass() {
      if (this.position === 1) return 'py-4'
      if (this.position === 2) return 'py-3.5'
      if (this.position === 3) return 'py-3'
      return 'py-2.5'
    },
    posColClass() {
      return this.position && this.position <= 3 ? 'w-9' : 'w-7'
    },
    avatarClass() {
      if (this.position === 1) return 'w-14 h-14'
      if (this.position === 2) return 'w-12 h-12'
      if (this.position === 3) return 'w-11 h-11'
      return 'w-9 h-9'
    },
    nameFontClass() {
      if (this.position === 1) return 'text-base'
      return 'text-sm'
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
</style>
