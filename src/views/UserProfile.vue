<template>
  <div>
    <h1>User #{{ id }}</h1>
    <p>{{ user }}</p>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: Number,
      required: true,
    },
  },

  async mounted() {
    this.fetchUser()
  },

  data() {
    return {
      loading: false,
      user: null,
    }
  },

  methods: {
    async fetchUser() {
      this.loading = true
      this.user = await this.$store.dispatch('users/fetchUser', {
        userId: this.id,
      })
      this.loading = false
    },
  },
}
</script>
