<template>
  <div>
    <h1>Create League for Competition #{{ competitionId }}</h1>
  </div>
</template>

<script>
export default {
  props: {
    competitionId: {
      type: Number,
      default: null,
      required: true,
    },
  },
}
</script>
