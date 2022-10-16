<template>
  <n-card :title="song.title" style="height: 100%">
    <template #cover>
      <img :src="song.img_url" />
    </template>
    <div>{{ song.artist }}</div>
    <div>{{ song.year }}</div>
    <div>
      <n-button
        strong
        secondary
        type="warning"
        @click="unsubscribe"
        v-if="!!subscriptionId"
      >
        Unsubscribe
      </n-button>
      <n-button strong secondary type="success" @click="subscribe" v-else>
        Subscribe
      </n-button>
    </div>
  </n-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { NCard, NButton } from 'naive-ui'
import { Song, User } from '../types'
import http from '../http'

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
  computed: {
    subscriptionId (): string {
      return this.$store.getters.subscriptionId(this.song.music_id)
    },

    currentUser (): User {
      return this.$store.getters.currentUser
    }
  },
  methods: {
    async subscribe () {
      await http.post(
        `/${this.currentUser.user_id}/${this.song.music_id}/subscribe`
      )
      this.$emit('subChanged')
    },
    async unsubscribe () {
      await http.post(
        `/${this.currentUser.user_id}/${this.subscriptionId}/unsubscribe`
      )
      this.$emit('subChanged')
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
