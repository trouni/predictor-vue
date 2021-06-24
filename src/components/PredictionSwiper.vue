<template>
  <div class="w-full h-full flex flex-col">
    <div
      class="overflow-hidden flex flex-col justify-around items-center flex-grow h-full"
    >
      <div class="flex flex-col justify-center items-center w-full h-1/5">
        <div v-if="currentMatch" class="text-center">
          <p class="text-gray-500 font-light text-xs md:text-lg">{{
            formatDateTime(currentMatch.kickoffTime)
          }}</p>
          <h2 class="text-2xl md:text-3xl">
            {{ currentMatch.teamHome.name }}
            <span class="font-light text-gray-500">v.</span>
            {{ currentMatch.teamAway.name }}
          </h2>
          <p class="text-gray-500 font-light text-xs md:text-lg">{{
            currentMatch.location
          }}</p>
          <div class="my-3 pill-pts py-1 px-3 text-white">
            {{ currentMatch.roundNumber + 2 }} points
          </div>
        </div>
      </div>
      <div class="flex flex-col items-center justify-end z-50 h-2/5">
        <transition>
          <PredictionSwiperStatus
            v-if="prediction.choice"
            :match="prediction.match"
            :choice="prediction.choice"
            :class="[
              'pointer-events-none transform transition',
              awaitingConfirmation
                ? 'opacity-100 scale-100'
                : 'opacity-70 scale-90',
            ]"
          />
        </transition>
      </div>
      <div
        class="w-full text-center flex flex-col justify-center items-center h-2/5"
      >
        <div v-if="showConfirm" class="contents">
          <h4 class="text-xl mb-3 text-glow z-50"
            >{{ currentMatchHasPrediction ? 'Keep' : 'Confirm' }} your
            prediction?</h4
          >
          <div class="flex justify-evenly w-full items-center z-50">
            <UndoButton @click="undoChoice" />
            <ConfirmButton @click="submitPrediction" />
          </div>
        </div>
      </div>
    </div>
    <div
      class="h-full overflow-hidden flex flex-col justify-center items-center absolute transform top-1/2 -translate-y-1/2 w-full left-0"
    >
      <PredictionSwiperCard
        v-for="(match, index) in matches"
        ref="card"
        :key="match.id"
        :active="match.id === currentMatch.id && !awaitingConfirmation"
        :match="match"
        :index="index"
        @submit="confirmChoice"
        v-model="prediction"
      />
    </div>
  </div>
</template>

<script>
import UndoButton from '@/components/UndoButton'
import ConfirmButton from '@/components/ConfirmButton'
import PredictionSwiperCard from '@/components/PredictionSwiperCard'
import PredictionSwiperStatus from '@/components/PredictionSwiperStatus'
import { formatDateTime } from '@/utils/helpers'
import { mapActions } from 'vuex'

export default {
  components: {
    PredictionSwiperCard,
    PredictionSwiperStatus,
    UndoButton,
    ConfirmButton,
  },

  props: {
    matches: Array,
  },

  data() {
    return {
      prediction: {
        choice: '',
        match: {},
      },
      awaitingConfirmation: false,
    }
  },

  watch: {
    currentMatch(newMatch) {
      if ('prediction' in newMatch) {
        this.prediction.choice = newMatch.prediction.choice
        this.prediction.match = newMatch
        this.awaitingConfirmation = true
      }
    },
  },

  computed: {
    currentMatch() {
      if (!this.matches.length) return

      return this.matches[0]
    },
    showConfirm() {
      return (
        this.awaitingConfirmation &&
        !!this.prediction.choice &&
        !!this.currentMatch
      )
    },
    currentMatchHasPrediction() {
      return (
        'prediction' in this.currentMatch &&
        this.currentMatch.prediction.choice == this.prediction.choice
      )
    },
  },

  methods: {
    ...mapActions({
      fetchMatches: 'matches/fetchMatches',
      setPrediction: 'matches/setPrediction',
    }),
    resetSwiper() {
      this.awaitingConfirmation = false
      this.$refs.card[0].resetCard()
    },
    confirmChoice(choice) {
      this.awaitingConfirmation = true
      this.prediction.choice = choice
    },
    undoChoice() {
      this.prediction.choice = ''
      this.resetSwiper()
    },
    async submitPrediction() {
      try {
        if (this.prediction.choice) {
          await this.setPrediction({
            match: this.currentMatch,
            choice: this.prediction.choice,
          })
          this.$emit('remove', this.currentMatch)
        }
      } catch {
        this.fetchMatches()
        this.resetSwiper()
      } finally {
        this.prediction.choice = ''
        this.awaitingConfirmation = false
      }
    },
    formatDateTime,
  },
}
</script>
<style lang="scss" scoped>
@import '@/styles';
.pill-pts {
  background: linear-gradient(167.4deg, $purple 0%, $teal 88.73%);
  border-radius: $spacer * 2;
}
</style>
