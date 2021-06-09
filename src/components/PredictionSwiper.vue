<template>
  <div class="swiper overflow-hidden flex">
    <div class="flex flex-col justify-center items-center w-full my-5">
      <div v-if="currentMatch" class="absolute top-16 text-center">
        <p class="text-gray-500 font-light text-xs">{{
          formatDateTime(currentMatch.kickoffTime)
        }}</p>
        <h2 class="mt-3 text-2xl">
          {{ currentMatch.teamHome.name }}
          <span class="font-light text-gray-500">v.</span>
          {{ currentMatch.teamAway.name }}
        </h2>
      </div>
    </div>
    <div
      class="flex-grow text-center flex justify-center fixed top-1/3 w-full left-0"
    >
      <div v-if="loading"></div>
      <PredictionSwiperCard
        v-for="(match, index) in matches"
        ref="card"
        :key="match.id"
        :active="
          match.id === currentMatch.id && !awaitingConfirmation && !loading
        "
        :match="match"
        :index="index"
        @submit="confirmChoice"
        v-model="choice"
      />
    </div>
    <div
      v-if="currentMatch"
      class="flex flex-col items-center justify-center absolute top-1/3 left-1/2 transform -translate-x-1/2 w-full"
    >
      <PredictionSwiperStatus
        :match="currentMatch"
        :choice="choice"
        :class="[
          'pointer-events-none transform transition',
          awaitingConfirmation
            ? 'opacity-100 scale-100'
            : 'opacity-70 scale-90',
        ]"
      />
    </div>
    <transition>
      <div
        v-if="choice && awaitingConfirmation"
        class="absolute bottom-28 left-0 w-full text-center"
      >
        <h4 class="text-xl mb-3"
          >{{ currentMatchHasPrediction ? 'Keep' : 'Confirm' }} your
          prediction?</h4
        >
        <div class="flex justify-evenly w-full items-center z-50">
          <UndoButton @click="undoChoice" class="z-50">Redo</UndoButton>
          <ConfirmButton @click="submitPrediction">{{
            currentMatchHasPrediction ? 'Keep' : 'Confirm'
          }}</ConfirmButton>
        </div>
      </div>
    </transition>
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
    loading: Boolean,
  },

  data() {
    return {
      choice: '',
      awaitingConfirmation: false,
    }
  },

  watch: {
    currentMatch(newMatch) {
      this.awaitingConfirmation = false
      if ('prediction' in newMatch) {
        this.choice = newMatch.prediction.choice
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
      return this.awaitingConfirmation
    },
    currentMatchHasPrediction() {
      return (
        'prediction' in this.currentMatch &&
        this.currentMatch.prediction.choice == this.choice
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
      this.choice = ''
      this.$refs.card[0].resetCard()
    },
    confirmChoice(choice) {
      this.awaitingConfirmation = true
      this.choice = choice
    },
    undoChoice() {
      this.resetSwiper()
    },
    async submitPrediction() {
      try {
        await this.setPrediction({
          match: this.currentMatch,
          choice: this.choice,
          delayFetch: 500,
        })
        this.$emit('remove', this.currentMatch)
      } catch {
        this.fetchMatches()
      } finally {
        this.resetSwiper()
      }
    },
    formatDateTime,
  },
}
</script>
