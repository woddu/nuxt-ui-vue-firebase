import { useCollection, useDocument } from 'vuefire'
import { doc, getCountFromServer, query, where } from 'firebase/firestore'
import { Subject } from '@/interfaces'
import { subjectsRef } from '@/services/subjectService'

export function useSubjects() {
  return useCollection<Subject>(subjectsRef)
}

export function useSubjectById(id: string) {
    const docRef = doc(subjectsRef, id)
    return useDocument<Subject>(docRef)
}

export function useSubjectsByTeacher(teacherId: string) {
  const q = query(
    subjectsRef,
    where("teacherIds", "array-contains", teacherId)
  );

  return useCollection<Subject>(q);

}

export async function getSubjectCount(yearLevel?: number) {
  const q = yearLevel
    ? query(subjectsRef, where('yearLevel', '==', yearLevel))
    : subjectsRef
    const snapshot = await getCountFromServer(q)
    return snapshot.data().count
}