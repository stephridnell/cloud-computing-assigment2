<template>
  <div>
    <n-space vertical>
      <n-form ref="formRef" inline :label-width="80" :model="query">
        <n-form-item label="Title" path="title">
          <n-input v-model:value="query.title" />
        </n-form-item>
        <n-form-item label="Year" path="year">
          <n-input v-model:value="query.year" />
        </n-form-item>
        <n-form-item label="Artist" path="artist">
          <n-input v-model:value="query.artist" />
        </n-form-item>
        <n-form-item>
          <n-button type="primary" @click="handleQuery"> Query </n-button>
        </n-form-item>
      </n-form>
      <pre>
        {{ filteredMusic }}
      </pre>
    </n-space>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { NSpace, NFormItem, NForm, NInput, NButton } from 'naive-ui'
import http from '../http'
import { Song } from '../types'

interface MusicResponse {
  music: Song[]
}

interface QueryType {
  title: string
  year: string
  artist: string
}

const musicRef = ref<Song[]>([])
const filteredMusicRef = ref<Song[]>([])
const loadingRef = ref(true)

export default defineComponent({
  name: 'QueryArea',
  components: {
    NSpace,
    NFormItem,
    NForm,
    NInput,
    NButton
  },
  setup: () => {
    const queryRef = ref<QueryType>({
      title: '',
      year: '',
      artist: ''
    })

    return {
      music: musicRef,
      filteredMusic: filteredMusicRef,
      loading: loadingRef,
      query: queryRef,
      handleQuery(e: MouseEvent) {
        e.preventDefault()
        const title = queryRef.value.title.trim().toLowerCase()
        const year = queryRef.value.year.trim().toLowerCase()
        const artist = queryRef.value.artist.trim().toLowerCase()

        filteredMusicRef.value = musicRef.value.filter((el) => {
          let include = true
          if (title) {
            include = include && el.title.toLowerCase().includes(title)
          }
          if (year) {
            include = include && el.year.toLowerCase().includes(year)
          }
          if (artist) {
            include = include && el.artist.toLowerCase().includes(artist)
          }
          return include
        })
      }
    }
  },
  mounted: async function () {
    loadingRef.value = true
    const data = (await http.get('/music')) as MusicResponse
    musicRef.value = data.music
    loadingRef.value = false
  }
})
</script>

<style lang="scss">
img {
  max-width: 100%;
}
.post-user {
  font-size: 16px;
}
.post-date {
  font-size: 12px;
}
</style>
