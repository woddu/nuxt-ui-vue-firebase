import { useCollection, useDocument } from 'vuefire'
import { collection, doc, endAt, getCountFromServer, orderBy, query, startAt, where } from 'firebase/firestore'
import { db } from '@/firebase' // your firebase init

const studentsRef = collection(db, 'students')

export function useStudents() {
  const q = query(
    studentsRef, 
    orderBy('lastName', 'asc')
  )
  return useCollection(q)
}

export function useStudentById(id: string) {
  const docRef = doc(studentsRef, id)
  return useDocument(docRef)
}

export function useStudentsBySection(sectionId: string) {
  const q = query(studentsRef, where('sectionId', '==', sectionId))
  return useCollection(q)
}

export function useStudentsByLastName(name: string) {
  const q = query(
    studentsRef,
    orderBy("lastName"),
    startAt(name),
    endAt(name + "\uf8ff")
  );

  return useCollection(q);
}


export async function getStudentCount(sectionId?: string) {
  const q = sectionId
    ? query(studentsRef, where('sectionId', '==', sectionId))
    : studentsRef

  const snapshot = await getCountFromServer(q)
  return snapshot.data().count
}

