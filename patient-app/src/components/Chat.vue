<template>
  <div class="min-h-screen bg-gray-50" :dir="locale === 'ar' ? 'rtl' : 'ltr'">
    <!-- Header -->
    <header class="bg-blue-900 text-white shadow-lg">
      <div class="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
        <div class="flex items-center gap-4">
          <button 
            @click="$emit('back')" 
            class="text-2xl hover:text-gray-200 p-2"
            :aria-label="t('common.back')"
          >
            {{ locale === 'ar' ? '←' : '→' }}
          </button>
          <h1 class="text-2xl font-bold">{{ t('chat.title') }}</h1>
        </div>
        <button
          @click="toggleLanguage"
          class="text-sm underline hover:text-gray-200 p-2"
        >
          {{ locale === 'ar' ? 'English' : 'العربية' }}
        </button>
      </div>
    </header>

    <!-- Chat Container -->
    <main class="max-w-4xl mx-auto px-4 py-6 h-[calc(100vh-180px)] flex flex-col">
      <!-- Messages Area -->
      <div 
        ref="messagesContainer" 
        class="flex-1 bg-white rounded-lg shadow-lg p-6 overflow-y-auto mb-4 space-y-4"
        role="log"
        :aria-label="t('chat.messagesArea')"
      >
        <!-- No Messages -->
        <div v-if="messages.length === 0" class="flex items-center justify-center h-full text-gray-500">
          <p class="text-accessible text-xl">{{ t('chat.noMessages') }}</p>
        </div>

        <!-- Messages -->
        <div
          v-for="message in messages"
          :key="message.id"
          class="flex"
          :class="message.senderId === user?.uid ? 'justify-start' : 'justify-end'"
        >
          <div
            class="max-w-[80%] rounded-2xl p-4"
            :class="message.senderId === user?.uid ? 'bg-gray-100' : 'bg-blue-900 text-white'"
          >
            <!-- Sender -->
            <p class="text-base font-semibold mb-2">
              {{ message.senderId === user?.uid ? t('chat.you') : t('chat.doctor') }}
            </p>
            
            <!-- Image Attachment -->
            <div v-if="message.attachment?.type === 'image'" class="mb-3">
              <img 
                :src="message.attachment.url" 
                :alt="t('chat.imageAttachment')"
                class="max-w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                style="max-height: 300px; object-fit: contain;"
                @click="openImageFullscreen(message.attachment.url)"
                loading="lazy"
              />
            </div>
            
            <!-- Message Text -->
            <p v-if="message.messageText" class="text-lg leading-relaxed">
              {{ message.messageText }}
            </p>
            
            <!-- Timestamp -->
            <p class="text-sm mt-2 opacity-75">
              {{ formatDate(message.timestamp) }}
            </p>

            <!-- AI Suggested Badge -->
            <div v-if="message.aiSuggested" class="mt-2">
              <span class="text-xs px-2 py-1 bg-green-500 rounded-full">
                🤖 AI
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Image Preview (before sending) -->
      <div 
        v-if="imagePreview" 
        class="bg-white rounded-lg shadow-lg p-4 mb-4 relative"
      >
        <div class="flex items-start gap-4">
          <img 
            :src="imagePreview" 
            alt="Preview" 
            class="w-32 h-32 object-cover rounded-lg"
          />
          <div class="flex-1">
            <p class="text-lg font-medium text-gray-700">
              {{ t('chat.imageReady') }}
            </p>
            <!-- Upload Progress -->
            <div v-if="uploadProgress > 0 && uploadProgress < 100" class="mt-3">
              <div class="w-full bg-gray-200 rounded-full h-4">
                <div 
                  class="bg-green-500 h-4 rounded-full transition-all duration-300"
                  :style="{ width: uploadProgress + '%' }"
                ></div>
              </div>
              <p class="text-sm text-gray-600 mt-1">{{ uploadProgress }}%</p>
            </div>
          </div>
          <!-- Remove Button -->
          <button
            @click="clearImagePreview"
            class="p-3 bg-red-100 hover:bg-red-200 rounded-full text-red-600 transition-colors"
            :aria-label="t('chat.removeImage')"
            :disabled="uploading"
          >
            <span class="text-2xl">✕</span>
          </button>
        </div>
      </div>

      <!-- Input Area -->
      <div class="bg-white rounded-lg shadow-lg p-4">
        <!-- Photo Button - Large & Prominent for Elderly -->
        <div class="mb-4">
          <button
            @click="triggerFileInput"
            class="w-full py-5 px-6 bg-green-600 hover:bg-green-700 text-white text-xl font-bold rounded-xl flex items-center justify-center gap-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="uploading"
            :aria-label="t('chat.addPhoto')"
          >
            <span class="text-3xl">📷</span>
            <span>{{ t('chat.addPhoto') }}</span>
          </button>
          <input
            ref="fileInput"
            type="file"
            accept="image/jpeg,image/png,image/heic,image/heif"
            class="hidden"
            @change="handleFileSelect"
            :disabled="uploading"
          />
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="mb-4 p-4 bg-red-100 border border-red-300 rounded-lg">
          <p class="text-red-700 text-lg">{{ errorMessage }}</p>
        </div>

        <!-- Message Input Form -->
        <form @submit.prevent="handleSendMessage" class="flex gap-3">
          <textarea
            v-model="newMessage"
            :placeholder="t('chat.typePlaceholder')"
            class="flex-1 px-4 py-4 text-xl border-2 border-gray-300 rounded-xl focus:border-blue-900 focus:ring-2 focus:ring-blue-900 resize-none"
            rows="2"
            @keydown.enter.exact.prevent="handleSendMessage"
            :disabled="uploading"
          ></textarea>
          <button
            type="submit"
            class="btn btn-primary px-8 py-4 text-xl font-bold min-w-[120px]"
            :disabled="(!newMessage.trim() && !selectedFile) || sending || uploading"
          >
            {{ sending || uploading ? t('common.loading') : t('chat.send') }}
          </button>
        </form>
        <p class="text-base text-gray-500 mt-3">
          {{ locale === 'ar' ? 'اضغط Enter للإرسال' : 'Press Enter to send' }}
        </p>
      </div>
    </main>

    <!-- Fullscreen Image Modal -->
    <div 
      v-if="fullscreenImage" 
      class="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
      @click="closeFullscreen"
    >
      <button
        class="absolute top-6 right-6 text-white text-4xl hover:text-gray-300 p-4"
        @click="closeFullscreen"
        :aria-label="t('common.close')"
      >
        ✕
      </button>
      <img 
        :src="fullscreenImage" 
        alt="Fullscreen" 
        class="max-w-full max-h-full object-contain"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuth } from '../composables/useAuth'
