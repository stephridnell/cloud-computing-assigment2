<template>
  <n-layout-content>
    <subscription-area ref="subAreaRef" />
    <query-area @subChanged="refreshSubs" />
  </n-layout-content>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { NLayoutContent } from 'naive-ui'
import QueryArea from '../components/QueryArea.vue'
import SubscriptionArea from '../components/SubscriptionArea.vue'

export default defineComponent({
  name: 'MainView',
  components: {
    NLayoutContent,
    QueryArea,
    SubscriptionArea
  },
  setup: function () {
    const subAreaRef = ref<typeof SubscriptionArea>()
    return {
      subAreaRef,
      refreshSubs: function () {
        subAreaRef.value?.fetchSubscriptions()
      }
    }
  }
})
</script>
