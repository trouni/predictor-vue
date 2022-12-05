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
          :selectable="selectable ?? match.status == 'upcoming'"
          :predictions="predictions?.[match.id]"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    match: {
      type: Object,
      default: () => {},
    },
    predictions: {
      type: Object,
      required: false,
    },
  },
}
</script>
