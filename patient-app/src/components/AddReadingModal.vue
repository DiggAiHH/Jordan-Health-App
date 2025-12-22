<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click.self="$emit('close')">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6" :dir="locale === 'ar' ? 'rtl' : 'ltr'">
      <h2 class="text-heading mb-6">{{ t('readings.addNew') }}</h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Glucose Level -->
        <div>
          <label for="glucoseLevel" class="block text-accessible font-medium text-gray-700 mb-2">
            {{ t('readings.glucoseLevel') }} *
          </label>
          <input
            id="glucoseLevel"
            v-model.number="form.glucoseLevel"
            type="number"
            class="input-field"
            :placeholder="t('readings.glucosePlaceholder')"
            required
            min="20"
            max="600"
          />
        </div>

        <!-- Context -->
        <div>
          <label class="block text-accessible font-medium text-gray-700 mb-2">
            {{ t('readings.context') }} *
          </label>
          <div class="grid grid-cols-2 gap-3">
            <button
              v-for="context in contexts"
              :key="context"
              type="button"
              @click="form.context = context"
              class="btn text-base"
              :class="form.context === context ? 'btn-primary' : 'btn-secondary'"
            >
              {{ t(`readings.${context}`) }}
            </button>
          </div>
        </div>

        <!-- Notes -->
        <div>
          <label for="notes" class="block text-accessible font-medium text-gray-700 mb-2">
            {{ t('readings.notes') }}
          </label>
          <textarea
            id="notes"
            v-model="form.notes"
            class="input-field"
            :placeholder="t('readings.notesPlaceholder')"
            rows="3"
          ></textarea>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="p-4 bg-red-50 border-2 border-red-600 rounded-lg">
          <p class="text-accessible text-red-600">{{ errorMessage }}</p>
        </div>

        <!-- Buttons -->
        <div class="flex gap-3">
          <button type="submit" class="btn btn-primary flex-1" :disabled="loading">
            {{ loading ? t('common.loading') : t('readings.save') }}
          </button>
          <button type="button" @click="$emit('close')" class="btn btn-secondary flex-1">
            {{ t('readings.cancel') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const emit = defineEmits(['close', 'save'])

const contexts = ['beforeMeal', 'afterMeal', 'fasting', 'bedtime']

const form = ref({
  glucoseLevel: null,
  context: 'beforeMeal',
  notes: ''
})

const loading = ref(false)
const errorMessage = ref('')

const handleSubmit = async () => {
  errorMessage.value = ''
  
  if (!form.value.glucoseLevel) {
    errorMessage.value = t('login.error.requiredFields')
    return
  }

  if (form.value.glucoseLevel < 20 || form.value.glucoseLevel > 600) {
    errorMessage.value = 'Glucose level must be between 20 and 600 mg/dL'
    return
  }

  loading.value = true

  try {
    // TODO: Save to Firestore
    await new Promise(resolve => setTimeout(resolve, 500))
    
    emit('save', {
      glucoseLevel: form.value.glucoseLevel,
      context: form.value.context,
      notes: form.value.notes
    })
  } catch (error) {
    errorMessage.value = error.message || t('common.error')
  } finally {
    loading.value = false
  }
}
</script>
