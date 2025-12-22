<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50" :dir="locale === 'ar' ? 'rtl' : 'ltr'">
    <div class="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
      <!-- Logo/Title -->
      <div class="text-center mb-8">
        <h1 class="text-heading text-blue-900 mb-2">{{ t('app.title') }}</h1>
        <p class="text-accessible text-gray-600">{{ t('app.subtitle') }}</p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="patientId" class="block text-accessible font-medium text-gray-700 mb-2">
            {{ t('login.patientId') }}
          </label>
          <input
            id="patientId"
            v-model="patientId"
            type="text"
            class="input-field"
            :placeholder="t('login.patientIdPlaceholder')"
            required
          />
        </div>

        <div>
          <label for="password" class="block text-accessible font-medium text-gray-700 mb-2">
            {{ t('login.password') }}
          </label>
          <div class="relative">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="input-field"
              :placeholder="t('login.passwordPlaceholder')"
              required
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute top-1/2 -translate-y-1/2 px-3 text-gray-600"
              :class="locale === 'ar' ? 'left-2' : 'right-2'"
            >
              {{ showPassword ? '🙈' : '👁️' }}
            </button>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="p-4 bg-red-50 border-2 border-red-600 rounded-lg">
          <p class="text-accessible text-red-600">{{ errorMessage }}</p>
        </div>

        <!-- Login Button -->
        <button type="submit" class="btn btn-primary w-full" :disabled="loading">
          {{ loading ? t('common.loading') : t('login.submit') }}
        </button>

        <!-- Forgot Password Link -->
        <div class="text-center">
          <a href="#" class="text-accessible text-blue-900 hover:text-blue-700 underline">
            {{ t('login.forgotPassword') }}
          </a>
        </div>
      </form>

      <!-- Language Toggle -->
      <div class="mt-6 flex justify-center">
        <button
          @click="toggleLanguage"
          class="text-accessible text-gray-600 hover:text-gray-800 underline"
        >
          {{ locale === 'ar' ? 'English' : 'العربية' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const patientId = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')

const toggleLanguage = () => {
  locale.value = locale.value === 'ar' ? 'en' : 'ar'
}

const handleLogin = async () => {
  errorMessage.value = ''
  
  if (!patientId.value || !password.value) {
    errorMessage.value = t('login.error.requiredFields')
    return
  }

  loading.value = true

  try {
    // TODO: Implement Firebase authentication
    // For now, just simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Temporary validation (will be replaced with Firebase Auth)
    console.log('Login attempt:', { patientId: patientId.value })
    
    // This will be replaced with actual authentication logic
    errorMessage.value = t('login.error.invalidCredentials')
  } catch (error) {
    errorMessage.value = error.message || t('common.error')
  } finally {
    loading.value = false
  }
}
</script>
