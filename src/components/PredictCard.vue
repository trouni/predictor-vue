<template>
  <div class="predict-flow flex flex-col gap-4 w-full" style="margin: 0 auto;">

    <!-- Back link -->
    <div class="px-1">
      <BaseLink
        :to="{ name: 'predictions' }"
        class="inline-flex items-center gap-1.5 text-xs font-medium opacity-50 hover:opacity-80 transition-opacity"
        style="color: white"
      >
        <BaseIcon name="arrow-left" />
        Back to all predictions
      </BaseLink>
    </div>

    <!-- Progress bar -->
    <div class="px-1">
      <div class="flex justify-between items-center mb-2">
        <span class="text-white text-xs font-semibold uppercase tracking-widest opacity-60">
          Your Picks
        </span>
        <span class="text-white text-sm font-semibold">
          {{ savedCount }}<span class="opacity-50 font-normal"> / {{ matches.length }} saved</span>
        </span>
      </div>
      <div class="h-1.5 rounded-full overflow-hidden" style="background: rgba(255,255,255,0.2)">
        <div
          class="h-full rounded-full transition-all duration-500"
          style="background: linear-gradient(90deg, #0cf574, #6690b7)"
          :style="{ width: `${progressPercent}%` }"
        />
      </div>
    </div>

    <!-- Match card with slide transition -->
    <transition :name="slideDirection" mode="out-in">
      <div v-if="currentMatch" :key="currentMatch.id" class="predict-card bg-white rounded-3xl shadow-2xl overflow-hidden">

        <!-- Match metadata header -->
        <div class="text-center px-6 py-5 border-b border-gray-100">
          <div
            class="inline-flex items-center gap-2 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-3"
            style="background: linear-gradient(135deg, #3e3b7d, #6690b7)"
          >
            <span>⭐ {{ pointsValue }} pts</span>
            <span v-if="roundLabel" class="opacity-60 font-normal">· {{ roundLabel }}</span>
          </div>
          <p class="text-gray-700 font-semibold text-sm">{{ formattedMatchDate }}</p>
          <p v-if="currentMatch.location" class="text-gray-400 text-xs mt-1">
            📍 {{ currentMatch.location }}
          </p>
        </div>

        <!-- Team selection area -->
        <div class="flex items-stretch" style="min-height: 210px">
          <!-- Home team -->
          <button
            @click="predict('home')"
            :disabled="isSaving"
            class="team-btn group relative flex-1 flex flex-col items-center justify-center gap-1 py-8 px-4 overflow-hidden transition-all duration-200"
            :class="localChoice === 'home' ? 'bg-green-50' : 'hover:bg-gray-50 active:bg-gray-100'"
          >
            <!-- Subtle flag wash -->
            <img
              v-if="currentMatch.teamHome.flagUrl"
              :src="currentMatch.teamHome.flagUrl"
              class="absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-300"
              :class="localChoice === 'home' ? 'opacity-10' : 'opacity-5 group-hover:opacity-8'"
            />
            <!-- Green selection border overlay -->
            <div
              v-if="localChoice === 'home'"
              class="absolute inset-0 pointer-events-none border-b-4 border-green-400"
            />
            <!-- Badge -->
            <div class="relative z-10">
              <div
                class="w-16 h-16 rounded-full overflow-hidden shadow-md border-4 transition-all duration-200"
                :class="localChoice === 'home'
                    ? 'border-green-400 scale-110 shadow-green-100'
                    : 'border-gray-200 group-hover:border-gray-300 group-hover:scale-105'
                "
              >
                <img
                  :src="currentMatch.teamHome.badgeUrl"
                  class="w-full h-full object-cover"
                  :alt="currentMatch.teamHome.name"
                />
              </div>
              <!-- Checkmark -->
              <transition name="pop">
                <div
                  v-if="localChoice === 'home'"
                  class="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center shadow-md"
                  style="background: #0cf574"
                >
                  <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
              </transition>
            </div>
            <!-- Team name -->
            <p class="relative z-10 font-bold text-gray-800 text-sm text-center leading-tight mt-1">
              {{ currentMatch.teamHome.name }}
            </p>
            <span
              v-if="currentMatch.teamHome.ranking"
              class="relative z-10 inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full"
              style="background: rgba(0, 0, 0, 0.06); color: #6b7280"
              >FIFA #{{ currentMatch.teamHome.ranking }}</span
            >
            <p class="relative z-10 text-xs text-gray-400">Home</p>
          </button>

          <!-- Center column: VS or DRAW -->
          <div class="flex flex-col items-center justify-center py-4 px-3 bg-gray-50 border-x border-gray-100 gap-3">
            <div class="w-px flex-1" style="background: #e5e7eb" />
            <button
              v-if="currentMatch.groupId"
              @click="predict('draw')"
              :disabled="isSaving"
              class="draw-btn flex flex-col items-center gap-1.5 transition-all duration-200 focus:outline-none"
            >
              <div
                class="w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all duration-200"
                :class="localChoice === 'draw'
                    ? 'scale-110 shadow-md border-transparent'
                    : 'bg-white border-gray-300 hover:border-gray-400'
                "
                :style="localChoice === 'draw' ? 'background: #0cf574' : ''"
              >
                <svg v-if="localChoice === 'draw'" class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                </svg>
                <span v-else class="text-gray-400 text-sm font-bold leading-none">=</span>
              </div>
              <span
                class="text-xs font-bold transition-colors"
                :style="localChoice === 'draw' ? 'color: #0cf574' : 'color: #9ca3af'"
              >DRAW</span>
            </button>
            <span v-else class="text-gray-300 text-sm font-light tracking-widest">VS</span>
            <div class="w-px flex-1" style="background: #e5e7eb" />
          </div>

          <!-- Away team -->
          <button
            @click="predict('away')"
            :disabled="isSaving"
            class="team-btn group relative flex-1 flex flex-col items-center justify-center gap-1 py-8 px-4 overflow-hidden transition-all duration-200"
            :class="localChoice === 'away' ? 'bg-green-50' : 'hover:bg-gray-50 active:bg-gray-100'"
          >
            <img
              v-if="currentMatch.teamAway.flagUrl"
              :src="currentMatch.teamAway.flagUrl"
              class="absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-300"
              :class="localChoice === 'away' ? 'opacity-10' : 'opacity-5 group-hover:opacity-8'"
            />
            <div
              v-if="localChoice === 'away'"
              class="absolute inset-0 pointer-events-none border-b-4 border-green-400"
            />
            <div class="relative z-10">
              <div
                class="w-16 h-16 rounded-full overflow-hidden shadow-md border-4 transition-all duration-200"
                :class="localChoice === 'away'
                    ? 'border-green-400 scale-110 shadow-green-100'
                    : 'border-gray-200 group-hover:border-gray-300 group-hover:scale-105'
                "
              >
                <img
                  :src="currentMatch.teamAway.badgeUrl"
                  class="w-full h-full object-cover"
                  :alt="currentMatch.teamAway.name"
                />
              </div>
              <transition name="pop">
                <div
                  v-if="localChoice === 'away'"
                  class="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center shadow-md"
                  style="background: #0cf574"
                >
                  <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
              </transition>
            </div>
            <p class="relative z-10 font-bold text-gray-800 text-sm text-center leading-tight mt-1">
              {{ currentMatch.teamAway.name }}
            </p>
            <span
              v-if="currentMatch.teamAway.ranking"
              class="relative z-10 inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full"
              style="background: rgba(0, 0, 0, 0.06); color: #6b7280"
            >FIFA #{{ currentMatch.teamAway.ranking }}</span
            >
            <p class="relative z-10 text-xs text-gray-400">Away</p>
          </button>

        </div>

        <!-- Status footer -->
        <div class="border-t border-gray-100 px-5 py-3 text-center" style="min-height: 44px;">
          <transition name="fade" mode="out-in">
            <p v-if="isSaving" key="saving" class="text-xs text-gray-400 flex items-center justify-center gap-1.5">
              <BaseIcon name="circle-notch" class="fa-spin" /> Saving...
            </p>
            <p v-else-if="localChoice" key="chosen" class="text-xs font-semibold flex items-center justify-center gap-1.5" style="color: #059669">
              <BaseIcon name="check-circle" /> {{ localChoiceLabel }}
            </p>
            <p v-else key="empty" class="text-xs text-gray-400">
              Tap to make your prediction
            </p>
          </transition>
        </div>
      </div>
    </transition>

    <!-- Navigation row -->
    <div class="flex justify-between items-center px-1">
      <!-- Previous -->
      <button
        @click="navigate(-1)"
        :disabled="currentIndex === 0"
        class="flex items-center gap-1.5 text-sm font-medium transition-all duration-150 focus:outline-none"
        :class="currentIndex > 0 ? 'text-white hover:text-white/70' : 'text-white/25 cursor-not-allowed'"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
        Previous
      </button>

      <!-- Dot indicators -->
      <!-- <div class="flex items-center gap-1.5 flex-wrap px-3">
        <button
          v-for="(match, i) in matches"
          :key="match.id"
          @click="goTo(i)"
          class="rounded-full transition-all duration-300 focus:outline-none"
          :class="[
            i === currentIndex
              ? 'w-5 h-2.5'
              : 'w-2.5 h-2.5 hover:opacity-80',
            savedChoices[match.id]
              ? i === currentIndex ? 'bg-green-400' : 'bg-green-400 opacity-70'
              : i === currentIndex ? 'bg-white' : 'bg-white/30'
          ]"
          style="width: 10px;height: 10px;"
        />
      </div> -->

      <!-- Next -->
      <button
        @click="navigate(1)"
        :disabled="currentIndex === matches.length - 1"
        class="flex items-center gap-1.5 text-sm font-medium transition-all duration-150 focus:outline-none"
        :class="currentIndex < matches.length - 1 ? 'text-white hover:text-white/70' : 'text-white/25 cursor-not-allowed'"
      >
        Next
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </button>
    </div>

  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { formatDateTime } from '@/utils/helpers'

