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
        v-if="isSubscribedTo"
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
  setup: (props, { emit }) => {
    const store = useStore()
    const currentUser = computed(() => store.getters.currentUser)
    const subscriptionId = computed(() =>
      store.getters.subscriptionId(props.song.music_id)
    )

    return {
      subscribe: async () => {
        await http.post(
          `/${currentUser.value.user_id}/${props.song.music_id}/subscribe`
        )
        emit('subChanged')
      },
      unsubscribe: async () => {
        await http.post(
          `/${currentUser.value.user_id}/${subscriptionId.value}/unsubscribe`
        )
        emit('subChanged')
      },
      isSubscribedTo: !!subscriptionId.value
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
