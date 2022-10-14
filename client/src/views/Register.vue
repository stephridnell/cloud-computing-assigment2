<template>
  <n-card title="Register">
    <n-form ref="formRef" :model="model" :rules="rules">
      <n-form-item path="email" label="Email">
        <n-input
          v-model:value="model.email"
          @keydown.enter.prevent
          placeholder=""
        />
      </n-form-item>
      <n-form-item path="username" label="Username">
        <n-input
          v-model:value="model.username"
          @keydown.enter.prevent
          placeholder=""
        />
      </n-form-item>
      <n-form-item path="password" label="Password">
        <n-input
          type="password"
          v-model:value="model.password"
          show-password-on="click"
          placeholder=""
        />
      </n-form-item>

      <n-row :gutter="[0, 24]">
        <n-col :span="24">
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
            "
          >
            <n-button
              :loading="loading"
              type="primary"
              @click="handleValidateButtonClick"
            >
              Register
            </n-button>
            <router-link to="/login">Login</router-link>
          </div>
        </n-col>
      </n-row>
    </n-form>
  </n-card>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import {
  FormInst,
  FormRules,
  NForm,
  NFormItem,
  NInput,
  NRow,
  NCol,
  NCard,
  NButton,
  useMessage
} from 'naive-ui'
import http from '../http'
import router from '../router'

interface ModelType {
  email: string
  username: string
  password: string
}

export default defineComponent({
  name: 'RegisterView',
  components: {
    NForm,
    NFormItem,
    NInput,
    NRow,
    NCol,
    NButton,
    NCard
  },
  setup: () => {
    const formRef = ref<FormInst | null>(null)
    const message = useMessage()
    const loadingRef = ref(false)
    const modelRef = ref<ModelType>({
      email: '',
      username: '',
      password: ''
    })
    const rules: FormRules = {
      email: [
        {
          required: true,
          message: 'Email is required'
        }
      ],
      username: [
        {
          required: true,
          message: 'Username is required'
        }
      ],
      password: [
        {
          required: true,
          message: 'Password is required'
        }
      ]
    }
    return {
      formRef,
      model: modelRef,
      loading: loadingRef,
      rules,
      handleValidateButtonClick: async (e: MouseEvent) => {
        e.preventDefault()
        loadingRef.value = true
        try {
          await formRef.value?.validate()
          await http.post('/register', modelRef.value)

          message.success('Registration successful, please login to continue')
          router.push('/login')
        } catch (err: any) {
          if (err.msg) {
            message.error(err.msg, {
              closable: true,
              duration: 5000
            })
          }
        } finally {
          loadingRef.value = false
        }
      }
    }
  }
})
</script>
<style scoped>
.n-card {
  max-width: 420px;
  margin: 0 auto;
  margin-top: 100px;
}
</style>
