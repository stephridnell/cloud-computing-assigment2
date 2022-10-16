<template>
  <n-layout-content>
    <subscription-area />
    <query-area />
  </n-layout-content>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { NLayoutContent } from 'naive-ui'
import QueryArea from '../components/QueryArea.vue'
import SubscriptionArea from '../components/SubscriptionArea.vue'

export default defineComponent({
  name: 'MainView',
  components: {
    NLayoutContent,
    QueryArea,
    SubscriptionArea
  }
})
</script>
