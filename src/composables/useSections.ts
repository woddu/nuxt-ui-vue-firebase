import { useCollection, useDocument } from 'vuefire'
import { collection, doc, getCountFromServer, query, where } from 'firebase/firestore'
import { db } from '@/firebase' // your firebase init

const sectionsRef = collection(db, 'sections')

export function useSections() {
  return useCollection(sectionsRef)
}

export function useSectionById(id: string) {
  const docRef = doc(sectionsRef, id)
  return useDocument(docRef)
}

export async function getSectionCount(sectionId?: string) {
  const q = sectionId
    ? query(sectionsRef, where('id', '==', sectionId))
    : sectionsRef

  const snapshot = await getCountFromServer(q)
  return snapshot.data().count
}

