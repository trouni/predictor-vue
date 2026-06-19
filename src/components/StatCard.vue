<template>
  <LongCard
    v-if="wide"
    :emoji="emoji"
    :title="title"
    :subtitle="subtitle"
    :users="users"
  />
  <ShortCard
    v-else
    :emoji="emoji"
    :title="title"
    :subtitle="subtitle"
    :users="users"
  />
</template>

<script>
import ShortCard from '@/components/ShortCard'
import LongCard from '@/components/LongCard'

export default {
  name: 'StatCard',

  components: { ShortCard, LongCard },

  props: {
    emoji: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      default: '',
    },
    users: {
      type: Array,
      default: () => [],
    },
    wide: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
