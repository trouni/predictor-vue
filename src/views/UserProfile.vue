<template>
  <div class="pb-24">

    <!-- ─── Hero: avatar + identity ─── -->
    <div class="flex flex-col items-center pt-10 pb-8 px-4">

      <!-- Avatar with upload trigger -->
      <div class="relative mb-5">
        <div class="w-28 h-28 rounded-full overflow-hidden border-4 shadow-2xl" style="border-color: rgba(255,255,255,0.3)">
          <cld-context v-if="user && (user.photoKey || user.photo_key)" :cloudName="cloudName">
            <cld-image :publicId="user.photoKey || user.photo_key">
              <cld-transformation
                width="200"
                height="200"
                gravity="face"
                radius="max"
                crop="fill"
              />
            </cld-image>
          </cld-context>
          <img
            v-else
            :src="require('../assets/player.png')"
            alt="Profile photo"
            class="w-full h-full object-cover"
          />
        </div>
        <!-- Upload button -->
        <button
          @click="openUploadModal"
          :disabled="!user"
          class="absolute bottom-0.5 right-0.5 w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 focus:outline-none"
          :class="user ? 'hover:scale-110' : 'opacity-50 cursor-not-allowed'"
          style="background: #fa5151"
          title="Change photo"
        >
          <BaseIcon name="camera" class="text-white" style="font-size: 0.8rem" />
        </button>
        <!-- Random avatar button -->
        <button
          @click="randomizeAvatar"
          :disabled="!user || isShuffling"
          class="absolute bottom-0.5 left-0.5 w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 focus:outline-none"
          :class="
            user && !isShuffling
              ? 'hover:scale-110'
              : 'opacity-50 cursor-not-allowed'
          "
          style="background: #6690b7"
          title="Random avatar"
          aria-label="Random avatar"
        >
          <BaseIcon
            :name="isShuffling ? 'circle-notch' : 'shuffle'"
            :class="{ 'fa-spin': isShuffling }"
            class="text-white "
            style="font-size: 0.8rem"
          />
        </button>
      </div>

      <!-- Name: display mode -->
      <div v-if="user && !isEditingName" class="flex items-center gap-2 mb-1">
        <h2 class="text-white text-2xl font-bold text-center leading-tight">
          {{ user.name }}
        </h2>
        <button
          @click="startEditingName"
          class="text-white/30 hover:text-white/70 transition-colors focus:outline-none mt-0.5"
          title="Edit display name"
        >
          <BaseIcon name="pencil" style="font-size: 0.75rem" />
        </button>
      </div>

      <!-- Name: edit mode -->
      <div v-else-if="user && isEditingName" class="flex items-center gap-2 mb-1">
        <input
          ref="nameInput"
          v-model="editableName"
          class="text-xl font-bold text-center rounded-xl px-3 py-1.5 focus:outline-none"
          style="background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.35); min-width: 0; width: 180px"
          placeholder="Display name"
          @keyup.enter="saveName"
          @keyup.escape="cancelEditingName"
        />
        <button
          @click="saveName"
          :disabled="isSavingName"
          class="w-8 h-8 rounded-full flex items-center justify-center transition-colors focus:outline-none"
          style="background: rgba(12,245,116,0.25); color: #0cf574"
        >
          <BaseIcon :name="isSavingName ? 'circle-notch' : 'check'" :class="{ 'fa-spin': isSavingName }" style="font-size: 0.75rem" />
        </button>
        <button
          @click="cancelEditingName"
          class="w-8 h-8 rounded-full flex items-center justify-center transition-colors focus:outline-none"
          style="background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.4)"
        >
          <BaseIcon name="times" style="font-size: 0.75rem" />
        </button>
      </div>

      <!-- Email (read-only) -->
      <p v-if="user" class="text-sm" style="color: rgba(255,255,255,0.45)">
        {{ user.email }}
      </p>

      <!-- Loading skeleton -->
      <div v-if="!user" class="flex flex-col items-center gap-2">
        <div class="h-7 w-40 rounded-full animate-pulse" style="background: rgba(255,255,255,0.15)" />
        <div class="h-4 w-28 rounded-full animate-pulse" style="background: rgba(255,255,255,0.1)" />
      </div>
    </div>

    <!-- ─── Your Standings ─── -->
    <div class="px-4 mb-6">
      <h3 class="text-xs font-semibold uppercase tracking-widest mb-3" style="color: rgba(255,255,255,0.5)">
        Your Standings
      </h3>

      <div
        class="rounded-2xl overflow-hidden shadow-lg"
        style="background: rgba(255, 255, 255, 0.12)"
      >
        <!-- Competition label -->
        <div v-if="currentCompetition" class="flex items-center gap-2 px-4 pt-3 pb-2 border-b" style="border-color: rgba(255,255,255,0.08)">
          <img
            v-if="currentCompetition.photoUrl"
            :src="currentCompetition.photoUrl"
            class="w-5 h-5 rounded-full object-cover"
            :alt="currentCompetition.name"
          />
          <span class="text-xs font-semibold" style="color: rgba(255,255,255,0.5)">
            {{ currentCompetition.name }}
          </span>
        </div>

        <!-- Leaderboard rows -->
        <template v-if="userStandings.length">
          <div
            v-for="(standing, i) in userStandings"
            :key="standing.leaderboardId"
            class="flex items-center gap-3 px-4 py-3"
            :class="i < userStandings.length - 1 ? 'border-b' : ''"
            :style="i < userStandings.length - 1 ? 'border-color: rgba(255,255,255,0.07)' : ''"
          >
            <!-- Leaderboard name -->
            <span class="flex-1 text-white text-sm font-medium truncate">
              {{ standing.leaderboardName }}
            </span>

            <!-- Rank pill -->
            <span
              class="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0"
              :style="
                standing.rank <= 3
                  ? 'background: rgba(250,204,21,0.2); color: #fbbf24'
                  : 'background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.55)'
              "
              v-html="ordinalize(standing.rank)"
            />

            <!-- Points -->
            <span class="text-sm font-black flex-shrink-0" style="color: #fa5151; min-width: 3rem; text-align: right">
              {{ standing.points }}
              <span class="text-xs font-normal" style="color: rgba(255,255,255,0.35)">pts</span>
            </span>
          </div>
        </template>

        <!-- Not yet ranked -->
        <div v-else-if="leaderboards.length" class="px-4 py-5 text-center">
          <p class="text-sm" style="color: rgba(255,255,255,0.35)">
            Make some predictions to get ranked.
          </p>
        </div>

        <!-- No leaderboards at all -->
        <div v-else class="px-4 py-5 text-center">
          <p class="text-sm" style="color: rgba(255,255,255,0.35)">
            You haven't joined any leaderboards yet.
          </p>
          <BaseLink
            :to="{ name: 'new_leaderboard' }"
            class="inline-block mt-2 text-xs font-semibold"
            style="color: rgba(255,255,255,0.6)"
          >
            Create one →
          </BaseLink>
        </div>
      </div>
    </div>

    <!-- ─── Notifications ─── -->
    <div class="px-4 mb-6">
      <h3 class="text-xs font-semibold uppercase tracking-widest mb-3" style="color: rgba(255,255,255,0.5)">
        Notifications
      </h3>
      <div
        class="rounded-2xl overflow-hidden shadow-lg"
        style="background: rgba(255, 255, 255, 0.12)"
      >
        <!-- Missing predictions -->
        <div
          class="flex items-center justify-between px-4 py-3.5 border-b"
          style="border-color: rgba(255, 255, 255, 0.08)"
        >
          <div>
            <p class="text-white text-sm font-medium">Missing predictions</p>
            <p class="text-xs mt-0.5" style="color: rgba(255, 255, 255, 0.4)">
              Email when missing predictions for a round
            </p>
          </div>
          <div class="flex items-center gap-2 flex-shrink-0">
            <transition name="fade">
              <BaseIcon
                v-if="notifSaved === 'predictionMissing'"
                name="check"
                style="color: #0cf574; font-size: 0.75rem"
              />
            </transition>
            <button
              @click="toggleNotification('predictionMissing')"
              :disabled="isSavingNotifications"
              class="relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none"
              :style="
                notifications.email.predictionMissing
                  ? 'background: #fa5151'
                  : 'background: rgba(255, 255, 255, 0.15)'
              "
            >
              <span
                class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200"
                :style="
                  notifications.email.predictionMissing
                    ? 'transform: translateX(20px)'
                    : 'transform: translateX(0)'
                "
              />
            </button>
          </div>
        </div>

        <!-- New competitions -->
        <div class="flex items-center justify-between px-4 py-3.5">
          <div>
            <p class="text-white text-sm font-medium">New competitions</p>
            <p class="text-xs mt-0.5" style="color: rgba(255, 255, 255, 0.4)">
              Email when a new competition is launched
            </p>
          </div>
          <div class="flex items-center gap-2 flex-shrink-0">
            <transition name="fade">
              <BaseIcon
                v-if="notifSaved === 'competitionNew'"
                name="check"
                style="color: #0cf574; font-size: 0.75rem"
              />
            </transition>
            <button
              @click="toggleNotification('competitionNew')"
              :disabled="isSavingNotifications"
              class="relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none"
              :style="
                notifications.email.competitionNew
                  ? 'background: #fa5151'
                  : 'background: rgba(255, 255, 255, 0.15)'
              "
            >
              <span
                class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200"
                :style="
                  notifications.email.competitionNew
                    ? 'transform: translateX(20px)'
                    : 'transform: translateX(0)'
                "
              />
            </button>
          </div>
        </div>

      </div>
    </div>

    <!-- ─── Account actions ─── -->
    <div class="px-4">
      <h3 class="text-xs font-semibold uppercase tracking-widest mb-3" style="color: rgba(255,255,255,0.5)">
        Account
      </h3>

      <BaseLink
        :to="{ name: 'logout' }"
        class="flex items-center justify-center gap-2 w-full rounded-2xl py-3.5 px-5 text-sm font-semibold transition-opacity hover:opacity-80"
        style="background: rgba(255, 255, 255, 0.12); color: rgba(255, 255, 255, 0.5); border: 1px solid; border-color: rgba(255, 255, 255, 0.08);"
      >

        <BaseIcon name="sign-out-alt" />
        Log out
      </BaseLink>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { CldContext, CldImage, CldTransformation } from 'cloudinary-vue'
