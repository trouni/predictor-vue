<template>
  <div class="p-4">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div
        v-for="competition in descendingCompetitions"
        :key="competition.id"
        class="mt-3 flex flex-col border rounded shadow-md"
      >
        <BaseLink
          :to="{ name: 'predictions', params: { id: competition.id } }"
          class="grow h-full"
        >
          <div
            class="card-competition flex flex-col justify-center p-2 h-full"
            @click="handleCompetitionClick(competition.id)"
          >
            <img alt="football graphic" :src="competition.photoUrl" class="grow" />
          </div>
        </BaseLink>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
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
  },
  methods: {
    ...mapActions({
      fetchCompetitions: 'competitions/fetchCompetitions',
      fetchUser: 'users/fetchUser',
    }),
    competitionEnded(endDate) {
      return (
        new Date().setHours(0, 0, 0, 0) > new Date(endDate).setHours(0, 0, 0, 0)
      )
    },
    async handleCompetitionClick(competitionId) {
      await this.$store.dispatch(
        'competitions/selectCompetition',
        competitionId
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
