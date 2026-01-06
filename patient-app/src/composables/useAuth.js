import { ref, computed } from 'vue'
import { onAuthChange } from '../firebase/auth'
import { getPatientData } from '../firebase/database'
import { logger } from '../utils/logger'

const user = ref(null)
const patientData = ref(null)
const loading = ref(true)
const error = ref(null)

export function useAuth() {
  const isAuthenticated = computed(() => !!user.value)
  
  const initAuth = () => {
    loading.value = true
    
    onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        user.value = firebaseUser
        try {
          // Load patient data
          const data = await getPatientData(firebaseUser.uid)
          patientData.value = data
          logger.info('Patient data loaded successfully', { uid: firebaseUser.uid })
        } catch (err) {
          // GDPR Art. 9: Do NOT log error details that may contain PII
          logger.error('Error loading patient data', { errorCode: err.code, uid: firebaseUser.uid })
          error.value = err.message
        }
      } else {
        user.value = null
        patientData.value = null
        logger.debug('User logged out')
      }
      loading.value = false
    })
  }
  
  const setUser = (firebaseUser, data) => {
    user.value = firebaseUser
    patientData.value = data
  }
  
  const clearUser = () => {
    user.value = null
    patientData.value = null
  }
  
  return {
    user,
    patientData,
    loading,
    error,
    isAuthenticated,
    initAuth,
    setUser,
    clearUser
  }
}
