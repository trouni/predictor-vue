<template>
  <div>
    <div class="text-center">
      <div
        ref="predictionsBar"
        class="w-full h-6 rounded-md border-gray-300 border mt-5 flex overflow-hidden"
      >
        <div v-if="hasHomeWinPredictions" ref="teamHome" class="if-home h-full">
          <div
            class="home-win text-sm text-glow font-semibold text-gray-600 w-full h-full flex items-center justify-center"
          >
            {{ percentageHomeWin }}%
          </div>
        </div>
        <div
          ref="draw"
          v-if="hasDrawPredictions"
          class="if-draw h-full bg-gray-100"
        >
          <div
            class="draw text-sm text-glow font-semibold text-gray-600 w-full h-full flex items-center justify-center uppercase"
          >
            {{
              this.predictions.draw
                ? calculatePercentage(this.predictions.draw.length)
                : 0
            }}%
          </div>
        </div>
        <div ref="teamAway" v-if="hasAwayWinPredictions" class="if-away h-full">
          <div
            class="away-win text-sm text-glow font-semibold text-gray-600 w-full h-full flex items-center justify-center"
          >
            {{
              this.predictions.away
                ? calculatePercentage(this.predictions.away.length)
                : 0
            }}%
          </div>
        </div>
      </div>
      <div ref="numbersRow" class="w-full h-6 flex mt-1">
        <div
          v-if="hasHomeWinPredictions"
          ref="teamHomeText"
          class="uppercase text-xs text-gray-500"
        >
          {{ match.teamHome.name }}</div
        >
        <div
          v-if="hasDrawPredictions"
          ref="drawText"
          class="uppercase text-xs text-gray-500"
        >
          draw</div
        >
        <div
          v-if="hasAwayWinPredictions"
          ref="teamAwayText"
          class="uppercase text-xs text-gray-500"
        >
          {{ match.teamAway.name }}</div
        >
      </div>
    </div>
    <div class="flex justify-between">
      <div :class="match.groupId ? 'w-1/3' : 'w-1/2'">
        <h4 class="uppercase">{{ match['teamHome'].abbrev }}</h4>
        <div v-for="user in predictions['home']" :key="user.userId">
          {{ user.name }}
        </div>
      </div>
      <div v-if="match.groupId" class="w-1/3">
        <h4 class="uppercase">Draw</h4>
        <div v-for="user in predictions['draw']" :key="user.userId">
          {{ user.name }}
        </div>
      </div>
      <div :class="match.groupId ? 'w-1/3' : 'w-1/2'">
        <h4 class="uppercase">{{ match['teamAway'].abbrev }}</h4>
        <div v-for="user in predictions['away']" :key="user.userId">
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
    this.$refs.teamHome.style.width = `${this.percentageHomeWin}%`
    this.$refs.teamHome.style.backgroundColor = `${this.getColorFromTeamName(
      this.match.teamHome.name
    )}`
    this.$refs.teamHomeText.style.width = `${this.percentageHomeWin}%`
    this.$refs.draw.style.width = `${this.percentageDraw}%`
    this.$refs.drawText.style.width = `${this.percentageDraw}%`
    this.$refs.teamAway.style.width = `${this.percentageAwayWin}%`
    this.$refs.teamAwayText.style.width = `${this.percentageAwayWin}%`
    this.$refs.teamAway.style.backgroundColor = `${this.getColorFromTeamName(
      this.match.teamAway.name
    )}`
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
        morocco: '#FF6F48',
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
    totalNumberOfUserPredictions() {
      return Object.keys(this.predictions).reduce((acc, key) => {
        return acc + this.predictions[key].length
      }, 0)
    },
    percentageHomeWin() {
      if (!this.hasHomeWinPredictions) return 0
      return this.calculatePercentage(this.predictions.home.length)
    },
    percentageAwayWin() {
      if (!this.hasAwayWinPredictions) return 0
      return this.calculatePercentage(this.predictions.away.length)
    },
    percentageDraw() {
      if (!this.hasDrawPredictions) return 0
      return this.calculatePercentage(this.predictions.draw.length)
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
    calculateHomeWinBox() {
      if (!this.hasHomeWinPredictions) return 0
      return this.calculatePercentage(this.predictions.home.length)
    },
  },
}
</script>
