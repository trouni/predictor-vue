<template>
  <div
    class="bg-ranking-card rounded-2xl shadow-sm px-3 py-4 flex flex-col items-center text-center gap-1.5"
  >
    <span class="text-4xl leading-none">{{ emoji }}</span>

    <p
      class="text-white text-xs uppercase tracking-wide font-semibold leading-tight"
    >
      {{ title }}
    </p>

    <div class="flex items-center justify-center mt-2.5">
      <UserAvatar
        v-for="user in users"
        :key="user.userId"
        :photo-key="user.photoKey"
        :name="user.name"
        :size="36"
      />
    </div>

    <p class="text-white/90 text-xs font-medium truncate max-w-full">
      {{ names }}
    </p>
    <p class="text-white/50 text-xs leading-snug whitespace-pre-line">
      {{ subtitle }}
    </p>
  </div>
</template>

<script>
import UserAvatar from '@/components/UserAvatar'

export default {
  name: 'ShortCard',

  components: { UserAvatar },

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
  },

  computed: {
    names() {
      return this.users.map(user => user.name).join(' & ')
    },
  },
}
</script>

<style scoped>
.bg-ranking-card {
  background: rgba(255, 255, 255, 0.07);
}
</style>
