<template>
  <n-card :title="song.title" style="height: 100%">
    <template #cover>
      <img :src="song.img_url" />
    </template>
    <div>{{ song.artist }}</div>
    <div>{{ song.year }}</div>
    <div>
      <n-button type="primary" @click="subscribe"> Subscribe </n-button>
    </div>
  </n-card>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { NCard, NButton } from 'naive-ui'
import { Song } from '../types'
import http from '../http'
import { useStore } from 'vuex'

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
  setup: (props) => {
    const store = useStore()
    const currentUser = computed(() => store.getters.currentUser)

    return {
      subscribe: async () => {
        await http.post(
          `/${currentUser.value.user_id}/${props.song.music_id}/subscribe`
        )
      }
    }
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
