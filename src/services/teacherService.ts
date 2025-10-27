import { db } from '@/firebase'
import { collection, doc, setDoc, deleteDoc, updateDoc, getDocs, query, where } from 'firebase/firestore'
import type { Teacher } from '@/interfaces'

export const teachersRef = collection(db, "users");

export async function getTeacherByEmail(email: string) {
  const q = query(teachersRef, where("email", "==", email));
  return await getDocs(q);
}

export async function addTeacher(teacher: Teacher) {
  const docRef = doc(teachersRef)
  await setDoc(docRef, { ...teacher, id: docRef.id })
  return docRef.id
}

export async function updateTeacher(teacher: Teacher) {
    if (!teacher.id) {
        throw new Error('Teacher ID is required for update.')
    }
    const { id, ...data } = teacher
    const docRef = doc(teachersRef, id)
    await updateDoc(docRef, data) // safer update
}

export async function updateTeacherVerification(id: string, verified: boolean) {
    const docRef = doc(teachersRef, id)
    await updateDoc(docRef, { verified: verified }) // safer update
}

export async function deleteTeacher(id: string) {
  await deleteDoc(doc(teachersRef, id))
}
