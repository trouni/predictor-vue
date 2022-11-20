<template>
  <div v-if="Object.keys(matches).length" class="mb-10">
    <div v-for="(dayMatches, date) in matches" :key="date">
      <div v-if="dayMatches.length">
        <h4
          v-if="date !== formatDate(new Date())"
          class="text-center font-light m-8"
          >{{ date }}
        </h4>
        <MatchCard
          v-for="match in dayMatches"
          :key="match.id"
          :match="match"
          :selectable="match.status == 'upcoming'"
        />
      </div>
    </div>
  </div>
</template>

<script>
import MatchCard from '@/components/MatchCard'
import { formatDate } from '@/utils/helpers'

export default {
  components: { MatchCard },

  props: {
    matches: {
      type: Object,
      default: () => {},
    },
  },

  methods: {
    formatDate,
  },
}
</script>
