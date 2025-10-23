import { useCollection, useDocument } from 'vuefire'
import { collection, doc, endAt, getCountFromServer, orderBy, query, startAt, where } from 'firebase/firestore'
import { db } from '@/firebase' 

const teachersRef = collection(db, 'users')


export function useTeachers() {
  const q = query(
    teachersRef,
    orderBy('verified', 'asc'),
    // where('username', '!=', 'admin')
  )
  return useCollection(q)
}

export function useTeacherById(id: string) {
    const docRef = doc(teachersRef, id) 
    return useDocument(docRef)
}

export function useTeachersByVerified(verified: boolean) {
  const q = query(teachersRef, where('verified', '==', verified))
  return useCollection(q)
}

export function useTeachersByLastName(name: string) {
  const q = query(
    teachersRef,
    orderBy("lastName"),
    startAt(name),
    endAt(name + "\uf8ff")
  );  
  return useCollection(q);
}

export async function getTeachersCountByVerified(verified: boolean) {
    const q = query(teachersRef, where('verified', '==', verified))
    const snapshot = await getCountFromServer(q)
    return snapshot.data().count
}

export async function getTeachersCount() {
    const q = query(teachersRef, where('role', '!=', 'admin'))
    const snapshot = await getCountFromServer(q)
    return snapshot.data().count
}