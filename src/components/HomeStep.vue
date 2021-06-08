<template>
  <div class="step">
    <img alt="football graphic" :src="step.img" class="home-img" />
    <h5>{{ step.title }}</h5>
    <p>{{ step.description }}</p>
  </div>
</template>

<script>
export default {
  props: {
    step: {
      type: Object,
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles';
.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 208px;
  margin: ($spacer * 2) 0;
  h5 {
    color: $white;
    font-weight: bolder;
    margin: $spacer 0 ($spacer / 2) 0;
  }
  p {
    color: $white;
    opacity: 0.7;
    text-align: center;
  }
}
.home-img {
  width: 40px;
}
// Small devices (landscape phones, 576px and up)
@media (min-width: 576px) {
  .step {
    h5 {
      font-size: 1.3em;
      margin: ($spacer * 2) 0 $spacer 0;
    }
  }
  .home-img {
    width: $spacer * 8;
  }
}
</style>
