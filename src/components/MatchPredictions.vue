<template>
  <div>
    <div class="text-center border-b pb-3 my-3">
      <span class="uppercase text-sm text-gray-500">League Predictions </span>
      <div
        ref="predictionsBar"
        class="w-full h-6 rounded-md border-gray-300 border mt-5 flex overflow-hidden"
      >
        <div v-if="hasHomeWinPredictions" ref="teamHome" class="if-home h-full">
          <div
            class="text-sm text-glow font-semibold text-gray-600 w-full h-full flex items-center justify-center"
          >
            {{ percentageHomeWin }}
          </div>
        </div>

        <div
          ref="draw"
          v-if="hasDrawPredictions"
          :class="['team-draw h-full flex-auto border-gray-300', drawBarBorder]"
        >
          <div
            class="text-sm text-glow font-semibold text-gray-600 w-full h-full flex items-center justify-center uppercase"
          >
            {{ percentageDraw }}
          </div>
        </div>
        <div
          ref="teamAway"
          v-if="hasAwayWinPredictions"
          class="team-away h-full flex-auto"
        >
          <div
            class="text-sm text-glow font-semibold text-gray-600 w-full h-full flex items-center justify-center"
          >
            {{ percentageAwayWin }}
          </div>
        </div>
      </div>
      <div class="w-full min-h-6 flex mt-1">
        <div
          v-if="hasHomeWinPredictions"
          ref="teamHomeText"
          class="uppercase text-gray-600 truncate flex flex-col"
        >
          <span class="text-xs mb-2"> {{ teamHomeName }}</span>
        </div>
        <div
          v-if="hasDrawPredictions"
          ref="drawText"
          class="uppercase text-gray-600 truncate flex flex-col"
        >
          <span class="text-xs mb-2"> DRAW</span>
        </div>
        <div
          v-if="hasAwayWinPredictions"
          ref="teamAwayText"
          class="uppercase text-xs text-gray-600 text-center truncate flex flex-col"
        >
          <span class="text-xs mb-2"> {{ teamAwayName }}</span>
        </div>
      </div>
    </div>
    <div class="flex justify-between">
      <div :class="match.groupId ? 'w-1/3' : 'w-1/2'">
        <h4 class="uppercase mb-1 text-base">{{ match['teamHome'].abbrev }}</h4>
        <div
          v-for="user in predictions['home']"
          :key="user.userId"
          class="text-sm uppercase"
        >
          {{ user.name }}
        </div>
      </div>
      <div v-if="match.groupId" class="w-1/3">
        <h4 class="uppercase mb-1 text-base">Draw</h4>
        <div
          v-for="user in predictions['draw']"
          :key="user.userId"
          class="text-sm uppercase"
        >
          {{ user.name }}
        </div>
      </div>
      <div :class="match.groupId ? 'w-1/3' : 'w-1/2'">
        <h4 class="uppercase mb-1 text-base">{{ match['teamAway'].abbrev }}</h4>
        <div
          v-for="user in predictions['away']"
          :key="user.userId"
          class="text-sm uppercase"
        >
          {{ user.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    match: {
      type: Object,
      required: true,
    },
    predictions: {
      type: Object,
      required: false,
    },
  },

  mounted() {
    if (this.$refs.teamHome) {
      this.$refs.teamHome.style.width = this.percentageHomeWin
      this.$refs.teamHome.classList.add(
        this.matchResult === 'home' ? 'bg-prediction-correct' : 'bg-gray-100'
      )
      this.$refs.teamHomeText.style.width = this.percentageHomeWin
    }
    if (this.$refs.draw) {
      this.$refs.draw.style.width = this.percentageDraw
      this.$refs.drawText.style.width = this.percentageDraw
      this.$refs.draw.classList.add(
        this.matchResult === 'draw' ? 'bg-prediction-correct' : 'bg-gray-100'
      )
    }
    if (this.$refs.teamAway) {
      this.$refs.teamAway.style.width = this.percentageAwayWin
      this.$refs.teamAway.classList.add(
        this.matchResult === 'away' ? 'bg-prediction-correct' : 'bg-gray-100'
      )
      this.$refs.teamAwayText.style.width = this.percentageAwayWin
    }
  },

  data() {
    return {
      colors: {
        argentina: '#4185F4',
        australia: '#ffbb00',
        belgium: '#FF7048',
        brazil: '#018100',
        canada: '#c5281c',
        cameroon: '#044C40',
        costa_rica: '#E91114',
        croatia: '#A90000',
        denmark: '#e32219',
        ecuador: '#ffef00',
        england: '#2b57ac',
        france: '#123163',
        germany: '#000000',
        ghana: '#D30024',
        iran: '#E11C23',
        japan: '#000080',
        mexico: '#03a154',
        morocco: '#17A376',
        netherlands: '#FE6702',
        poland: '#FF0001',
        portugal: '#ff0000',
        qatar: '#7E0000',
        saudi_arabia: '#003A11',
        senegal: '#106144',
        serbia: '#ff000d',
        south_korea: '#ffffff',
        spain: '#ff0000',
        switzerland: '#E00201',
        tunisia: '#E50112',
        uruguay: '#55b5e5',
        usa: '#002bbe',
        wales: '#ff0000',
      },
    }
  },

  methods: {
    getColorFromTeamName(team) {
      return this.colors[team.toLowerCase().replace(' ', '_')]
    },
    calculatePercentage(numOfPredictions) {
      return Math.round(
        (numOfPredictions / this.totalNumberOfUserPredictions) * 100
      )
    },
  },

  computed: {
    drawBarBorder() {
      if (!this.hasAwayWinPredictions && !this.hasHomeWinPredictions) {
        return 'border-r-0 border-l-0'
      } else if (!this.hasAwayWinPredictions) {
        return 'border-r-0'
      } else if (!this.hasHomeWinPredictions) {
        return 'border-l-0'
      } else {
        return 'border-l border-r'
      }
    },
    matchResult() {
      if (this.match.teamAway.score > this.match.teamHome.score) {
        return 'away'
      } else if (this.match.teamAway.score < this.match.teamHome.score) {
        return 'home'
      } else {
        //  if there was extra time keep evaluating, otherwise return 'draw'
        if (this.match.teamHome.etScore === 0 || this.match.teamHome.etScore) {
          return this.checkExtraTimeScore
        } else {
          return 'draw'
        }
      }
    },
    checkExtraTimeScore() {
      if (this.match.teamAway.etScore > this.match.teamHome.etScore) {
        return 'away'
      } else if (this.match.teamAway.etScore < this.match.teamHome.etScore) {
        return 'home'
      } else {
        return this.checkPsScore
      }
    },
    checkPsScore() {
      if (this.match.teamAway.psScore > this.match.teamHome.psScore) {
        return 'away'
      } else {
        return 'home'
      }
    },
    totalNumberOfUserPredictions() {
      return Object.keys(this.predictions).reduce((acc, key) => {
        return acc + this.predictions[key].length
      }, 0)
    },
    percentageHomeWin() {
      if (!this.hasHomeWinPredictions) return 0
      return `${this.calculatePercentage(this.predictions.home.length)}%`
    },
    percentageAwayWin() {
      if (!this.hasAwayWinPredictions) return 0
      return `${this.calculatePercentage(this.predictions.away.length)}%`
    },
    percentageDraw() {
      if (!this.hasDrawPredictions) return 0
      return `${this.calculatePercentage(this.predictions.draw.length)}%`
    },
    hasDrawPredictions() {
      return Object.keys(this.predictions).includes('draw')
    },
    hasHomeWinPredictions() {
      return Object.keys(this.predictions).includes('home')
    },
    hasAwayWinPredictions() {
      return Object.keys(this.predictions).includes('away')
    },
    teamHomeName() {
      return this.percentageHomeWin.slice(0, -1) < 20
        ? this.match.teamHome.abbrev
        : this.match.teamHome.name
    },
    teamAwayName() {
      return this.percentageAwayWin.slice(0, -1) < 20
        ? this.match.teamAway.abbrev
        : this.match.teamAway.name
    },
  },
}
</script>
