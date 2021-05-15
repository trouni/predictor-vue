<template>
  <div> </div>
</template>

<script>
export default {
  props: {
    competitionId: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      loading: false,
      leaderboards: [],
    }
  },
}
</script>
