<template>
  <div class="p-4">
    <h3 class="text-center">Ongoing</h3>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div
        v-for="competition in ongoingCompetitions"
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
    <h3 class="text-center mt-5">Past</h3>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div
        v-for="competition in pastCompetitions"
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
    ongoingCompetitions() {
      return this.descendingCompetitions.filter(c => !this.isPast(c.endDate))
    },
    pastCompetitions() {
      return this.descendingCompetitions.filter(c => this.isPast(c.endDate))
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
    isPast(dateString) {
      const endDate = new Date(dateString);
      const today = new Date();
      // Set the time of today to the end of the day to make sure we consider the whole day
      today.setHours(23, 59, 59, 999);
      return endDate < today;
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
