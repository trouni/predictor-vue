<template>
  <div class="flex justify-between">
    <div :class="match.groupId ? 'w-1/3' : 'w-1/2'">
      <h4 class="uppercase">{{ match['teamHome'].abbrev }}</h4>
      <div v-for="user in predictions['home']" :key="user.userId">
        {{ user.name }}
      </div>
    </div>
    <div v-if="match.groupId" class="w-1/3">
      <h4 class="uppercase">Draw</h4>
      <div v-for="user in predictions['draw']" :key="user.userId">
        {{ user.name }}
      </div>
    </div>
    <div :class="match.groupId ? 'w-1/3' : 'w-1/2'">
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
