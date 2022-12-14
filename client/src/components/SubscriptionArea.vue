<template>
  <div>
    <n-card title="Your subscriptions">
    <n-space vertical>
      <div v-if="music.length === 0">No subscriptions.</div>
      <div v-else>
        <n-grid
          x-gap="12"
          y-gap="12"
          cols="1 400:2 600:3 800:4 1000:5 1250:6 1500:7"
        >
          <n-gi v-for="song in music" :key="song.song_id">
            <song-card :song="song" @subChanged="fetchSubscriptions" />
          </n-gi>
        </n-grid>
      </div>
    </n-space>
    </n-card>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { NSpace, NGrid, NGi, NCard } from 'naive-ui'
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
    NGi,
    NCard
  },
  setup: () => {
    const store = useStore()
    const currentUser = computed(() => store.getters.currentUser)
    return {
      music: musicRef,
      loading: loadingRef,
      fetchSubscriptions: async () => {
        loadingRef.value = true
        const data = (await http.get(
          `/${currentUser.value.user_id}/subscriptions`
        )) as MusicResponse
        musicRef.value = data.music
        store.commit('setSubscriptions', data.music)
        loadingRef.value = false
      }
    }
  },
  mounted: async function () {
    await this.fetchSubscriptions()
  }
})
</script>
