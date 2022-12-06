<template>
  <div class="flex flex-col gap-3 text-center m-3 py-1">
    <BaseLink v-if="to" :to="to">
      <BaseIcon :name="icon" /> <span class="ml-1">{{ text }}</span>
    </BaseLink>
    <ShareButton
      v-else-if="action === 'invite'"
      :password="leaderboard.password"
      :text="text"
      :icon="icon"
    />
    <div
      v-else-if="action === 'leave' && !leaderboard.leaveDisabled"
      @click="showModal = true"
      class="cursor-pointer"
    >
      <BaseIcon :name="icon" /> <span class="ml-1">{{ text }}</span>
    </div>
    <ConfirmDelete
      v-if="showModal"
      modalHeadline="Leave this leaderboard?"
      deleteMessage="You will need an invite link to rejoin."
      @deleteRecordEvent="leave"
      @closeModal="closeModal"
    ></ConfirmDelete>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import ShareButton from '@/components/ShareButton'
import ConfirmDelete from '@/components/ConfirmDelete'

export default {
  components: { ShareButton, ConfirmDelete },

  props: {
    leaderboard: {
      type: Object,
      required: false,
    },
    text: {
      type: String,
      required: false,
    },
    icon: {
      type: String,
      required: false,
    },
    to: {
      type: Object,
      required: false,
    },
    action: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      showModal: false,
    }
  },
  methods: {
    ...mapActions({
      leaveLeaderboard: 'leaderboards/leaveLeaderboard',
    }),
    closeModal() {
      // TODO: Make this close the modal
      this.showModal = false
    },
    async leave() {
      await this.leaveLeaderboard(this.leaderboard.id)
      this.closeModal()
    },
  },
}
</script>
