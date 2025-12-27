import { 
  collection, 
  doc, 
  getDoc,
  getDocs,
  addDoc, 
  updateDoc,
  query, 
  where, 
  orderBy,
  limit,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore'
import { db } from './config'

/**
 * Blood Glucose Readings
 */
export const addReading = async (userId, readingData) => {
  try {
    const docRef = await addDoc(collection(db, 'readings'), {
      patientId: userId,
      glucoseLevel: readingData.glucoseLevel,
      context: readingData.context,
      notes: readingData.notes || '',
      timestamp: serverTimestamp(),
      flagged: false
    })
    
    return docRef.id
  } catch (error) {
    console.error('Error adding reading:', error)
    throw error
  }
}

export const getReadings = async (userId, limitCount = 10) => {
  try {
    const q = query(
      collection(db, 'readings'),
      where('patientId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    )
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate()
    }))
  } catch (error) {
    console.error('Error getting readings:', error)
    throw error
  }
}

export const subscribeToReadings = (userId, callback, limitCount = 10) => {
  const q = query(
    collection(db, 'readings'),
    where('patientId', '==', userId),
    orderBy('timestamp', 'desc'),
    limit(limitCount)
  )
  
  return onSnapshot(q, (snapshot) => {
    const readings = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate()
    }))
    callback(readings)
  })
}

/**
 * Chat Messages
 */
export const sendMessage = async (userId, messageText, doctorId) => {
  try {
    const docRef = await addDoc(collection(db, 'chat_messages'), {
      patientId: userId,
      doctorId: doctorId,
      senderId: userId,
      senderType: 'patient',
      messageText,
      timestamp: serverTimestamp(),
      read: false,
      aiSuggested: false
    })
    
    return docRef.id
  } catch (error) {
    console.error('Error sending message:', error)
    throw error
  }
}

export const getMessages = async (userId, doctorId) => {
  try {
    const q = query(
      collection(db, 'chat_messages'),
      where('patientId', '==', userId),
      where('doctorId', '==', doctorId),
      orderBy('timestamp', 'asc')
    )
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate()
    }))
  } catch (error) {
    console.error('Error getting messages:', error)
    throw error
  }
}

export const subscribeToMessages = (userId, doctorId, callback) => {
  const q = query(
    collection(db, 'chat_messages'),
    where('patientId', '==', userId),
    where('doctorId', '==', doctorId),
    orderBy('timestamp', 'asc')
  )
  
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate()
    }))
    callback(messages)
  })
}

/**
 * Patient Data
 */
export const getPatientData = async (userId) => {
  try {
    const docRef = doc(db, 'patients', userId)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return docSnap.data()
    } else {
      throw new Error('Patient not found')
    }
  } catch (error) {
    console.error('Error getting patient data:', error)
    throw error
  }
}

export const updatePatientData = async (userId, data) => {
  try {
    const docRef = doc(db, 'patients', userId)
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error('Error updating patient data:', error)
    throw error
  }
}
