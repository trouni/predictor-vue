<template>
  <div class="pb-20">
    <div class="flex justify-center">
      <BaseButton
        v-if="missingPredictions.length"
        class="uppercase text-center m-5"
      >
        <BaseLink :to="{ path: '/predictions' }">
          Make your predictions
        </BaseLink>
      </BaseButton>
      <BaseButton v-else class="uppercase text-center m-5">
        <BaseLink :to="{ path: '/predictions/edit' }">
          Update your predictions
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
import { mapGetters, mapActions } from 'vuex'

export default {
  components: { MatchesGrouping },

  props: {
    userId: {
      type: Number,
      required: false,
    },
  },

  async mounted() {
    if (this.matches.length) this.$emit('init')

    await this.fetchMatches({ userId: this.userId })
    this.$emit('init')
  },

  data() {
    return {
      loading: false,
    }
  },

  computed: {
    ...mapGetters({ matches: 'matches/matches' }),
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
    ...mapActions({
      fetchMatches: 'matches/fetchMatches',
    }),
  },
}
</script>
