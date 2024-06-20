<template>
  <div class="p-4 h-full flex justify-center">
    <div class="w-full md:w-6/12">
      <h3 class="text-center">Ongoing</h3>
      <CompetitionsList :competitions="ongoingCompetitions" />
      <h3 class="text-center mt-5">Past</h3>
      <CompetitionsList :competitions="pastCompetitions" />
    </div>
  </div>
</template>

<script>
import CompetitionsList from '@/components/CompetitionsList'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: { CompetitionsList },
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  async mounted() {
    this.fetchCompetitions()
    this.user = await this.fetchUser({ userId: this.id })
    this.$emit('init')
  },
  computed: {
    ...mapGetters({
      competitions: 'competitions/competitions',
    }),
    descendingCompetitions() {
      return [...this.competitions].reverse()
    },
    ongoingCompetitions() {
      return this.descendingCompetitions.filter(c => !this.competitionEnded(c.endDate))
    },
    pastCompetitions() {
      return this.descendingCompetitions.filter(c => this.competitionEnded(c.endDate))
    },
  },
  methods: {
    ...mapActions({
      fetchCompetitions: 'competitions/fetchCompetitions',
      fetchUser: 'users/fetchUser',
    }),
    async handleCompetitionClick(competitionId) {
      await this.$store.dispatch(
        'competitions/selectCompetition',
        competitionId
      )
    },
    competitionEnded(endDate) {
      return (
        new Date().setHours(0, 0, 0, 0) > new Date(endDate).setHours(0, 0, 0, 0)
      )
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles';

.card-competition {
  // background-color: white;
}

.card-competition p {
  margin: 0;
  color: $purple;
}
</style>
