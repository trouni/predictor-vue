<template>
  <div class="pb-24">

    <!-- ─── Active competition ─── -->
    <div class="px-4 pt-6 mb-6">
      <h3 class="text-xs font-semibold uppercase tracking-widest mb-3" style="color: rgba(255,255,255,0.5)">
        Active Competition
      </h3>

      <!-- Loading skeleton -->
      <div v-if="!currentCompetition" class="rounded-2xl overflow-hidden" style="background: rgba(255,255,255,0.12)">
        <div class="p-5 flex flex-col gap-3">
          <div class="h-6 w-48 rounded-full animate-pulse" style="background: rgba(255,255,255,0.15)" />
          <div class="h-4 w-32 rounded-full animate-pulse" style="background: rgba(255,255,255,0.1)" />
          <div class="h-10 rounded-xl animate-pulse" style="background: rgba(255,255,255,0.08)" />
        </div>
      </div>

      <!-- Active competition card -->
      <div
        v-else
        class="rounded-2xl overflow-hidden shadow-xl"
        style="background: rgba(255,255,255,0.13); border: 1px solid rgba(255,255,255,0.18)"
      >

        <!-- Card header: photo + name + date -->
        <div class="flex items-center gap-4 px-5 pt-5 pb-4">
          <div class="flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden shadow-md" style="background: rgba(255,255,255,0.1)">
            <img
              v-if="currentCompetition.photoUrl"
              :src="currentCompetition.photoUrl"
              :alt="currentCompetition.name"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="flex-1 min-w-0">
            <h2 class="text-white font-bold text-lg leading-tight truncate">
              {{ currentCompetition.name }}
            </h2>
            <p class="text-sm mt-0.5" style="color: rgba(255,255,255,0.5)">
              {{ formatDateRange(currentCompetition.startDate, currentCompetition.endDate) }}
            </p>
          </div>
          <!-- Active badge -->
          <span
            class="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
            style="background: rgba(12,245,116,0.15); color: #0cf574"
          >
            <span class="w-1.5 h-1.5 rounded-full" style="background: #0cf574" />
            Active
          </span>
        </div>

        <!-- Stats row -->
        <div
          class="flex items-center gap-4 px-5 py-3 border-t border-b"
          style="border-color: rgba(255,255,255,0.08); background: rgba(0,0,0,0.08)"
        >
          <!-- Leaderboards -->
          <div class="flex items-center gap-1.5">
            <BaseIcon name="trophy" class="text-xs" style="color: rgba(255,255,255,0.4)" />
            <span class="text-sm font-semibold text-white">{{ leaderboards.length }}</span>
            <span class="text-xs" style="color: rgba(255,255,255,0.4)">
              {{ leaderboards.length === 1 ? 'leaderboard' : 'leaderboards' }}
            </span>
          </div>

          <span style="color: rgba(255,255,255,0.15)">·</span>

          <!-- Predictions progress -->
          <div v-if="matchesLoaded" class="flex items-center gap-1.5">
            <BaseIcon name="futbol" class="text-xs" style="color: rgba(255,255,255,0.4)" />
            <span class="text-sm font-semibold text-white">{{ predictedCount }}/{{ totalMatchCount }}</span>
            <span class="text-xs" style="color: rgba(255,255,255,0.4)">predicted</span>
          </div>
          <div v-else class="h-4 w-24 rounded-full animate-pulse" style="background: rgba(255,255,255,0.1)" />
        </div>

        <!-- Predictions needed callout -->
        <div
          v-if="matchesLoaded && pendingCount > 0"
          class="mx-4 mt-4 rounded-xl px-4 py-3 flex items-center gap-3"
          style="background: rgba(250,81,81,0.12); border: 1px solid rgba(250,81,81,0.2)"
        >
          <span
            class="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
            style="background: rgba(250,81,81,0.2); color: #fa5151"
          >
            {{ pendingCount }}
          </span>
          <p class="flex-1 text-sm font-medium" style="color: rgba(255,255,255,0.8)">
            {{ pendingCount === 1 ? 'prediction' : 'predictions' }} still to make
          </p>
          <BaseLink
            :to="{ name: 'predictions' }"
            class="flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-full transition-opacity hover:opacity-80"
            style="background: #fa5151; color: white"
          >
            Predict →
          </BaseLink>
        </div>

        <!-- All done callout -->
        <div
          v-else-if="matchesLoaded && pendingCount === 0 && totalMatchCount > 0"
          class="mx-4 mt-4 rounded-xl px-4 py-3 flex items-center gap-3"
          style="background: rgba(12,245,116,0.1); border: 1px solid rgba(12,245,116,0.18)"
        >
          <BaseIcon name="check-circle" style="color: #0cf574; font-size: 1.1rem" />
          <p class="text-sm font-medium" style="color: rgba(255,255,255,0.75)">
            All caught up — no predictions pending
          </p>
        </div>

        <!-- Quick action links -->
        <div class="flex gap-2 px-4 pt-4 pb-5">
          <BaseLink
            :to="{ name: 'predictions' }"
            class="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80"
            style="background: rgba(255,255,255,0.12); color: white"
          >
            <BaseIcon name="bolt" style="font-size: 0.75rem" />
            Predict
          </BaseLink>
          <BaseLink
            :to="{ name: 'rankings' }"
            class="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80"
            style="background: rgba(255,255,255,0.12); color: white"
          >
            <BaseIcon name="list-ol" style="font-size: 0.75rem" />
            Rankings
          </BaseLink>
          <BaseLink
            :to="{ name: 'results' }"
            class="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80"
            style="background: rgba(255,255,255,0.12); color: white"
          >
            <BaseIcon name="flag-checkered" style="font-size: 0.75rem" />
            Results
          </BaseLink>
        </div>

      </div>
    </div>

    <!-- ─── Switch competition ─── -->
    <div v-if="otherCompetitions.length" class="px-4">
      <h3 class="text-xs font-semibold uppercase tracking-widest mb-3" style="color: rgba(255,255,255,0.5)">
        Other Competitions
      </h3>

      <div class="flex flex-col gap-3">
        <div
          v-for="competition in otherCompetitions"
          :key="competition.id"
          class="rounded-2xl overflow-hidden"
          style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1)"
        >
          <div class="flex items-center gap-3 px-4 py-4">
            <!-- Photo -->
            <div class="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden" style="background: rgba(255,255,255,0.1)">
              <img
                v-if="competition.photoUrl"
                :src="competition.photoUrl"
                :alt="competition.name"
                class="w-full h-full object-cover"
              />
            </div>

            <!-- Name + dates -->
            <div class="flex-1 min-w-0">
              <p class="text-white font-semibold text-sm truncate">{{ competition.name }}</p>
              <p class="text-xs mt-0.5" style="color: rgba(255,255,255,0.4)">
                {{ formatDateRange(competition.startDate, competition.endDate) }}
              </p>
            </div>

            <!-- Past badge + Switch button -->
            <div class="flex-shrink-0 flex items-center gap-2">
              <span
                v-if="competitionEnded(competition.endDate)"
                class="text-xs font-medium px-2 py-1 rounded-full"
                style="background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.35)"
              >
                Past
              </span>
              <button
                @click="switchToCompetition(competition.id)"
                class="text-xs font-semibold px-3 py-1.5 rounded-full transition-opacity hover:opacity-80 focus:outline-none"
                style="background: rgba(255,255,255,0.15); color: white"
              >
                Switch →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Competitions',

  data() {
    return {
      matchesLoaded: false,
    }
  },

  async mounted() {
    await this.fetchCompetitions()
    // Load leaderboards + matches for current competition in parallel
    await Promise.all([
      this.fetchLeaderboards(),
      this.fetchMatches().then(() => { this.matchesLoaded = true }),
    ])
    this.$emit('init')
  },

  computed: {
    ...mapGetters({
      competitions: 'competitions/competitions',
      currentCompetitionId: 'competitions/currentCompetitionId',
      currentCompetition: 'competitions/currentCompetition',
      leaderboards: 'leaderboards/leaderboards',
      matches: 'matches/matches',
    }),

    otherCompetitions() {
      return [...this.competitions]
        .reverse()
        .filter(c => c.id !== this.currentCompetitionId)
    },

    totalMatchCount() {
      return this.matches.length
    },

    predictedCount() {
      return this.matches.filter(m => m.prediction).length
    },

    // Upcoming matches with no prediction yet
    pendingCount() {
      return this.matches.filter(
        m => !m.prediction && m.status !== 'finished' && m.status !== 'started'
      ).length
    },
  },

  methods: {
    ...mapActions({
      fetchCompetitions: 'competitions/fetchCompetitions',
      fetchLeaderboards: 'leaderboards/fetchLeaderboards',
      fetchMatches: 'matches/fetchMatches',
      selectCompetition: 'competitions/selectCompetition',
    }),

    async switchToCompetition(competitionId) {
      await this.selectCompetition(competitionId)
      this.$router.push({ name: 'predictions' })
    },

    competitionEnded(endDate) {
      return new Date().setHours(0, 0, 0, 0) > new Date(endDate).setHours(0, 0, 0, 0)
    },

    formatDateRange(startDate, endDate) {
      if (!startDate && !endDate) return ''
      const fmt = (d) => {
        if (!d) return ''
        const date = new Date(d)
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      }
      if (!endDate) return `From ${fmt(startDate)}`
      if (!startDate) return `Until ${fmt(endDate)}`
      // Same year — omit year from start date
      const start = new Date(startDate)
      const end = new Date(endDate)
      if (start.getFullYear() === end.getFullYear()) {
        const startStr = start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
        return `${startStr} – ${fmt(endDate)}`
      }
      return `${fmt(startDate)} – ${fmt(endDate)}`
    },
  },
}
</script>
