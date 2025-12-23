<template>
  <div class="min-h-screen bg-gray-50" :dir="locale === 'ar' ? 'rtl' : 'ltr'">
    <!-- Header -->
    <header class="bg-blue-900 text-white shadow-lg">
      <div class="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
        <div class="flex items-center gap-4">
          <button @click="$emit('back')" class="text-2xl hover:text-gray-200">
            {{ locale === 'ar' ? '←' : '→' }}
          </button>
          <h1 class="text-2xl font-bold">{{ t('chat.title') }}</h1>
        </div>
        <button
          @click="toggleLanguage"
          class="text-sm underline hover:text-gray-200"
        >
          {{ locale === 'ar' ? 'English' : 'العربية' }}
        </button>
      </div>
    </header>

    <!-- Chat Container -->
    <main class="max-w-4xl mx-auto px-4 py-6 h-[calc(100vh-180px)] flex flex-col">
      <!-- Messages Area -->
      <div ref="messagesContainer" class="flex-1 bg-white rounded-lg shadow-lg p-6 overflow-y-auto mb-4 space-y-4">
        <!-- No Messages -->
        <div v-if="messages.length === 0" class="flex items-center justify-center h-full text-gray-500">
          <p class="text-accessible">{{ t('chat.noMessages') }}</p>
        </div>

        <!-- Messages -->
        <div
          v-for="message in messages"
          :key="message.id"
          class="flex"
          :class="message.senderId === 'patient' ? 'justify-start' : 'justify-end'"
        >
          <div
            class="max-w-[70%] rounded-lg p-4"
            :class="message.senderId === 'patient' ? 'bg-gray-100' : 'bg-blue-900 text-white'"
          >
            <!-- Sender -->
            <p class="text-sm font-semibold mb-1">
              {{ message.senderId === 'patient' ? t('chat.you') : t('chat.doctor') }}
            </p>
            
            <!-- Message Text -->
            <p class="text-accessible">{{ message.messageText }}</p>
            
            <!-- Timestamp -->
            <p class="text-sm mt-2 opacity-75">
              {{ formatDate(message.timestamp) }}
            </p>

            <!-- AI Suggested Badge -->
            <div v-if="message.aiSuggested" class="mt-2">
              <span class="text-xs px-2 py-1 bg-green-500 rounded-full">
                🤖 AI-Suggested
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="bg-white rounded-lg shadow-lg p-4">
        <form @submit.prevent="handleSendMessage" class="flex gap-3">
          <textarea
            v-model="newMessage"
            :placeholder="t('chat.typePlaceholder')"
            class="flex-1 px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-900 focus:ring-2 focus:ring-blue-900 resize-none"
            rows="2"
            @keydown.enter.exact.prevent="handleSendMessage"
          ></textarea>
          <button
            type="submit"
            class="btn btn-primary px-8"
            :disabled="!newMessage.trim() || sending"
          >
            {{ sending ? t('common.loading') : t('chat.send') }}
          </button>
        </form>
        <p class="text-sm text-gray-500 mt-2">
          {{ locale === 'ar' ? 'اضغط Enter للإرسال' : 'Press Enter to send' }}
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuth } from '../composables/useAuth'
import { sendMessage, subscribeToMessages } from '../firebase/database'

const { t, locale } = useI18n()
const { user, patientData } = useAuth()

const emit = defineEmits(['back'])

const messagesContainer = ref(null)
const newMessage = ref('')
const sending = ref(false)
const messages = ref([])
const loadingMessages = ref(true)
let unsubscribe = null

// Doctor ID - in production this would come from patient data
const doctorId = ref('doctor-001')

onMounted(() => {
  if (user.value && patientData.value) {
    // Use doctor from patient data if available
    if (patientData.value.doctorId) {
      doctorId.value = patientData.value.doctorId
    }
    
    // Subscribe to real-time messages from Firestore
    unsubscribe = subscribeToMessages(user.value.uid, doctorId.value, (newMessages) => {
      messages.value = newMessages
      loadingMessages.value = false
      
      // Scroll to bottom after messages update
      nextTick(() => {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
        }
      })
    })
  }
})

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe()
  }
})

const toggleLanguage = () => {
  locale.value = locale.value === 'ar' ? 'en' : 'ar'
}

const handleSendMessage = async () => {
  if (!newMessage.value.trim() || sending.value) return

  sending.value = true

  try {
    // Send to Firestore
    await sendMessage(user.value.uid, newMessage.value, doctorId.value)
    newMessage.value = ''
    
    // Messages will be updated automatically through the subscription
  } catch (error) {
    console.error('Error sending message:', error)
    alert(t('common.error'))
  } finally {
    sending.value = false
  }
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat(locale.value === 'ar' ? 'ar-SA' : 'en-US', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(date)
}
</script>
