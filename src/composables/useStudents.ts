import { useCollection, useDocument } from 'vuefire'
import { collection, doc, getCountFromServer, query, where } from 'firebase/firestore'
import { db } from '@/firebase' // your firebase init

const studentsRef = collection(db, 'students')

export function useStudents() {
  return useCollection(studentsRef)
}

export function useStudentById(id: string) {
  const docRef = doc(studentsRef, id)
  return useDocument(docRef)
}

export function useStudentsBySection(sectionId: string) {
  const q = query(studentsRef, where('sectionId', '==', sectionId))
  return useCollection(q)
}

export async function getStudentCount(sectionId?: string) {
  const q = sectionId
    ? query(studentsRef, where('sectionId', '==', sectionId))
    : studentsRef

  const snapshot = await getCountFromServer(q)
  return snapshot.data().count
}

