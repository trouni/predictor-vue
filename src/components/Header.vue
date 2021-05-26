<template>
  <div class="header-container">
    <div class="d-flex justify-content-center">
      <img
        alt="football graphic"
        src="../assets/football.png"
        class="header-img"
      />
      <h1> European Championship</h1>
    </div>
    <div class="d-flex justify-content">
      <div class="mx-5">
        <BaseIcon name="angle-left" />
      </div>
      <h3>Group Stage </h3>
      <div class="mx-5">
        <BaseIcon name="angle-right" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles';
.header-container {
  padding: $spacer;
  color: $white;
}

.justify-content {
  justify-content: space-between;
}

.justify-content-center {
  justify-content: center;
}

.d-flex {
  display: flex;
  align-items: center;
}

.mx-5 {
  margin: 0 16px;
}

.header-img {
  width: 24px;
  height: 24px;
}

h1 {
  color: $white;
}

h3 {
  margin: ($spacer / 2);
  color: $white;
  font-weight: lighter;
}

img {
  margin-right: $spacer;
}

// Small devices (landscape phones, 576px and up)
@media (min-width: 576px) {
  .justify-content {
    justify-content: center;
  }

  .header-img {
    width: 36px;
    height: 36px;
  }
}
</style>
