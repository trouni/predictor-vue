<template>
  <div class="flex flex-col">

    <!-- Three-column picks grid — aligns spatially with the team cards above -->
    <div class="flex px-3 pb-2 gap-1">

      <!-- Home column -->
      <div :class="match.groupId ? 'w-1/3' : 'w-1/2'" class="flex flex-col gap-1 pt-1">
        <template v-if="hasPicks('home')">
          <BaseLink
            v-for="user in predictions['home']"
            :key="user.userId"
            :to="{ name: 'predictions', query: { userId: user.userId } }"
            class="flex items-center gap-1.5 min-w-0"
          >
            <div
              class="flex-shrink-0 w-6 h-6 rounded-full overflow-hidden border-2"
              :class="chipBorderClass('home', user.userId)"
            >
              <img
                v-if="user.photoKey || user.photo_key"
                :src="avatarUrl(user.photoKey || user.photo_key)"
                class="w-full h-full object-cover"
                :alt="user.name"
              />
              <img
                v-else
                :src="require('../assets/player.png')"
                class="w-full h-full object-cover"
                :alt="user.name"
              />
            </div>
            <span
              class="text-xs truncate font-medium leading-tight"
              :class="chipTextClass('home', user.userId)"
            >
              {{ isCurrentUser(user.userId) ? 'You' : user.name }}
            </span>
          </BaseLink>
        </template>
        <span v-else class="text-xs text-gray-300 italic pt-1 px-1">—</span>
      </div>

      <!-- Draw column (group stage only) -->
      <div v-if="match.groupId" class="w-1/3 flex flex-col gap-1 items-center pt-1">
        <template v-if="hasPicks('draw')">
          <div
            v-for="user in predictions['draw']"
            :key="user.userId"
            class="flex items-center gap-1.5 min-w-0"
          >
            <div
              class="flex-shrink-0 w-6 h-6 rounded-full overflow-hidden border-2"
              :class="chipBorderClass('draw', user.userId)"
            >
              <img
                v-if="user.photoKey || user.photo_key"
                :src="avatarUrl(user.photoKey || user.photo_key)"
                class="w-full h-full object-cover"
                :alt="user.name"
              />
              <img
                v-else
                :src="require('../assets/player.png')"
                class="w-full h-full object-cover"
                :alt="user.name"
              />
            </div>
            <span
              class="text-xs truncate font-medium leading-tight"
              :class="chipTextClass('draw', user.userId)"
            >
              {{ isCurrentUser(user.userId) ? 'You' : user.name }}
            </span>
          </div>
        </template>
        <span v-else class="text-xs text-gray-300 italic pt-1">—</span>
      </div>

      <!-- Away column -->
      <div :class="match.groupId ? 'w-1/3' : 'w-1/2'" class="flex flex-col gap-1 items-end pt-1">
        <template v-if="hasPicks('away')">
          <div
            v-for="user in predictions['away']"
            :key="user.userId"
            class="flex items-center gap-1.5 min-w-0"
          >
            <span
              class="text-xs truncate font-medium leading-tight"
              :class="chipTextClass('away', user.userId)"
            >
              {{ isCurrentUser(user.userId) ? 'You' : user.name }}
            </span>
            <div
              class="flex-shrink-0 w-6 h-6 rounded-full overflow-hidden border-2"
              :class="chipBorderClass('away', user.userId)"
            >
              <img
                v-if="user.photoKey || user.photo_key"
                :src="avatarUrl(user.photoKey || user.photo_key)"
                class="w-full h-full object-cover"
                :alt="user.name"
              />
              <img
                v-else
                :src="require('../assets/player.png')"
                class="w-full h-full object-cover"
                :alt="user.name"
              />
            </div>
          </div>
        </template>
        <span v-else class="text-xs text-gray-300 italic pt-1 px-1">—</span>
      </div>

    </div>

    <!-- Percentage bar -->
    <div class="px-3 pb-3 pt-1">
      <MatchPredictionsBar
        :predictions="predictions"
        :result="result"
        :match="match"
      />
    </div>

  </div>
</template>

<script>
import MatchPredictionsBar from '@/components/MatchPredictionsBar'
import { config } from '@/constants'

export default {
  name: 'MatchPredictions',

  components: { MatchPredictionsBar },

  props: {
    match: {
      type: Object,
      required: true,
    },
    predictions: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    result: {
      type: String,
      required: true,
    },
    currentUserId: {
      type: Number,
      required: true,
    },
  },

  methods: {
    hasPicks(column) {
      return this.predictions[column] && this.predictions[column].length > 0
    },
    isCurrentUser(userId) {
      return userId === this.currentUserId
    },
    isWinningColumn(column) {
      return column === this.result
    },

    // Avatar chip border: green for winning pick, red for wrong (current user only), gray otherwise
    chipBorderClass(column, userId) {
      const winning = this.isWinningColumn(column)
      const me = this.isCurrentUser(userId)
      const live = this.match.status === 'started'

      if (live) return 'border-gray-300'
      if (winning) return 'border-prediction-correct'
      if (me) return 'border-prediction-wrong'
      return 'border-gray-200'
    },

    // Text color mirrors the border logic
    chipTextClass(column, userId) {
      const winning = this.isWinningColumn(column)
      const me = this.isCurrentUser(userId)
      const live = this.match.status === 'started'

      if (live) return 'text-gray-500'
      if (winning && me) return 'text-prediction-correct font-semibold'
      if (winning) return 'text-prediction-correct'
      if (me) return 'text-prediction-wrong font-semibold'
      return 'text-gray-400'
    },

    // Build a Cloudinary thumbnail URL directly (avoids verbose CldContext wrapper for small images)
    avatarUrl(photoKey) {
      return `https://res.cloudinary.com/${config.cloudName}/image/upload/w_56,h_56,c_fill,g_face,r_max/${photoKey}`
    },
  },
}
</script>
