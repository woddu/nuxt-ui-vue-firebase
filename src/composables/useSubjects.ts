import { useCollection, useDocument } from 'vuefire'
import { collection, doc, getCountFromServer, query, where } from 'firebase/firestore'
import { db } from '@/firebase' // your firebase init

const subjectsRef = collection(db, 'subjects')

export function useSubjects() {
  return useCollection(subjectsRef)
}

export function useSubjectById(id: string) {
    const docRef = doc(subjectsRef, id)
    return useDocument(docRef)
}

export function useSubjectsByGrade(yearLevel: number) {
  const q = query(subjectsRef, where('yearLevel', '==', yearLevel))
  return useCollection(q)
}

export async function getSubjectCount(yearLevel?: number) {
  const q = yearLevel
    ? query(subjectsRef, where('yearLevel', '==', yearLevel))
    : subjectsRef
    const snapshot = await getCountFromServer(q)
    return snapshot.data().count
}