<template>
  <div class="min-h-screen bg-gray-50" :dir="locale === 'ar' ? 'rtl' : 'ltr'">
    <!-- Header -->
    <header class="bg-blue-900 text-white shadow-lg">
      <div class="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold">{{ t('app.title') }}</h1>
          <p class="text-sm">{{ t('dashboard.welcome', { name: patientName }) }}</p>
        </div>
        <div class="flex gap-4 items-center">
          <button
            @click="toggleLanguage"
            class="text-sm underline hover:text-gray-200"
          >
            {{ locale === 'ar' ? 'English' : 'العربية' }}
          </button>
          <button
            @click="handleLogout"
            class="btn btn-secondary text-sm"
          >
            {{ t('common.logout') }}
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-6xl mx-auto px-4 py-8">
      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button
          @click="showAddReading = true"
          class="btn btn-primary p-6 flex flex-col items-center gap-2"
        >
          <span class="text-3xl">📊</span>
          <span>{{ t('dashboard.addReading') }}</span>
        </button>
        <button
          @click="navigateToChat"
          class="btn btn-secondary p-6 flex flex-col items-center gap-2"
        >
          <span class="text-3xl">💬</span>
          <span>{{ t('dashboard.chat') }}</span>
        </button>
        <button
          @click="navigateToNutrition"
          class="btn btn-secondary p-6 flex flex-col items-center gap-2"
        >
          <span class="text-3xl">🍽️</span>
          <span>{{ t('dashboard.nutrition') }}</span>
        </button>
      </div>

      <!-- Latest Readings -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-heading mb-6">{{ t('dashboard.latestReadings') }}</h2>
        
        <div v-if="readings.length === 0" class="text-center py-8 text-gray-500">
          <p class="text-accessible">{{ t('dashboard.noReadings') }}</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="reading in readings"
            :key="reading.id"
            class="border-2 rounded-lg p-4 flex justify-between items-center"
            :class="getGlucoseClass(reading.glucoseLevel)"
          >
            <div>
              <p class="text-2xl font-bold">{{ reading.glucoseLevel }} mg/dL</p>
              <p class="text-accessible">{{ t(`readings.${reading.context}`) }}</p>
              <p class="text-sm text-gray-600">{{ formatDate(reading.timestamp) }}</p>
            </div>
            <div class="text-right">
              <span class="px-4 py-2 rounded-lg font-semibold" :class="getGlucoseLevelClass(reading.glucoseLevel)">
                {{ getGlucoseLevel(reading.glucoseLevel) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Add Reading Modal -->
    <AddReadingModal
      v-if="showAddReading"
      @close="showAddReading = false"
      @save="handleSaveReading"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AddReadingModal from './AddReadingModal.vue'

const { t, locale } = useI18n()

const patientName = ref('أحمد') // This will come from authentication
const showAddReading = ref(false)

// Sample readings data (will come from Firestore)
const readings = ref([
  {
    id: 1,
    glucoseLevel: 145,
    context: 'afterMeal',
    timestamp: new Date('2025-12-22T12:30:00'),
    notes: ''
  },
  {
    id: 2,
    glucoseLevel: 95,
    context: 'fasting',
    timestamp: new Date('2025-12-22T08:00:00'),
    notes: ''
  }
])

const toggleLanguage = () => {
  locale.value = locale.value === 'ar' ? 'en' : 'ar'
}

const handleLogout = () => {
  // TODO: Implement logout logic
  console.log('Logout clicked')
}

const navigateToChat = () => {
  // TODO: Implement navigation
  console.log('Navigate to chat')
}

const navigateToNutrition = () => {
  // TODO: Implement navigation
  console.log('Navigate to nutrition')
}

const handleSaveReading = (reading) => {
  // TODO: Save to Firestore
  readings.value.unshift({
    id: Date.now(),
    ...reading,
    timestamp: new Date()
  })
  showAddReading.value = false
}

const getGlucoseClass = (level) => {
  if (level < 70) return 'border-red-600'
  if (level >= 70 && level <= 180) return 'border-green-600'
  if (level > 180 && level <= 250) return 'border-orange-500'
  return 'border-red-600'
}

const getGlucoseLevelClass = (level) => {
  if (level < 70) return 'glucose-low'
  if (level >= 70 && level <= 180) return 'glucose-normal'
  if (level > 180 && level <= 250) return 'glucose-elevated'
  return 'glucose-high'
}

const getGlucoseLevel = (level) => {
  if (level < 70) return t('readings.levels.low')
  if (level >= 70 && level <= 180) return t('readings.levels.normal')
  if (level > 180 && level <= 250) return t('readings.levels.elevated')
  return t('readings.levels.high')
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat(locale.value === 'ar' ? 'ar-SA' : 'en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date)
}
</script>
