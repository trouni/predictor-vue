<template>
  <div v-if="show" class="flex flex-col gap-1.5">
    <div class="flex items-center gap-3 px-1 py-1">
      <div class="flex-1 border-t border-white/15" />
      <span
        class="text-white/40 text-xs uppercase tracking-widest font-semibold"
      >
        Stats
      </span>
      <div class="flex-1 border-t border-white/15" />
    </div>
    <div class="grid grid-cols-2 gap-1.5">
      <StatCard
        v-for="card in cards"
        :key="card.key"
        :emoji="card.emoji"
        :title="card.title"
        :subtitle="card.subtitle"
        :users="card.users"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import StatCard from '@/components/StatCard'
import { computeStats } from '@/utils/statsLogic'

const MIN_MATCHES = 3

const CATALOG = [
  {
    key: 'longestCorrectStreak',
    emoji: '🔮',
    title: 'The Clairvoyant',
    sub: s => `${s.value} correct in a row`,
  },
  {
    key: 'longestIncorrectStreak',
    emoji: '🤡',
    title: 'The "Visionary"',
    sub: s => `${s.value} wrong in a row`,
  },
  {
    key: 'currentCorrectStreak',
    emoji: '🚀',
    title: 'The current hot sh*t',
    sub: s => `${s.value} correct in a row,\nsuch a poser`,
  },
  {
    key: 'currentIncorrectStreak',
    emoji: '💀',
    title: 'The current disaster',
    sub: s => `${s.value} wrong in a row,\nwow, really?`,
  },
  {
    key: 'theRebel',
    emoji: '🤘',
    title: 'The Rebel',
    sub: s => `beat the crowd ${s.value}×`,
  },
  {
    key: 'theSheep',
    emoji: '🐑',
    title: 'The Sheep',
    sub: s => `followed the crowd ${s.value}×`,
  },
  {
    key: 'soulMates',
    emoji: '👯',
    title: 'The Soul Mates',
    sub: s => `agreed on ${s.value} picks`,
  },
  {
    key: 'nemeses',
    emoji: '⚔️',
    title: 'The Arch Rivals',
    sub: s => `clashed on ${s.value} picks`,
  },
  {
    key: 'bestAccuracy',
    emoji: '🎯',
    title: 'The Sharpshooter',
    sub: s => `${Math.round(s.value * 100)}% on target`,
  },
  {
    key: 'giantSlayer',
    emoji: '🍀',
    title: 'The Giant Slayer',
    sub: s => `against the grain paid off ${s.value}x`,
  },
  {
    key: 'drawWhisperer',
    emoji: '🤝',
    title: 'The On the Fence',
    sub: s => `nailed ${s.value} draws`,
  },
  {
    key: 'mostWrong',
    emoji: '🦄',
    title: 'My little Pony',
    sub: s => `Congratulations, ${s.value} wrong picks. I'm actually amazed`,
  },
]

export default {
  name: 'LeaderboardStats',

  components: { StatCard },

  props: {
    leaderboard: {
      type: Object,
      required: true,
    },
  },

  computed: {
    ...mapGetters({
      matches: 'matches/matches',
    }),

    result() {
      return computeStats(this.leaderboard, this.matches, { maxMembers: 60 })
    },

    show() {
      return (
        this.result.data.finishedCount >= MIN_MATCHES && this.cards.length > 0
      )
    },

    cards() {
      const { data, stats } = this.result
      const resolve = userId =>
        data.userIndex.get(userId) || {
          userId,
          name: 'Unknown',
          photoKey: null,
        }

      // Only cards with a computed winner are shown; the rest are hidden.
      return CATALOG.filter(card => stats[card.key]).map(card => {
        const stat = stats[card.key]
        const users =
          stat.kind === 'pair'
            ? stat.userIds.map(resolve)
            : [resolve(stat.userId)]
        return {
          key: card.key,
          emoji: card.emoji,
          title: card.title,
          subtitle: card.sub(stat),
          users,
        }
      })
    },
  },
}
</script>