import { config } from '@/constants'
import { ordinalize } from '@/utils/helpers'

export default {
  name: 'UserProfile',

  components: { CldContext, CldImage, CldTransformation },

  props: {
    id: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      user: null,
      isEditingName: false,
      editableName: '',
      isSavingName: false,
      cloudName: config.cloudName,
      notifications: {
        email: {
          predictionMissing: false,
          competitionNew: false,
        },
      },
      isSavingNotifications: false,
      notifSaved: null,
      isShuffling: false,
    }
  },

  async mounted() {
    // Fetch in parallel — competitions for the header label, leaderboards for standings
    this.fetchCompetitions()
    this.fetchLeaderboards()
    this.user = await this.fetchUser({ userId: this.id })
    const emailNotifs = this.user.notifications?.email || {}
    this.notifications.email.predictionMissing = !!(
      emailNotifs.predictionMissing || emailNotifs.prediction_missing
    )
    this.notifications.email.competitionNew = !!(
      emailNotifs.competitionNew || emailNotifs.competition_new
    )
    this.$emit('init')
  },

  computed: {
    ...mapGetters({
      competitions: 'competitions/competitions',
      currentCompetitionId: 'competitions/currentCompetitionId',
      leaderboards: 'leaderboards/leaderboards',
      currentUser: 'auth/currentUser',
    }),

    currentCompetition() {
      return this.competitions.find(c => c.id === this.currentCompetitionId)
    },

    // User's rank + points per leaderboard, derived from already-loaded store data
    userStandings() {
      const uid = this.currentUser?.id
      if (!uid) return []

      return this.leaderboards
        .map(lb => {
          const entry = lb.users?.find(u => u.userId === uid)
          if (!entry || entry.points === null || entry.points === undefined) return null
          return {
            leaderboardId: lb.id,
            leaderboardName: lb.name,
            rank: entry.rank,
            points: entry.points,
          }
        })
        .filter(Boolean)
        .sort((a, b) => (a.rank || 999) - (b.rank || 999))
    },
  },

  methods: {
    ...mapActions({
      patchUser: 'users/patchUser',
      fetchCompetitions: 'competitions/fetchCompetitions',
      fetchLeaderboards: 'leaderboards/fetchLeaderboards',
      fetchUser: 'users/fetchUser',
    }),

    // ── Name editing ──
    startEditingName() {
      this.editableName = this.user.name
      this.isEditingName = true
      this.$nextTick(() => this.$refs.nameInput?.focus())
    },
    cancelEditingName() {
      this.isEditingName = false
      this.editableName = ''
    },
    async saveName() {
      const trimmed = this.editableName.trim()
      if (!trimmed || trimmed === this.user.name) {
        this.cancelEditingName()
        return
      }
      this.isSavingName = true
      try {
        this.user = await this.patchUser({
          userId: this.user.id,
          name: trimmed,
          photoKey: this.user.photoKey || this.user.photo_key,
        })
        this.isEditingName = false
      } catch (err) {
        console.error('Failed to update name:', err)
      } finally {
        this.isSavingName = false
      }
    },

    // ── Avatar upload ──
    async randomizeAvatar() {
      if (!this.user) return
      const current = this.user.photoKey || this.user.photo_key
      const avatars = [
        'diaz',
        'gyokeres',
        'haaland',
        'hakimi',
        'kane',
        'kubo',
        'lukaku',
        'mane',
        'mbappe',
        'messi',
        'modric',
        'neymar',
        'ochoa',
        'pulisic',
        'robertson',
        'ronaldo',
        'ruediger',
        'salah',
        'son',
        'virgil',
        'yamal',
      ].filter(a => a !== current)
      const photoKey = avatars[Math.floor(Math.random() * avatars.length)]
      const previousKey = current
      this.isShuffling = true
      this.$set(this.user, 'photoKey', photoKey)
      try {
        this.user = await this.patchUser({
          userId: this.user.id,
          name: this.user.name,
          photoKey,
        })
      } catch (err) {
        console.error('Failed to set random avatar:', err)
        this.$set(this.user, 'photoKey', previousKey)
      } finally {
        this.isShuffling = false
      }
    },

    openUploadModal() {
      window.cloudinary
        .openUploadWidget(
          { cloud_name: this.cloudName, upload_preset: 'cb59wrvm' },
          (error, result) => {
            if (!error && result && result.event === 'success') {
              const photoKey = result.info.public_id
              this.$set(this.user, 'photoKey', photoKey)
              this.patchUser({
                userId: this.user.id,
                name: this.user.name,
                photoKey,
              })
            }
          }
        )
        .open()
    },

    // ── Notification toggles ──
    async toggleNotification(key) {
      this.notifications.email[key] = !this.notifications.email[key]
      this.isSavingNotifications = true
      this.notifSaved = null
      try {
        await this.patchUser({
          userId: this.user.id,
          name: this.user.name,
          photoKey: this.user.photoKey || this.user.photo_key,
          notifications: {
            email: {
              competition_new: this.notifications.email.competitionNew,
              prediction_missing: this.notifications.email.predictionMissing,
            },
          },
        })
        this.notifSaved = key
        setTimeout(() => {
          this.notifSaved = null
        }, 2000)
      } catch (err) {
        console.error('Failed to save notification preference:', err)
        this.notifications.email[key] = !this.notifications.email[key]
      } finally {
        this.isSavingNotifications = false
      }
    },

    // ── Helpers ──
    ordinalize,
  },
}
</script>

<style lang="scss" scoped>
// Ensure Cloudinary images fill the avatar circle
:deep(.cld-image),
:deep(.cld-image img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
</style>
