<script setup>
import { ref } from 'vue'
import LoginForm from './components/LoginForm.vue'
import Dashboard from './components/Dashboard.vue'
import Chat from './components/Chat.vue'

const isAuthenticated = ref(false) // Will be managed by proper auth later
const currentView = ref('dashboard') // 'dashboard' or 'chat'

const handleLogin = () => {
  isAuthenticated.value = true
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
  <LoginForm v-if="!isAuthenticated" @login="handleLogin" />
  <Dashboard v-else-if="currentView === 'dashboard'" @navigate-to-chat="showChat" />
  <Chat v-else-if="currentView === 'chat'" @back="showDashboard" />
</template>


