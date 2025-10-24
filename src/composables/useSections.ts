import { useCollection, useDocument } from 'vuefire'
import { doc, getCountFromServer, query, where } from 'firebase/firestore'
import { Section } from '@/interfaces'
import { sectionsRef } from '@/services/sectionService'

export function useSections() {
  return useCollection<Section>(sectionsRef)
}

export function useSectionById(id: string) {
  const docRef = doc(sectionsRef, id)
  return useDocument<Section>(docRef)
}

export async function getSectionCount(sectionId?: string) {
  const q = sectionId
    ? query(sectionsRef, where('id', '==', sectionId))
    : sectionsRef

  const snapshot = await getCountFromServer(q)
  return snapshot.data().count
}

