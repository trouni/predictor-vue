<template>
  <div>
    <h1>Matches</h1>
    <p v-if="competitionId">Competition {{ competitionId }}</p>
    <p v-if="userId">User {{ userId }}</p>
  </div>
</template>

<script>
import store from '@/store'

export default {
  props: {
    competitionId: {
      type: Number,
      default: null,
      required: false,
    },
    userId: {
      type: Number,
      default: store.getters['auth/currentUser']?.id,
      required: false,
    },
  },
}
</script>
