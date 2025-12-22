<script setup>
import { ref } from 'vue'
import LoginForm from './components/LoginForm.vue'
import Dashboard from './components/Dashboard.vue'

const isAuthenticated = ref(false) // Will be managed by proper auth later

const handleLogin = () => {
  isAuthenticated.value = true
}
</script>

<template>
  <LoginForm v-if="!isAuthenticated" @login="handleLogin" />
  <Dashboard v-else />
</template>


