<template>
  <div
    class="bg-ranking-card rounded-2xl shadow-sm px-4 py-3 flex items-center gap-6"
  >
    <!-- left: avatar(s) + name, stacked, one fifth of the row -->
    <div class="flex flex-col items-center text-center gap-2 min-w-0 w-1/5">
      <div class="flex items-center">
        <UserAvatar
          v-for="user in users"
          :key="user.userId"
          :photo-key="user.photoKey"
          :name="user.name"
          :size="48"
        />
      </div>
      <p class="text-white/90 text-sm font-medium truncate max-w-full">
        {{ names }}
      </p>
    </div>

    <!-- right: emoji on top, then title + description -->
    <div class="flex flex-col items-center text-center flex-1 min-w-0">
      <span class="text-3xl leading-none">{{ emoji }}</span>
      <p
        class="text-white text-xs uppercase tracking-wide font-semibold leading-tight mt-1"
      >
        {{ title }}
      </p>
      <p class="text-white/50 text-xs leading-snug whitespace-pre-line">
        {{ subtitle }}
      </p>
    </div>
  </div>
</template>

<script>
import UserAvatar from '@/components/UserAvatar'

export default {
  name: 'LongCard',

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
