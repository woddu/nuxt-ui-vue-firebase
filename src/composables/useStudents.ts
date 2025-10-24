import { useCollection, useDocument } from 'vuefire'
import { doc, endAt, getCountFromServer, orderBy, query, startAt, where } from 'firebase/firestore'
import { Student } from '@/interfaces'
import { studentsRef } from '@/services/studentService'

export function useStudents() {
  const q = query(
    studentsRef, 
    orderBy('lastName', 'asc')
  )
  return useCollection<Student>(q)
}

export function useStudentById(id: string) {
  const docRef = doc(studentsRef, id)
  return useDocument<Student>(docRef)
}

export function useStudentsBySection(sectionId: string) {
  const q = query(studentsRef, where('sectionId', '==', sectionId))
  return useCollection<Student>(q)
}

export function useStudentsByLastName(name: string) {
  const q = query(
    studentsRef,
    orderBy("lastName"),
    startAt(name),
    endAt(name + "\uf8ff")
  );

  return useCollection<Student>(q);
}


export async function getStudentCount(sectionId?: string) {
  const q = sectionId
    ? query(studentsRef, where('sectionId', '==', sectionId))
    : studentsRef

  const snapshot = await getCountFromServer(q)
  return snapshot.data().count
}

