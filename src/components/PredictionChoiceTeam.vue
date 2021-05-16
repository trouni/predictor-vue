<template>
  <div>
    {{ team.name }}
    <TeamBadge :flag="team.badgeUrl" :score="team.score" />
  </div>
</template>

<script>
import TeamBadge from './TeamBadge'

export default {
  components: { TeamBadge },

  props: {
    team: Object,
  },
}
</script>
