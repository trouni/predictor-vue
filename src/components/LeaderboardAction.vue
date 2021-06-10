<template>
  <div class="action-pill">
    <BaseLink v-if="path" :to="{ name: path }">
      <span class="mr-1">{{ text }} </span><BaseIcon :name="icon" />
    </BaseLink>
    <ShareButton
      v-else-if="action === 'invite'"
      :password="leaderboard.password"
    />
    <div v-else-if="action === 'leave'" @click="showModal = true"
      ><span class="mr-1">{{ text }} </span><BaseIcon :name="icon" />
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
      default: null,
      required: false,
    },
    text: {
      type: String,
      default: null,
      required: false,
    },
    icon: {
      type: String,
      default: null,
      required: false,
    },
    path: {
      type: String,
      default: null,
      required: false,
    },
    action: {
      type: String,
      default: null,
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
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles';
.action-pill {
  background-color: $light-gray;
  color: $purple;
  padding: $spacer / 2 $spacer * 2;
  flex: 1;
  border-radius: $spacer * 2;
  margin: $spacer $spacer / 2;
  text-align: center;
}
</style>
