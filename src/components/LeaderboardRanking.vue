<template>
  <div class="d-flex ranking w-100">
    <div class="d-flex">
      <div class="position w-50">
        <p>{{ position }}</p>
      </div>
      <!-- <div class="direction w-50">
        <p><BaseIcon name="caret-up" /></p>
        <p><BaseIcon name="caret-down" /></p>
        <p>-</p>
      </div> -->
      <div class="w-50 d-flex">
        <img
          src="https://kitt.lewagon.com/placeholder/users/yannklein"
          alt="use photo"
          class="avatar"
        />
      </div>
      <div class="name w-100"> {{ user.name }}</div>
    </div>
    <div class="points w-50"> {{ user.points }}</div>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
    },
    position: {
      type: Number,
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
  border-radius: 16px;
}

.w-50 {
  width: 50px;
  text-align: center;
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

.ranking {
  background-color: white;
  padding: 8px 4px;
}

.ranking p {
  margin: 0;
}

.avatar {
  border-radius: 50%;
  width: 30px;
}

.position {
  padding: 0 4px;
}

.name {
  font-weight: lighter;
  padding-left: 8px;
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
</style>
