<template>
  <BaseButton class="secondary" @click="copy">
    <BaseIcon :name="copied ? 'check' : icon" />
    <span class="ml-2">{{ copied ? 'URL Copied!' : text }}</span>
  </BaseButton>
</template>

<script>
export default {
  props: {
    password: {
      type: String,
      default: null,
      required: true,
    },
    text: {
      type: String,
      default: 'Share',
      required: false,
    },
    icon: {
      type: String,
      default: 'share',
      required: false,
    },
  },
  data() {
    return {
      copied: false,
    }
  },
  methods: {
    copy() {
      this.copied = true
      setTimeout(() => {
        this.copied = false
      }, 3000)
      const text = window.location.origin + '/join/' + this.password
      const elem = document.createElement('textarea')
      elem.value = text
      document.body.appendChild(elem)
      elem.select()
      document.execCommand('copy')
      document.body.removeChild(elem)
    },
  },
}
</script>
