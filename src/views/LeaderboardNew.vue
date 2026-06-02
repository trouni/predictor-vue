<template>
  <div class="min-h-full flex flex-col justify-center px-5 py-8">

    <!-- Card -->
    <div
      class="w-full max-w-sm mx-auto rounded-3xl px-6 py-8"
      style="background: rgba(255,255,255,0.11); border: 1px solid rgba(255,255,255,0.18)"
    >

      <!-- Branding -->
      <div class="flex flex-col items-center mb-8">
        <div
          class="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
          style="background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2)"
        >
          <BaseIcon name="ranking-star" style="color: white; font-size: 1.4rem" />
        </div>
        <h2 class="text-white font-bold text-xl">New leaderboard</h2>
        <p class="text-sm mt-1 text-center" style="color: rgba(255,255,255,0.45)">
          Invite friends to compete with you
        </p>
      </div>

      <!-- Form -->
      <div class="flex flex-col gap-4">

        <!-- Name -->
        <div>
          <label class="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style="color: rgba(255,255,255,0.5)">
            Leaderboard name
          </label>
          <input
            v-model="name"
            type="text"
            autofocus
            placeholder="e.g. Work mates, Family, The lads…"
            class="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-all"
            style="background: rgba(255,255,255,0.12); color: white; border: 1px solid rgba(255,255,255,0.2)"
            @keypress.enter="submit"
          />
        </div>

        <!-- Submit -->
        <button
          :disabled="processingForm || !name.trim()"
          @click="submit"
          class="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-bold text-sm transition-all duration-200 hover:opacity-90 disabled:opacity-40 mt-1"
          style="background: #fa5151"
        >
          <BaseIcon v-if="processingForm" name="circle-notch" class="fa-spin" />
          <span>Create leaderboard</span>
        </button>

      </div>
    </div>

    <!-- Back -->
    <p class="text-center text-sm mt-6" style="color: rgba(255,255,255,0.45)">
      Changed your mind?
      <BaseLink
        :to="{ name: 'rankings' }"
        class="font-semibold ml-1"
        style="color: white"
      >
        Back to rankings
      </BaseLink>
    </p>

  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      name: '',
      processingForm: false,
      newLeadboard: null,
    }
  },

  mounted() {
    this.$emit('init')
  },

  methods: {
    ...mapActions({
      postLeaderboard: 'leaderboards/postLeaderboard',
      selectLeaderboard: 'leaderboards/selectLeaderboard',
      fetchLeaderboards: 'leaderboards/fetchLeaderboards',
    }),
    async submit() {
      if (!this.name.trim()) return
      this.processingForm = true
      this.newLeadboard = await this.postLeaderboard({ name: this.name })
      await this.fetchLeaderboards()
      this.selectLeaderboard(this.newLeadboard.id)
      this.processingForm = false
      this.$router.push(
        this.$route.query.redirectFrom || { name: 'rankings' }
      )
    },
  },
}
</script>

<style scoped>
input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}
input:focus {
  border-color: rgba(255, 255, 255, 0.45) !important;
  background: rgba(255, 255, 255, 0.16) !important;
}
</style>
