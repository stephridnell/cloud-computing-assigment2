<template>
  <n-space vertical size="large">
    <n-layout embedded>
      <n-layout-header bordered>
        <n-space align="center" justify="flex-end">
          {{ currentUser.user_name }}
          <n-button quaternary strong size="large" @click="logout">
            <template #icon>
              <n-icon>
                <logout-icon />
              </n-icon>
            </template>
          </n-button>
        </n-space>
      </n-layout-header>
      <router-view />
    </n-layout>
  </n-space>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import {
  NLayout,
  NLayoutHeader,
  NAvatar,
  NButton,
  NSpace,
  NIcon
} from 'naive-ui'
import { useStore } from 'vuex'
import { Logout as LogoutIcon, ListDetails as ForumIcon } from '@vicons/tabler'
import router from '../router'

export default defineComponent({
  name: 'LoggedInWrapper',
  components: {
    NLayout,
    NAvatar,
    NLayoutHeader,
    NButton,
    NSpace,
    NIcon,
    LogoutIcon,
    ForumIcon
  },
  setup: () => {
    const store = useStore()
    const currentUser = computed(() => store.getters.currentUser)
    const currentRoute = computed(() => router.currentRoute.value.path)
    return {
      currentUser,
      currentRoute,
      logout: () => {
        store.commit('logout')
        router.push('/login')
      }
    }
  }
})
</script>

<style scoped>
.n-layout-header {
  padding: 24px;
}

.n-layout-content {
  background: transparent;
  padding: 24px;
}

a {
  text-decoration: none;
}

.active {
  background: var(--n-color-hover);
}
</style>
