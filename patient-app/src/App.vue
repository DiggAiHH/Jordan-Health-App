<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from './composables/useAuth'
import LoginForm from './components/LoginForm.vue'
import Dashboard from './components/Dashboard.vue'
import Chat from './components/Chat.vue'

const { isAuthenticated, initAuth, loading } = useAuth()
const currentView = ref('dashboard') // 'dashboard' or 'chat'

onMounted(() => {
  // Initialize authentication listener
  initAuth()
})

const handleLogin = () => {
  currentView.value = 'dashboard'
}

const handleLogout = () => {
  currentView.value = 'dashboard'
}

const showChat = () => {
  currentView.value = 'chat'
}

const showDashboard = () => {
  currentView.value = 'dashboard'
}
</script>

<template>
  <!-- Loading State -->
  <div v-if="loading" class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <div class="text-2xl mb-4">⏳</div>
      <p class="text-lg text-gray-600">جاري التحميل... / Loading...</p>
    </div>
  </div>

  <!-- Login -->
  <LoginForm v-else-if="!isAuthenticated" @login="handleLogin" />
  
  <!-- Authenticated Views -->
  <template v-else>
    <Dashboard v-if="currentView === 'dashboard'" @navigate-to-chat="showChat" @logout="handleLogout" />
    <Chat v-else-if="currentView === 'chat'" @back="showDashboard" />
  </template>
</template>


