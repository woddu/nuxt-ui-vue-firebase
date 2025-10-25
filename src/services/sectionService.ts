import { db } from '@/firebase'
import { collection, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore'
import type { Section } from '@/interfaces'

export const sectionsRef = collection(db, "sections");

export async function addSection(section: Section) {
  const docRef = doc(sectionsRef)
  await setDoc(docRef, { ...section, id: docRef.id })
  return docRef.id
}

export async function updateSection(section: Section) {
  if (!section.id) {
    throw new Error('Section ID is required for update.')
  }
  const { id, ...data } = section
  const docRef = doc(sectionsRef, id)
  await updateDoc(docRef, data) // safer update
}

export async function setAdvisoryTeacher(advisoryId: string, teacherId: string) {
  const docRef = doc(sectionsRef, advisoryId)
  await updateDoc(docRef, { adviserId: teacherId })
}

export async function removeAdvisoryTeacher(advisoryId: string) {
  const docRef = doc(sectionsRef, advisoryId)
  await updateDoc(docRef, { adviserId: null })
}

export async function deleteSection(id: string) {
  await deleteDoc(doc(sectionsRef, id))
}
