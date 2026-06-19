<template>
  <div
    class="user-avatar flex-shrink-0 rounded-full overflow-hidden"
    :class="borderClass"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <img :src="src" :alt="name" class="w-full h-full object-cover" />
  </div>
</template>

<script>
import { config } from '@/constants'
import { isImageUrl } from '@/utils/helpers'

export default {
  name: 'UserAvatar',

  props: {
    photoKey: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: '',
    },
    size: {
      type: Number,
      default: 36,
    },
    borderClass: {
      type: String,
      default: 'border-2 border-white shadow',
    },
  },

  computed: {
    src() {
      if (!this.photoKey) return require('../assets/player.png')
      if (isImageUrl(this.photoKey)) return this.photoKey
      const px = this.size * 2
      return `https://res.cloudinary.com/${config.cloudName}/image/upload/w_${px},h_${px},c_fill,g_face,r_max/${this.photoKey}`
    },
  },
}
</script>
