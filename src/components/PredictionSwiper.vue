<template>
  <div class="swiper overflow-hidden flex">
    <div
      class="flex-grow text-center flex justify-center fixed top-1/3 w-full left-0"
    >
      <PredictionSwiperCard
        v-for="(match, index) in remainingMatches"
        :active="index === 0"
        :key="match.id"
        :match="match"
        :index="index"
        @remove="choice => removeMatch(match.id, choice)"
        v-model="choice"
      />
    </div>
    <div
      v-if="currentMatch"
      class="absolute left-0 bottom-0 z-10 mb-16 w-full flex justify-center text-center pointer-events-none"
    >
      <PredictionSwiperStatus
        :match="statusMatch || currentMatch"
        :choice="choice"
      />
    </div>
  </div>
</template>

<script>
import PredictionSwiperCard from '@/components/PredictionSwiperCard'
import PredictionSwiperStatus from '@/components/PredictionSwiperStatus'

export default {
  components: { PredictionSwiperCard, PredictionSwiperStatus },

  props: {
    matches: Array,
  },

  data() {
    return {
      choice: '',
      statusMatch: this.currentMatch,
    }
  },

  computed: {
    remainingMatches() {
      return this.matches.filter(c => !c.removed)
    },
    currentMatch() {
      if (!this.matches.length) return

      return this.remainingMatches[0]
    },
  },

  methods: {
    removeMatch(id, choice) {
      const matchIndex = this.matches.findIndex(match => match.id === id)
      this.$set(this.matches[matchIndex], 'choice', choice)
      this.choice = choice
      this.$set(this.matches[matchIndex], 'removed', true)
      this.setPrediction(choice)
      setTimeout(() => {
        this.choice = ''
        if (this.currentMatch) this.statusMatch = this.currentMatch
        else this.$router.push({ path: '/matches' })
      }, 1000)
    },
    async setPrediction(choice) {
      this.loading = true
      await this.$store.dispatch(`matches/setPrediction`, {
        match: this.currentMatch,
        choice,
      })
      this.loading = false
    },
  },
}
</script>
