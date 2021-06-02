<template>
  <transition name="fade">
    <div
      v-if="choice"
      class="bg-white rounded-lg my-5 mx-10 py-3 px-5 shadow-lg transition duration-500 min-w-4/5 md:min-w-md md:max-w-xs"
    >
      <h3 class="uppercase font-light text-sm mb-2">Your prediction</h3>
      <div class="flex justify-between">
        <div>
          <!-- pre-loading both flags -->
          <TeamBadge
            v-show="choice === 'home'"
            :flag="match.teamHome.badgeUrl"
          />
          <TeamBadge
            v-show="choice === 'away'"
            :flag="match.teamAway.badgeUrl"
          />
          <TeamBadge
            v-show="choice === 'draw'"
            :flag="require('@/assets/ball.jpg')"
          />
        </div>
        <div
          class="flex-grow flex flex-col items-center justify-center text-3xl mx-5"
        >
          <p class="">{{ choice === 'draw' ? 'DRAW' : chosenTeamName }}</p>
          <p v-if="choice !== 'draw'" class="text-sm mt-3">WINS 🏆</p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import capitalize from '@/utils/helpers'
import TeamBadge from '@/components/TeamBadge'

export default {
  components: { TeamBadge },

  props: {
    choice: String,
    match: Object,
  },
  computed: {
    chosenTeamName() {
      if (!this.choice) return

      return this.match['team' + capitalize(this.choice)].name
    },
  },
}
</script>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-out;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
