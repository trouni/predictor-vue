<template>
  <div>
    <h1>Competition #{{ id }}</h1>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: Number,
      default: null,
      required: true,
    },
  },
}
</script>
