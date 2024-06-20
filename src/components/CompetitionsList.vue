<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div
      v-for="competition in competitions"
      :key="competition.id"
      class="mt-3 flex flex-col border rounded shadow-md"
    >
      <BaseLink
        :to="{ name: 'predictions', params: { id: competition.id } }"
        class="grow h-full"
      >
        <div
          class="card-competition flex flex-col justify-center p-2 h-full"
          @click="handleCompetitionClick(competition.id)"
        >
          <img
            v-if="competition.photoUrl"
            alt="football graphic"
            :src="competition.photoUrl"
            class="grow"
          />
        </div>
      </BaseLink>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    competitions: {
      type: Array,
      required: true,
    },
  },
}
</script>
