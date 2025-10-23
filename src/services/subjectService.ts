import { db } from '@/firebase'
import { collection, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore'
import type { Subject } from '@/interfaces'

export const subjectsRef = collection(db, "subjects");

export async function addSubject(subject: Subject) {
  const docRef = doc(subjectsRef)
  await setDoc(docRef, { ...subject, id: docRef.id })
  return docRef.id
}
export async function updateSubject(subject: Subject) {
    if (!subject.id) {
        throw new Error('Subject ID is required for update.')
    }
    const { id, ...data } = subject
    const docRef = doc(subjectsRef, id)
    await updateDoc(docRef, data) // safer update
}

export async function deleteSubject(id: string) {
  await deleteDoc(doc(subjectsRef, id))
}