export default {
  name: 'PredictCard',

  props: {
    matches: {
      type: Array,
      required: true,
    },
    editMode: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      currentIndex: 0,
      savedChoices: {},   // matchId → choice string
      isSaving: false,
      slideDirection: 'slide-next',
    }
  },

  mounted() {
    // Pre-populate any existing predictions (for edit mode)
    this.matches.forEach(match => {
      if (match.prediction && match.prediction.choice) {
        this.$set(this.savedChoices, match.id, match.prediction.choice)
      }
    })
  },

  computed: {
    currentMatch() {
      return this.matches[this.currentIndex] || null
    },
    localChoice() {
      if (!this.currentMatch) return ''
      return this.savedChoices[this.currentMatch.id] || ''
    },
    localChoiceLabel() {
      if (!this.localChoice || !this.currentMatch) return ''
      if (this.localChoice === 'draw') return 'Draw predicted'
      if (this.localChoice === 'home') return `${this.currentMatch.teamHome.name} to win`
      if (this.localChoice === 'away') return `${this.currentMatch.teamAway.name} to win`
      return ''
    },
    savedCount() {
      return Object.keys(this.savedChoices).length
    },
    progressPercent() {
      if (!this.matches.length) return 0
      return Math.round((this.savedCount / this.matches.length) * 100)
    },
    pointsValue() {
      if (!this.currentMatch) return 0
      // Points = roundNumber + 2 (from Rails model)
      return (this.currentMatch.roundNumber || 0) + 2
    },
    roundLabel() {
      if (!this.currentMatch) return ''
      if (this.currentMatch.groupId) return 'Group Stage'
      const num = this.currentMatch.roundNumber
      if (!num) return ''
      if (num >= 6) return 'Final'
      if (num === 5) return 'Semi-Final'
      if (num === 4) return 'Quarter-Final'
      if (num === 3) return 'Round of 16'
      return `Round ${num}`
    },
    formattedMatchDate() {
      if (!this.currentMatch) return ''
      return formatDateTime(this.currentMatch.kickoffTime)
    },
  },

  methods: {
    ...mapActions({
      setPrediction: 'matches/setPrediction',
    }),

    navigate(direction) {
      const next = this.currentIndex + direction
      if (next < 0 || next >= this.matches.length) return
      this.slideDirection = direction > 0 ? 'slide-next' : 'slide-prev'
      this.$nextTick(() => {
        this.currentIndex = next
      })
    },

    goTo(index) {
      if (index === this.currentIndex) return
      this.slideDirection = index > this.currentIndex ? 'slide-next' : 'slide-prev'
      this.$nextTick(() => {
        this.currentIndex = index
      })
    },

    async predict(choice) {
      if (this.isSaving) return
      if (this.localChoice === choice) return

      const matchId = this.currentMatch.id
      this.isSaving = true
      try {
        await this.setPrediction({ match: this.currentMatch, choice })
        this.$set(this.savedChoices, matchId, choice)

        if (!this.editMode) {
          // After brief success display, advance to next unpredicted match
          setTimeout(() => {
            const next = this.findNextUnpredicted()
            if (next === -1) {
              this.$emit('done')
            } else if (next !== this.currentIndex) {
              this.slideDirection = 'slide-next'
              this.currentIndex = next
            }
          }, 700)
        }
      } catch (err) {
        console.error('Failed to save prediction:', err)
      } finally {
        this.isSaving = false
      }
    },

    findNextUnpredicted() {
      // Search forward from current position first
      for (let i = this.currentIndex + 1; i < this.matches.length; i++) {
        if (!this.savedChoices[this.matches[i].id]) return i
      }
      // Then wrap around from the beginning
      for (let i = 0; i < this.currentIndex; i++) {
        if (!this.savedChoices[this.matches[i].id]) return i
      }
      return -1
    },

    formatDateTime,
  },
}
</script>

<style lang="scss" scoped>
.team-btn {
  border: none;
  cursor: pointer;
  background: none;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.8;
  }
}

.draw-btn {
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;

  &:disabled {
    cursor: not-allowed;
  }
}

/* Slide forward (next) */
.slide-next-enter-active,
.slide-next-leave-active {
  transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-next-enter {
  opacity: 0;
  transform: translateX(28px);
}
.slide-next-leave-to {
  opacity: 0;
  transform: translateX(-28px);
}

/* Slide backward (prev) */
.slide-prev-enter-active,
.slide-prev-leave-active {
  transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-prev-enter {
  opacity: 0;
  transform: translateX(-28px);
}
.slide-prev-leave-to {
  opacity: 0;
  transform: translateX(28px);
}

/* Fade for status footer */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* Checkmark pop-in */
.pop-enter-active {
  transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.4);
}
.pop-enter {
  opacity: 0;
  transform: scale(0);
}
</style>
