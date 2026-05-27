<template>
  <div v-if="leaderboard" class="flex flex-col gap-2 pb-4">

    <!-- Invite players -->
    <ShareButton
      :password="leaderboard.password"
      text="Invite players"
      icon="user-plus"
      class="action-btn invite-btn"
    />

    <!-- Leave leaderboard -->
    <button
      v-if="!leaderboard.leaveDisabled"
      @click="showLeaveModal = true"
      class="action-btn leave-btn flex items-center justify-center gap-2 w-full rounded-2xl py-3.5 px-5 text-sm font-semibold transition-all duration-200 focus:outline-none"
      style="background: rgba(250,81,81,0.1); color: #fa5151; border: 1px solid rgba(250,81,81,0.2)"
    >
      <BaseIcon name="sign-out-alt" />
      Leave this leaderboard
    </button>

    <!-- Create a new leaderboard -->
    <BaseLink
      :to="{ name: 'new_leaderboard' }"
      class="action-btn create-btn flex items-center justify-center gap-2 w-full rounded-2xl py-3.5 px-5 text-sm font-semibold transition-all duration-200"
      style="background: rgba(255,255,255,0.12); color: rgba(255,255,255,0.7)"
    >
      <BaseIcon name="plus" />
      Create a new leaderboard
    </BaseLink>

    <!-- Leave confirmation modal -->
    <ConfirmDelete
      v-if="showLeaveModal"
      modalHeadline="Leave this leaderboard?"
      deleteMessage="You will need an invite link to rejoin."
      @deleteRecordEvent="leave"
      @closeModal="showLeaveModal = false"
    />

  </div>
</template>

<script>
import { mapActions } from 'vuex'
import ShareButton from '@/components/ShareButton'
import ConfirmDelete from '@/components/ConfirmDelete'

export default {
  name: 'LeaderboardActions',

  components: { ShareButton, ConfirmDelete },

  props: {
    leaderboard: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      showLeaveModal: false,
    }
  },

  methods: {
    ...mapActions({
      leaveLeaderboard: 'leaderboards/leaveLeaderboard',
    }),
    async leave() {
      await this.leaveLeaderboard(this.leaderboard.id)
      this.showLeaveModal = false
    },
  },
}
</script>

<style lang="scss" scoped>
// Override ShareButton's internal button to match our action-btn style
.invite-btn ::v-deep button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  border-radius: 1rem !important;
  padding: 0.875rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s;
  background: linear-gradient(135deg, #3e3b7d, #6690b7);
  color: white;
  border: none;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
}
</style>
