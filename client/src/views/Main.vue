<template>
  <n-layout-content>
    <query-area />
  </n-layout-content>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { NLayoutContent } from 'naive-ui'
import QueryArea from '../components/QueryArea.vue'

export default defineComponent({
  name: 'MainView',
  components: {
    NLayoutContent,
    QueryArea
  }
})
</script>
