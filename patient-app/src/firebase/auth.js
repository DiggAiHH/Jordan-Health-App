import { 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './config'

/**
 * Custom authentication for PatientID + Password
 * Converts PatientID to email format for Firebase Auth
 */
export const loginWithPatientId = async (patientId, password) => {
  try {
    // Convert PatientID to email format (e.g., JO-2025-0001 -> jo-2025-0001@patient.jobetes.app)
    const email = `${patientId.toLowerCase()}@patient.jobetes.app`
    
    // Sign in with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    
    // Get patient data from Firestore
    const patientDoc = await getDoc(doc(db, 'patients', userCredential.user.uid))
    
    if (!patientDoc.exists()) {
      throw new Error('Patient data not found')
    }
    
    return {
      user: userCredential.user,
      patientData: patientDoc.data()
    }
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

/**
 * Register new patient (for admin use)
 */
export const registerPatient = async (patientId, password, patientData) => {
  try {
    const email = `${patientId.toLowerCase()}@patient.jobetes.app`
    
    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    
    // Store patient data in Firestore
    await setDoc(doc(db, 'patients', userCredential.user.uid), {
      patientId,
      ...patientData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      active: true
    })
    
    return userCredential.user
  } catch (error) {
    console.error('Registration error:', error)
    throw error
  }
}

/**
 * Logout current user
 */
export const logout = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    console.error('Logout error:', error)
    throw error
  }
}

/**
 * Listen to authentication state changes
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback)
}

/**
 * Get current authenticated user
 */
export const getCurrentUser = () => {
  return auth.currentUser
}
