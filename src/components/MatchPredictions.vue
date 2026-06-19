<template>
  <div class="flex flex-col bg-prediction-info pt-2">

    <!-- Three-column picks grid — aligns spatially with the team cards above -->
    <div class="flex px-3 pb-2 gap-1">

      <!-- Home column -->
      <div :class="match.groupId ? 'w-1/3' : 'w-1/2'" class="flex flex-col gap-1 pt-1 md:px-5">
        <span
          class="text-xs font-semibold uppercase tracking-wider pb-2 text-center"
          :class="chipTextClass('home')"
        >{{match.teamHome.name}}</span>
        <template v-if="hasPicks('home')">
          <BaseLink
            v-for="user in predictions['home']"
            :key="user.userId"
            :to="{ name: 'predictions', query: { userId: user.userId } }"
            class="flex items-center gap-1.5 min-w-0"
          >
            <UserAvatar
              :photo-key="user.photoKey || user.photo_key"
              :name="user.name"
              :size="24"
              :border-class="`border-2 ${chipBorderClass('home', user.userId)}`"
            />
            <span
              class="text-xs truncate leading-tight text-white/80"
              :class="isCurrentUser(user.userId) ? 'font-bold' : 'font-medium'"
            >
              {{ user.name }}
            </span>
          </BaseLink>
        </template>
        <span v-else class="text-xs text-gray-300 italic pt-1 px-1 text-center">—</span>
      </div>

      <!-- Draw column (group stage only) -->
      <div v-if="match.groupId" class="w-1/3 flex flex-col gap-1 pt-1 md:px-5">
        <span
          class="text-xs font-semibold uppercase tracking-wider pb-2 text-center"
          :class="chipTextClass('draw')"
        >Draw</span>
        <template v-if="hasPicks('draw')">
          <div
            v-for="user in predictions['draw']"
            :key="user.userId"
            class="flex items-center gap-1.5 min-w-0"
          >
            <UserAvatar
              :photo-key="user.photoKey || user.photo_key"
              :name="user.name"
              :size="24"
              :border-class="`border-2 ${chipBorderClass('draw', user.userId)}`"
            />
            <span
              class="text-xs truncate leading-tight text-white/80"
              :class="isCurrentUser(user.userId) ? 'font-bold' : 'font-medium'"
            >
              {{ user.name }}
            </span>
          </div>
        </template>
        <span v-else class="text-xs text-gray-300 italic pt-1 text-center">—</span>
      </div>

      <!-- Away column -->
      <div :class="match.groupId ? 'w-1/3' : 'w-1/2'" class="flex flex-col gap-1 pt-1 md:px-5">
        <span
          class="text-xs font-semibold uppercase tracking-wider pb-2 text-center"
          :class="chipTextClass('away')"
        >{{match.teamAway.name}}</span>
        <template v-if="hasPicks('away')">
          <div
            v-for="user in predictions['away']"
            :key="user.userId"
            class="flex items-center gap-1.5 min-w-0"
          >
            <UserAvatar
              :photo-key="user.photoKey || user.photo_key"
              :name="user.name"
              :size="24"
              :border-class="`border-2 ${chipBorderClass('away', user.userId)}`"
            />
            <span
              class="text-xs truncate leading-tight text-white/80"
              :class="isCurrentUser(user.userId) ? 'font-bold' : 'font-medium'"
            >
              {{ user.name }}
            </span>
          </div>
        </template>
        <span v-else class="text-xs text-gray-300 italic pt-1 px-1 text-center">—</span>
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
import UserAvatar from '@/components/UserAvatar'

export default {
  name: 'MatchPredictions',

  components: { MatchPredictionsBar, UserAvatar },

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

    // Avatar chip border: For current user, green for winning pick, and red for wrong. Gray otherwise.
    chipBorderClass(column, userId) {
      const winning = this.isWinningColumn(column)
      const me = this.isCurrentUser(userId)
      const live = this.match.status === 'started'

      if (live) return 'border-gray-300'
      if (winning && me) return 'border-prediction-correct'
      if (me) return 'border-prediction-wrong'
      return 'border-gray-200'
    },

    // Text color for the column headers
    chipTextClass(column) {
      const winning = this.isWinningColumn(column)
      const live = this.match.status === 'started'

      if (live) return 'text-white/70'
      if (winning) return 'text-prediction-correct'
      return 'text-prediction-wrong'
    },
  },
}
</script>
<style lang="scss" scoped>
.bg-prediction-info {
  background-color: rgba(255, 255, 255, 0.04);
}
</style>
