<template>
  <div class="d-flex ranking bg-white/50 w-[95%] mx-auto px-1 py-2 bg-white rounded-lg shadow-lg">
    <div class="d-flex min-w-0">
      <div class="position text-center flex-shrink-0" :class="{ 'w-12': !!position }">
        <p v-if="!!position" v-html="ordinalize(position)"></p>
      </div>
      <!-- <div class="direction w-12 text-center flex-shrink-0">
        <p><BaseIcon name="caret-up" /></p>
        <p><BaseIcon name="caret-down" /></p>
        <p>-</p>
      </div> -->
      <div class="flex flex-col gap-2">
        <div v-for="user in users" :key="user.id" class="d-flex">
          <div class="user-avatar text-center flex-shrink-0">
            <div class="relative rounded-full overflow-hidden">
              <cld-context v-if="user.photoKey" :cloudName="cloudName">
                <div class="">
                  <cld-image :publicId="user.photoKey">
                    <cld-transformation
                      width="100"
                      height="100"
                      gravity="face"
                      radius="max"
                      crop="fill"
                    />
                  </cld-image>
                </div>
              </cld-context>
              <img
                v-else
                alt="football graphic"
                :src="require('../assets/player.png')"
              />
            </div>
          </div>
          <BaseLink
            :to="{ name: 'predictions', query: { userId: user.userId } }"
            :disabled="!linkPredictions"
            class="p-2 name w-full truncate"
          >
            {{ user.name }}
          </BaseLink>
        </div>
      </div>
    </div>
    <div class="points w-12 text-center flex-shrink-0  py-1"> {{ users[0].points }}<span v-if="users[0].possiblePoints" class="font-light text-xs"> / {{ users[0].possiblePoints }}</span></div>
  </div>
</template>

<script>
import { CldContext, CldImage, CldTransformation } from 'cloudinary-vue'
import { config } from '@/constants'

export default {
  props: {
    users: {
      type: Array,
    },
    position: {
      type: Number,
      default: null,
    },
    points: {
      type: Number,
      default: null,
    },
    linkPredictions: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    CldContext,
    CldImage,
    CldTransformation,
  },
  data() {
    return {
      cloudName: config.cloudName,
    }
  },
  methods: {
    ordinalize(num) {
      switch (num % 10) {
        case 1:
          return num.toString() + '<sup>st</sup>'
        case 2:
          return num.toString() + '<sup>nd</sup>'
        case 3:
          return num.toString() + '<sup>rd</sup>'
        default:
          return num.toString() + '<sup>th</sup>'
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles';

.d-flex {
  display: flex;
  align-items: center;
}

.ranking {
  justify-content: space-between;
  align-items: center;
}

.w-50 {
  width: 50px;
  text-align: center;
  flex-shrink: 0;
}
.user-avatar {
  @apply w-12;
  & > div { @apply w-9 border border-white; }
}

.w-30 {
  width: 30px;
  text-align: center;
}

.w-100 {
  width: 100%;
}

.leaderboard-ranking {
  display: flex;
}

.ranking p {
  margin: 0;
}

.avatar {
  border-radius: 50%;
  width: 30px;
}

.position {
  color: $purple;
  font-size: 1.1em;
}

.name {
  font-weight: lighter;
}

.points {
  font-weight: bolder;
  color: $red;
}

.fa-caret-up {
  color: $green;
}

.fa-caret-down {
  color: $red;
}

.ranking:nth-child(1) {
  @apply min-h-[80px] w-[100%] bg-white/80;
  .name, .points {font-size: 1.3em;}
  .user-avatar {
    @apply w-16;
    & > div { @apply w-16 }
  }
  .position { @apply scale-[150%]; }
}
.ranking:nth-child(2) {
  @apply min-h-[70px] w-[98%] bg-white/70;
  .name, .points {font-size: 1.2em;}
  .user-avatar {
    @apply w-14;
    & > div { @apply w-14 }
  }
  .position { @apply scale-[125%]; }
}
.ranking:nth-child(3) {
  @apply min-h-[60px] w-[96%] bg-white/60;
  .name, .points {font-size: 1.1em;}
  .user-avatar {
    @apply w-12;
    & > div { @apply w-12 }
  }
  .position { @apply scale-[110%]; }
}
</style>
