<template>
  <div v-if="Object.keys(matches).length" class="mb-10">
    <div v-for="(dayMatches, date) in matches" :key="date">
      <div v-if="dayMatches.length">
        <h4
          v-if="date !== formatDate(new Date())"
          class="text-center font-light m-8"
          >{{ date }}
        </h4>
        <template v-if="results">
          <ResultCard
            v-for="match in dayMatches"
            :key="match.id"
            :match="match"
            :selectable="false"
            :predictions="predictions?.[match.id]"
            :currentUserId="currentUser.id"
          />
        </template>
        <template v-else>
          <MatchCard
            v-for="match in dayMatches"
            :key="match.id"
            :match="match"
            :selectable="selectable ?? match.status == 'upcoming'"
            :predictions="predictions?.[match.id]"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import MatchCard from '@/components/MatchCard'
import ResultCard from '@/components/ResultCard'
import { formatDate } from '@/utils/helpers'
import { mapGetters } from 'vuex'

export default {
  components: { MatchCard, ResultCard },

  props: {
    matches: {
      type: Object,
      default: () => {},
    },
    selectable: {
      type: Boolean,
      required: false,
    },
    predictions: {
      type: Object,
      required: false,
    },
    results: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  computed: {
    ...mapGetters({ currentUser: 'auth/currentUser' }),
  },

  methods: {
    formatDate,
  },
}
</script>
