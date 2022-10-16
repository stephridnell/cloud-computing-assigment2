<template>
  <n-layout-content>
    <n-grid x-gap="40" y-gap="12" cols="1 1030:2">
      <n-grid-item>
        <subscription-area ref="subAreaRef" />
      </n-grid-item>
      <n-grid-item>
        <query-area @subChanged="refreshSubs" />
      </n-grid-item>
    </n-grid>
  </n-layout-content>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { NLayoutContent, NGridItem, NGrid } from 'naive-ui'
import QueryArea from '../components/QueryArea.vue'
import SubscriptionArea from '../components/SubscriptionArea.vue'

export default defineComponent({
  name: 'MainView',
  components: {
    NLayoutContent,
    QueryArea,
    SubscriptionArea,
    NGridItem,
    NGrid
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
