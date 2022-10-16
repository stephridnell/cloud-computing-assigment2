<template>
  <div>
    <n-space vertical>
      <div v-if="music.length === 0">No subscriptions.</div>
      <div v-else>
        <n-grid
          x-gap="12"
          y-gap="12"
          cols="1 400:2 600:3 1000:4 1500:5 1750:6 2000:7"
        >
          <n-gi v-for="song in music" :key="song.song_id">
            <song-card :song="song" />
          </n-gi>
        </n-grid>
      </div>
    </n-space>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { NSpace, NGrid, NGi } from 'naive-ui'
import http from '../http'
import { Song } from '../types'
import SongCard from './SongCard.vue'
import { useStore } from 'vuex'

interface MusicResponse {
  music: Song[]
}

const musicRef = ref<Song[]>([])
const loadingRef = ref(true)

export default defineComponent({
  name: 'SubscriptionArea',
  components: {
    NSpace,
    SongCard,
    NGrid,
    NGi
  },
  setup: () => {
    return {
      music: musicRef,
      loading: loadingRef
    }
  },
  mounted: async function () {
    const store = useStore()
    const currentUser = computed(() => store.getters.currentUser)
    loadingRef.value = true
    const data = (await http.get(
      `/${currentUser.value.user_id}/subscriptions`
    )) as MusicResponse
    musicRef.value = data.music
    loadingRef.value = false
  }
})
</script>
