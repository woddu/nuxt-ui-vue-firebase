import { db } from '@/firebase'
import { collection, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore'
import type { Student } from '@/interfaces'

const studentsRef = collection(db, 'students')

export async function addStudent(student: Student) {
  const docRef = doc(studentsRef)
  await setDoc(docRef, { ...student, id: docRef.id })
  return docRef.id
}

export async function updateStudent(student: Student) {
  if (!student.id) {
    throw new Error('Student ID is required for update.')
  }
  const { id, ...data } = student
  const docRef = doc(studentsRef, id)
  await updateDoc(docRef, data) // safer update
}


export async function deleteStudent(id: string) {
  await deleteDoc(doc(studentsRef, id))
}