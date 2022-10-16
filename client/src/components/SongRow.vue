<template>
  <tr>
    <td style="width: 61px;">
      <img :src="song.img_url" width="60" height="60" />
    </td>
    <td>{{ song.title }}</td>
    <td>{{ song.artist }}</td>
    <td>{{ song.year }}</td>
    <td style="width: 106px;">
      <n-button style="width: 100%"
        strong
        secondary
        type="warning"
        @click="unsubscribe"
        v-if="isSubscribedTo"
      >
        Unsubscribe
      </n-button>
      <n-button style="width: 100%" strong secondary type="success" @click="subscribe" v-else>
        Subscribe
      </n-button>
    </td>
  </tr>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { NCard, NButton } from 'naive-ui'
import { Song } from '../types'
import http from '../http'

export default defineComponent({
  name: 'SongRow',

  props: {
    song: {
      type: Object as PropType<Song>,
      required: true
    }
  },
  components: {
    NButton
  },
  computed: {
    subscriptionId () {
      return this.$store.getters.subscriptionId(this.song.music_id)
    },

    currentUser () {
      return this.$store.getters.currentUser
    },

    isSubscribedTo () {
      return !!this.subscriptionId
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
