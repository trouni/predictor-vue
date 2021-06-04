<template>
  <div>
    <div class="flex justify-center">
      <BaseButton
        v-if="missingPredictions.length"
        class="uppercase text-center m-5"
      >
        <BaseLink :to="{ path: '/predictions' }">
          Make your predictions
        </BaseLink>
      </BaseButton>
    </div>
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
    userId: {
      type: Number,
      required: false,
    },
  },

  async mounted() {
    await this.fetchMatches()
    this.$emit('init')
  },

  data() {
    return {
      loading: false,
      matches: [],
    }
  },

  computed: {
    missingPredictions() {
      return this.matches.filter(
        m => !('prediction' in m) && m.status === 'upcoming'
      )
    },
    groupedMatches() {
      return [
        {
          title: 'Ongoing Matches',
          matches: this.matches.filter(m => m.status === 'ongoing'),
        },
        {
          title: 'Upcoming Matches',
          matches: this.matches.filter(
            m => m.status === 'upcoming' && 'prediction' in m
          ),
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
      this.matches = await this.$store.dispatch('matches/fetchMatches', {
        userId: this.userId,
      })
      this.loading = false
    },
  },
}
</script>
