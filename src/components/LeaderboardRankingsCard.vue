<template>
  <div class="flex flex-col gap-1.5">
    <!-- Ranked rows -->
    <LeaderboardRanking
      v-for="{ position, points } in ranks"
      :key="position"
      :userRankings="usersAtRank(position)"
      :position="position"
      :link-predictions="true"
      :points="points"
    />

    <!-- "Your position" strip — shown when current user is outside the visible ranks -->
    <template v-if="!isCurrentUserVisible && currentUserEntry">
      <!-- Visual separator -->
      <div class="flex items-center gap-3 px-4 py-1">
        <div class="flex-1 border-t border-dashed border-white/40" />
        <span class="text-white/40 text-xs font-medium">your position</span>
        <div class="flex-1 border-t border-dashed border-white/40" />
      </div>

      <LeaderboardRanking
        :userRankings="[
          {
            userId: currentUser.id,
            id: currentUser.id,
            name: currentUser.name,
            photoKey: currentUser.photoKey || currentUser.photo_key,
            points: currentUserEntry.points,
            rank: currentUserEntry.rank,
          },
        ]"
        :position="currentUserEntry.rank || null"
        :padding-start="true"
        :link-predictions="false"
      />
    </template>

    <!-- Actions -->
    <LeaderboardActions :leaderboard="leaderboard" class="mt-4" />
  </div>
</template>

<script>
import LeaderboardRanking from '@/components/LeaderboardRanking'
import LeaderboardActions from '@/components/LeaderboardActions'
import { mapGetters } from 'vuex'

export default {
  name: 'LeaderboardRankingsCard',

  components: { LeaderboardRanking, LeaderboardActions },

  props: {
    leaderboard: {
      type: Object,
      required: true,
    },
  },

  computed: {
    ...mapGetters({ currentUser: 'auth/currentUser' }),

    sortedUsers() {
      const users = (this.leaderboard.users || []).slice()
      const hasRank = users.some(u => u.rank !== null && u.rank !== undefined)
      if (!hasRank) {
        const byPoints = users.sort((a, b) => (b.points || 0) - (a.points || 0))
        return byPoints.map(u => ({
          ...u,
          rank: byPoints.findIndex(x => x.points === u.points) + 1,
        }))
      }
      return users.sort((a, b) => {
        if (a.rank !== b.rank) return (a.rank || 999) - (b.rank || 999)
        return (b.points || 0) - (a.points || 0)
      })
    },

    // How many unique rank positions to show
    lastVisibleRank() {
      if (this.sortedUsers.length === 0) return 0
      const topN = this.leaderboard.rankingsTopN
      if (topN && this.sortedUsers.length >= topN) {
        // Show up to the rank at position topN (handles ties at the boundary)
        return this.sortedUsers[topN - 1].rank || topN
      }
      return (
        this.sortedUsers[this.sortedUsers.length - 1].rank ||
        this.sortedUsers.length
      )
    },

    // Unique {position, points} pairs for ranks within the visible window
    ranks() {
      const seen = new Set()
      return this.sortedUsers
        .filter(u => {
          const r = u.rank || 999
          if (r > this.lastVisibleRank) return false
          if (seen.has(r)) return false
          seen.add(r)
          return true
        })
        .map(u => ({ position: u.rank, points: u.points }))
    },

    // Current user's entry from this leaderboard
    currentUserEntry() {
      return this.sortedUsers.find(u => u.userId === this.currentUser.id)
    },

    // True if the current user appears within the visible ranked rows
    isCurrentUserVisible() {
      if (!this.currentUserEntry) return false
      return (this.currentUserEntry.rank || 999) <= this.lastVisibleRank
    },
  },

  methods: {
    // Returns all users tied at a given rank position
    usersAtRank(rank) {
      return this.sortedUsers.filter(u => u.rank === rank)
    },
  },
}
</script>
