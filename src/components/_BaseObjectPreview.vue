<template>
  <ul v-if="object">
    <li v-for="(key, index) in Object.keys(object)" :key="index">
      {{ key }}: {{ object[key] }}
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    object: {
      type: Object,
      default: () => {},
    },
  },
}
</script>
