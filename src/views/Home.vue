<template>
  <div class="landing">

    <!-- ─── Minimal header ─── -->
    <header class="flex items-center justify-between px-6 pt-6 pb-2 relative z-10">
      <div class="flex items-center gap-2">
        <img
          :src="require('../assets/logo.png')"
          alt="Octacle logo"
          class="w-8 h-8 object-contain"
        />
        <span class="text-white font-bold text-lg tracking-tight">Octacle</span>
      </div>
      <BaseLink
        :to="{ name: loggedIn ? 'predictions' : 'login' }"
        class="text-sm font-semibold px-4 py-2 rounded-full transition-opacity hover:opacity-80"
        style="background: rgba(255,255,255,0.15); color: white"
      >
        {{ loggedIn ? 'Open app' : 'Log in' }}
      </BaseLink>
    </header>

    <!-- ─── Hero ─── -->
    <section class="hero flex flex-col items-center text-center px-6 pt-10 pb-16 relative">
      <div>
        <h1 class="text-white font-black leading-none mb-4" style="font-size: 3rem; letter-spacing: -0.03em">
          Predict.<br />Compete.<br />Win.
        </h1>
      </div>

      <p class="text-lg mb-2 max-w-xs mx-auto" style="color: rgba(255,255,255,0.65); line-height: 1.5">
        Make predictions on every match, climb private leaderboards with friends, and prove you know football.
      </p>

      <p class="text-xs mb-10" style="color: rgba(255,255,255,0.35)">
        Inspired by Paul the Octopus 🐙 — the original predictor
      </p>

      <!-- Primary CTA -->
      <BaseLink
        :to="{ name: loggedIn ? 'predictions' : 'login' }"
        class="inline-flex items-center justify-center gap-2 w-full max-w-xs px-8 py-4 rounded-2xl text-white font-bold text-lg shadow-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        style="background: #fa5151"
      >
        {{ loggedIn ? 'Get Started' : 'Get started — it\'s free' }}
        <BaseIcon name="arrow-right" style="font-size: 0.9rem" />
      </BaseLink>

      <!-- Secondary link for guests -->
      <p v-if="!loggedIn" class="mt-4 text-sm" style="color: rgba(255,255,255,0.4)">
        Already have an account?
        <BaseLink
          :to="{ name: 'login' }"
          class="font-semibold underline"
          style="color: rgba(255,255,255,0.65)"
        >
          Log in
        </BaseLink>
      </p>

      <!-- Decorative gradient orbs -->
      <div class="orb orb-1" />
      <div class="orb orb-2" />
    </section>

    <!-- ─── How it works ─── -->
    <section class="pt-5 px-5 pb-12">

      <p class="text-center text-xs font-semibold uppercase tracking-widest mb-6" style="color: rgba(255,255,255,0.4)">
        How it works
      </p>

      <div class="flex flex-col gap-4 max-w-sm mx-auto">

        <!-- Step 1 -->
        <div
          class="rounded-2xl px-5 py-5 flex items-center gap-4"
          style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15)"
        >
          <div
            class="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner"
            style="background: rgba(255,255,255,0.1)"
          >
            ⚽
          </div>
          <div>
            <h3 class="text-white font-bold text-base mb-0.5">Predict matches</h3>
            <p class="text-sm leading-snug" style="color: rgba(255,255,255,0.55)">
              Pick the winner (or draw) for every upcoming game before kick-off.
            </p>
          </div>
        </div>

        <!-- Step 2 -->
        <div
          class="rounded-2xl px-5 py-5 flex items-center gap-4"
          style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15)"
        >
          <div
            class="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner"
            style="background: rgba(255,255,255,0.1)"
          >
            🏆
          </div>
          <div>
            <h3 class="text-white font-bold text-base mb-0.5">Compete with friends</h3>
            <p class="text-sm leading-snug" style="color: rgba(255,255,255,0.55)">
              Create private leaderboards and invite your mates to join.
            </p>
          </div>
        </div>

        <!-- Step 3 -->
        <div
          class="rounded-2xl px-5 py-5 flex items-center gap-4"
          style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15)"
        >
          <div
            class="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner"
            style="background: rgba(255,255,255,0.1)"
          >
            🥇
          </div>
          <div>
            <h3 class="text-white font-bold text-base mb-0.5">Rise to the top</h3>
            <p class="text-sm leading-snug" style="color: rgba(255,255,255,0.55)">
              Every correct prediction earns you points. Who's the real oracle?
            </p>
          </div>
        </div>

      </div>
    </section>

    <!-- ─── Bottom CTA ─── -->
    <section
      class="mx-4 mb-10 rounded-3xl px-6 py-8 text-center"
      style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18)"
    >
      <p class="text-2xl font-black text-white mb-2">
        Ready to predict? 🐙
      </p>
      <p class="text-sm mb-6" style="color: rgba(255,255,255,0.5)">
        Join thousands of fans predicting football results.
      </p>
      <BaseLink
        :to="{ name: loggedIn ? 'predictions' : 'login' }"
        class="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-white font-bold transition-all duration-200 hover:opacity-90"
        style="background: #fa5151"
      >
        {{ loggedIn ? 'Compete' : 'Join for free' }}
        <BaseIcon name="arrow-right" style="font-size: 0.85rem" />
      </BaseLink>
    </section>

    <!-- ─── Footer ─── -->
    <footer class="text-center pb-10">
      <p class="text-xs" style="color: rgba(255,255,255,0.25)">
        © {{ currentYear }} Octacle · Inspired by Paul the Octopus
      </p>
    </footer>

  </div>
</template>

<script>
import { authComputed } from '@/store/helpers'

export default {
  name: 'Home',

  computed: {
    ...authComputed,
    currentYear() {
      return new Date().getFullYear()
    },
  },
}
</script>

<style lang="scss" scoped>
.landing {
  min-height: 100vh;
  background: linear-gradient(167.4deg, #3e3b7d 0%, #6690b7 88.73%);
  overflow-x: hidden;
}

.hero {
  overflow: hidden;
}

// Decorative blurred orbs behind the hero
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  pointer-events: none;
  z-index: 0;
}
.orb-1 {
  width: 280px;
  height: 280px;
  background: rgba(250, 81, 81, 0.18);
  top: -60px;
  right: -80px;
}
.orb-2 {
  width: 220px;
  height: 220px;
  background: rgba(102, 144, 183, 0.35);
  bottom: 0;
  left: -60px;
}

// Ensure hero content sits above orbs
.hero > *:not(.orb) {
  position: relative;
  z-index: 1;
}

// Desktop: centre-column layout, slightly wider card feel
@media (min-width: 640px) {
  .landing {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  header,
  section,
  footer {
    width: 100%;
    max-width: 480px;
  }
}
</style>
