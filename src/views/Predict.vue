<template>
  <div class="min-h-full p-4 pb-24 flex flex-col justify-start">

    <!-- Predict card flow -->
    <PredictCard
      v-if="pendingMatches.length"
      :matches="pendingMatches"
      :editMode="allMatches"
      @done="onAllDone"
    />

    <!-- Empty state: all predictions made -->
    <div v-else class="flex flex-col items-center justify-center gap-5 py-16 text-center">
      <div
        class="w-20 h-20 rounded-full flex items-center justify-center shadow-lg"
        style="background: linear-gradient(135deg, #0cf574, #6690b7)"
      >
        <BaseIcon name="check" class="text-white fa-2x" />
      </div>
      <div>
        <p class="text-white text-xl font-bold mb-1">All caught up!</p>
        <p class="text-sm" style="color: rgba(255,255,255,0.6)">
          You've predicted all upcoming matches.
        </p>
      </div>
      <BaseButton class="secondary">
        <BaseLink :to="{ name: 'predictions' }">
          <BaseIcon name="list" class="mr-2" />View your predictions
        </BaseLink>
      </BaseButton>
    </div>

  </div>
</template>

<script>
import PredictCard from '@/components/PredictCard'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Predict',

  components: { PredictCard },

  props: {
    allMatches: { type: Boolean, default: false },
  },

  data() {
    return { pendingSnapshot: null }
  },

  mounted() {
    this.fetchMatches().then(matches => {
      this.pendingSnapshot = matches
        .filter(m => m.status === 'upcoming' && (this.allMatches || !('prediction' in m)))
        .sort((a, b) => new Date(a.kickoffTime) - new Date(b.kickoffTime))
    })
    this.$emit('init')
  },

  computed: {
    ...mapGetters({ storeMatches: 'matches/matches' }),
    pendingMatches() {
      // Use the snapshot taken at page load so the array stays stable while the user
      // is predicting. Without this, the Vuex commit after each prediction removes the
      // match from this list reactively, which shifts the array under PredictCard mid-save.
      if (this.pendingSnapshot !== null) return this.pendingSnapshot
      return this.storeMatches
        .filter(m => m.status === 'upcoming' && (this.allMatches || !('prediction' in m)))
        .sort((a, b) => new Date(a.kickoffTime) - new Date(b.kickoffTime))
    },
  },

  methods: {
    ...mapActions({ fetchMatches: 'matches/fetchMatches' }),
    onAllDone() {
      this.$router.push({ name: 'predictions' })
    },
  },
}
</script>
