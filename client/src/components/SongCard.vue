<template>
  <n-card :title="song.title" style="height: 100%">
    <template #cover>
      <img :src="song.img_url" />
    </template>
    <div>{{ song.artist }}</div>
    <div>{{ song.year }}</div>
    <div><n-button type="primary"> Subscribe </n-button></div>
  </n-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { NCard, NButton } from 'naive-ui'
import { Song } from '../types'

export default defineComponent({
  name: 'SongCard',

  props: {
    song: {
      type: Object as PropType<Song>,
      required: true
    }
  },
  components: {
    NButton,
    NCard
  },
  setup: () => {
    return {}
  }
})
</script>

<style land="scss">
.n-card__content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
