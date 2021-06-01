<template>
  <div>
    <MatchesGrouping
      v-for="group in groupedMatches"
      :key="group.title"
      :title="group.title"
      :matches="group.matches"
    />
  </div>
</template>

<script>
import MatchesGrouping from '@/components/MatchesGrouping'

export default {
  components: { MatchesGrouping },

  props: {
    competitionId: {
      type: Number,
      default: null,
      required: false,
    },
    userId: {
      type: Number,
      required: false,
    },
  },

  async mounted() {
    this.fetchMatches()
  },

  data() {
    return {
      loading: false,
      matches: [],
    }
  },

  computed: {
    groupedMatches() {
      return [
        {
          title: 'Missing Prediction',
          matches: this.matches.filter(
            m => !('prediction' in m) && m.status === 'upcoming'
          ),
        },
        {
          title: 'Ongoing Matches',
          matches: this.matches.filter(m => m.status === 'ongoing'),
        },
        {
          title: 'Upcoming Matches',
          matches: this.matches.filter(m => m.status === 'upcoming'),
        },
        {
          title: 'Past Matches',
          matches: this.matches.filter(m => m.status === 'finished'),
        },
      ]
    },
  },

  methods: {
    async fetchMatches() {
      this.loading = true
      const filters = {}
      if (this.userId) filters['userId'] = this.userId
      if (this.competitionId) filters['competitionId'] = this.competitionId
      this.matches = await this.$store.dispatch('matches/fetchMatches', filters)
      this.loading = false
    },
  },
}
</script>
