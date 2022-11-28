<template>
  <div class="flex justify-between">
    <div class="w-1/3">
      <h4 class="uppercase">{{ match['teamHome'].abbrev }}</h4>
      <div v-for="user in predictions['home']" :key="user.userId">
        {{ user.name }}
      </div>
    </div>
    <div class="w-1/3">
      <h4 class="uppercase">Draw</h4>
      <div v-for="user in predictions['draw']" :key="user.userId">
        {{ user.name }}
      </div>
    </div>
    <div class="w-1/3">
      <h4 class="uppercase">{{ match['teamAway'].abbrev }}</h4>
      <div v-for="user in predictions['away']" :key="user.userId">
        {{ user.name }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    match: {
      type: Object,
      required: true,
    },
    predictions: {
      type: Object,
      required: false,
    },
  },
}
</script>
