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
          <n-button :loading="loading" type="primary" @click="handleQuery"> Query </n-button>
        </n-form-item>
      </n-form>
      <div v-if="filteredMusic.length === 0">
        No result is retrieved. Please query again.
      </div>
      <div v-else>
        <n-table :single-line="false">
          <thead>
            <tr>
              <th></th>
              <th>Title</th>
              <th>Artist</th>
              <th>Year</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <song-row v-for="song in filteredMusic" :key="song.music_id" @subChanged="subChanged" :song="song" />
          </tbody>
        </n-table>
      </div>
    </n-space>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { NSpace, NFormItem, NForm, NInput, NButton, NTable } from 'naive-ui'
import http from '../http'
import { Song } from '../types'
import SongRow from './SongRow.vue'

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
    NButton,
    SongRow,
    NTable
  },
  setup: (_props, { emit }) => {
    const queryRef = ref<QueryType>({
      title: '',
      year: '',
      artist: ''
    })

    return {
      subChanged () {
        emit('subChanged')
      },
      music: musicRef,
      filteredMusic: filteredMusicRef,
      loading: loadingRef,
      query: queryRef,
      handleQuery (e: MouseEvent) {
        e.preventDefault()
        const title = queryRef.value.title.trim().toLowerCase()
        const year = queryRef.value.year.trim().toLowerCase()
        const artist = queryRef.value.artist.trim().toLowerCase()

        filteredMusicRef.value = musicRef.value.filter((el) => {
          loadingRef.value = true
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
          loadingRef.value = false
          return include
        })
      }
    }
  },
  mounted: async function () {
    loadingRef.value = true
    const data = (await http.get('/music')) as MusicResponse
    musicRef.value = data.music
    filteredMusicRef.value = data.music
    loadingRef.value = false
  }
})
</script>