import { sendMessage, subscribeToMessages } from '../firebase/database'
import { 
  uploadChatImage, 
  validateImageFile, 
  createImagePreview, 
  revokeImagePreview 
} from '../firebase/storage'

const { t, locale } = useI18n()
const { user, patientData } = useAuth()

const emit = defineEmits(['back'])

// Refs
const messagesContainer = ref(null)
const fileInput = ref(null)
const newMessage = ref('')
const sending = ref(false)
const messages = ref([])
const loadingMessages = ref(true)

// Image upload state
const selectedFile = ref(null)
const imagePreview = ref(null)
const uploadProgress = ref(0)
const uploading = ref(false)
const errorMessage = ref('')

// Fullscreen image view
const fullscreenImage = ref(null)

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
  // Clean up preview URL
  if (imagePreview.value) {
    revokeImagePreview(imagePreview.value)
  }
})

const toggleLanguage = () => {
  locale.value = locale.value === 'ar' ? 'en' : 'ar'
}

/**
 * Triggers the hidden file input
 */
const triggerFileInput = () => {
  fileInput.value?.click()
}

/**
 * Handles file selection with validation
 */
const handleFileSelect = (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  errorMessage.value = ''

  // Validate file (1-A: jpg/png/heic, <=5MB)
  const validation = validateImageFile(file)
  if (!validation.valid) {
    if (validation.error === 'INVALID_TYPE') {
      errorMessage.value = t('chat.errorInvalidType')
    } else if (validation.error === 'FILE_TOO_LARGE') {
      errorMessage.value = t('chat.errorFileTooLarge')
    } else {
      errorMessage.value = t('common.error')
    }
    // Reset file input
    event.target.value = ''
    return
  }

  // Clear previous preview
  if (imagePreview.value) {
    revokeImagePreview(imagePreview.value)
  }

  // Set new file and preview
  selectedFile.value = file
  imagePreview.value = createImagePreview(file)
  uploadProgress.value = 0
}

/**
 * Clears the selected image
 */
const clearImagePreview = () => {
  if (imagePreview.value) {
    revokeImagePreview(imagePreview.value)
  }
  selectedFile.value = null
  imagePreview.value = null
  uploadProgress.value = 0
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

/**
 * Opens image in fullscreen modal
 */
const openImageFullscreen = (url) => {
  fullscreenImage.value = url
}

/**
 * Closes fullscreen modal
 */
const closeFullscreen = () => {
  fullscreenImage.value = null
}

/**
 * Sends message with optional image attachment
 */
const handleSendMessage = async () => {
  const hasText = newMessage.value.trim()
  const hasImage = selectedFile.value

  // Need either text or image
  if (!hasText && !hasImage) return
  if (sending.value || uploading.value) return

  errorMessage.value = ''
  let attachment = null

  try {
    // Upload image first if present
    if (hasImage) {
      uploading.value = true
      uploadProgress.value = 0

      const chatId = `${user.value.uid}_${doctorId.value}`
      
      attachment = await uploadChatImage(
        selectedFile.value,
        user.value.uid,
        chatId,
        (progress) => {
          uploadProgress.value = progress
        }
      )
      
      uploading.value = false
    }

    // Send message to Firestore
    sending.value = true
    await sendMessage(
      user.value.uid, 
      newMessage.value, 
      doctorId.value,
      attachment
    )

    // Clear inputs on success
    newMessage.value = ''
    clearImagePreview()
    
  } catch (error) {
    console.error('Error sending message:', error)
    
    if (error.message === 'UPLOAD_FAILED') {
      errorMessage.value = t('chat.errorUploadFailed')
    } else {
      errorMessage.value = t('common.error')
    }
  } finally {
    sending.value = false
    uploading.value = false
  }
}

const formatDate = (date) => {
  if (!date) return ''
  return new Intl.DateTimeFormat(locale.value === 'ar' ? 'ar-SA' : 'en-US', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(date)
}
</script>
