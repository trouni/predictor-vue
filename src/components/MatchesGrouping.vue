<template>
  <div v-if="matches.length" class="mb-10">
    <h3 class="text-center uppercase">{{ title }}</h3>
    <MatchCard
      v-for="match in matches"
      :key="match.id"
      :match="match"
      :selectable="match.status == 'upcoming'"
    />
  </div>
</template>

<script>
import MatchCard from '@/components/MatchCard'

export default {
  components: { MatchCard },

  props: {
    matches: {
      type: Array,
      default: () => [],
    },
    title: String,
  },
}
</script>
