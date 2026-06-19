<template>
  <div class="flex flex-col gap-1.5">
    <!-- Round scoring strip -->
    <div class="bg-white/10 rounded-2xl px-4 py-3">
      <p class="text-white/40 text-xs uppercase tracking-widest font-semibold mb-1.5">Points per correct pick</p>
      <div
        ref="scoringStrip"
        class="flex overflow-x-auto hide-scrollbar gap-1"
      >
        <div
          v-for="(round, index) in scoringRounds"
          :key="round.key"
          :data-round="round.key"
          class="flex-shrink-0 flex items-center py-1.5 rounded-full text-xs font-semibold transition-all"
          :class="[
            round.key === currentRoundKey
              ? 'text-white shadow-sm font-bold drop-shadow'
              : 'text-white/40',
            index === 0 ? 'pl-0 pr-1.5' : 'px-1.5',
          ]"
        >
          {{ round.label }}
          <span
            class="font-normal"
            :class="round.key === currentRoundKey ? 'text-white drop-shadow' : 'text-white/25'"
          >&nbsp;{{ round.points }}pts</span>
        </div>
      </div>
    </div>

    <!-- Pre-tournament placeholder for the Global (auto-join) leaderboard -->
    <div
      v-if="showPreTournamentPlaceholder"
      class="bg-ranking-card rounded-2xl shadow-sm w-full px-6 py-8 text-center"
    >
      <div class="text-4xl mb-3">🏆</div>
      <h3 class="font-bold text-white text-lg mb-1">
        {{ leaderboard.name }}
      </h3>
      <p class="text-white/80 text-sm mb-5">{{ leaderboard.description }}</p>
      <div
        class="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 mb-5"
      >
        <span class="font-semibold text-gray-700 text-sm">
          {{ playerCount }}
        </span>
        <span class="text-gray-500 text-sm">players signed up</span>
      </div>
      <p class="text-gray-400 text-xs leading-relaxed">
        Rankings will appear here once the tournament kicks off and predictions
        start rolling in. The top {{ leaderboard.rankingsTopN || 10 }} players
        will be shown.
      </p>
    </div>

    <!-- Ranked rows -->
    <template v-else>

      <!-- Pre-tournament header for private leaderboards -->
      <div
        v-if="isPreTournament && leaderboard.autoJoin === false"
        class="bg-white/10 rounded-2xl px-4 py-3"
      >
        <p class="text-white/40 text-xs uppercase tracking-widest font-semibold">
          Players ready for the first kickoff
        </p>

      </div>

      <LeaderboardRanking
        v-for="{ position } in ranks"
        :key="position"
        :userRankings="usersAtRank(position)"
        :position="position"
        :link-predictions="true"
        :pre-tournament="isPreTournament && leaderboard.autoJoin === false"
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
    </template>

    <!-- Actions -->
    <LeaderboardActions :leaderboard="leaderboard" class="mt-4" />

    <!-- Stats -->
    <LeaderboardStats
      v-if="!isPreTournament"
      :leaderboard="leaderboard"
      class="mt-4"
    />
  </div>
</template>

<script>
import LeaderboardRanking from '@/components/LeaderboardRanking'
import LeaderboardActions from '@/components/LeaderboardActions'
import LeaderboardStats from '@/components/LeaderboardStats'
import { mapGetters } from 'vuex'

export default {
  name: 'LeaderboardRankingsCard',

  components: { LeaderboardRanking, LeaderboardActions, LeaderboardStats },

  props: {
    leaderboard: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      scoringRounds: [
        { key: 'group', label: 'Group', points: 3 },
        { key: 'r32', label: 'R32', points: 4 },
        { key: 'r16', label: 'R16', points: 5 },
        { key: 'qf', label: 'QF', points: 6 },
        { key: 'sf', label: 'SF', points: 7 },
        { key: 'final', label: 'Final', points: 8 }
      ],
    }
  },

  computed: {
    ...mapGetters({
      currentUser: 'auth/currentUser',
      currentCompetition: 'competitions/currentCompetition',
      matches: 'matches/matches',
    }),

    isPreTournament() {
      const now = Date.now()
      if (this.matches.length) {
        const firstKickoff = Math.min(
          ...this.matches.map(m => new Date(m.kickoffTime).getTime())
        )
        return firstKickoff > now
      }
      if (!this.currentCompetition?.startDate) return false
      return new Date(this.currentCompetition.startDate).getTime() > now
    },

    showPreTournamentPlaceholder() {
      return this.leaderboard.autoJoin && this.isPreTournament
    },

    playerCount() {
      return (this.leaderboard.users || []).length
    },

    sortedUsers() {
      const users = (this.leaderboard.users || []).slice()
      const hasRank = users.some(u => u.rank !== null && u.rank !== undefined)
      // Sort by points descending; use server rank as tiebreaker to preserve
      // server-side ordering within a tied group
      const sorted = users.sort((a, b) => {
        const pointsDiff = (b.points || 0) - (a.points || 0)
        if (pointsDiff !== 0) return pointsDiff
        return hasRank ? (a.rank ?? 999) - (b.rank ?? 999) : 0
      })
      // Assign standard competition ranks in a single pass (1,2,2,4...)
      let rank = 1
      return sorted.map((u, i) => {
        if (i > 0 && (u.points || 0) < (sorted[i - 1].points || 0)) rank = i + 1
        return { ...u, rank }
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
        .map(u => ({ position: u.rank }))
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

    currentRoundKey() {
      if (!this.matches.length) return null
      const active = this.matches.filter(m => m.status !== 'finished')
      if (!active.length) return 'final'
      active.sort((a, b) => new Date(a.kickoffTime) - new Date(b.kickoffTime))
      const next = active[0]
      if (next.groupId) return 'group'
      const map = { 2: 'r32', 3: 'r16', 4: 'qf', 5: 'sf', 6: 'final' }
      return map[next.roundNumber] || null
    },
  },

  watch: {
    currentRoundKey(key) {
      if (key) this.$nextTick(() => this.scrollActiveRoundIntoView())
    },
  },

  mounted() {
    this.$nextTick(() => this.scrollActiveRoundIntoView())
  },

  methods: {
    usersAtRank(rank) {
      return this.sortedUsers.filter(u => u.rank === rank)
    },

    scrollActiveRoundIntoView() {
      const strip = this.$refs.scoringStrip
      if (!strip || !this.currentRoundKey) return
      const pill = strip.querySelector(`[data-round="${this.currentRoundKey}"]`)
      if (pill) {
        const reducedMotion =
          window.matchMedia &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches
        pill.scrollIntoView({
          behavior: reducedMotion ? 'auto' : 'smooth',
          inline: 'center',
          block: 'nearest',
        })
      }
    },
  },
}
</script>

<style scoped>
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.bg-ranking-card {
  background: rgba(255, 255, 255, 0.07);
}
</style>
