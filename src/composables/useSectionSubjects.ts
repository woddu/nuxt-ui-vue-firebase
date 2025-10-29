import { db } from "@/firebase";
import { SectionSubjectRead } from "@/interfaces";
import { collectionGroup, query, where } from "firebase/firestore";
import { useCollection } from "vuefire";

export function useSectionsSubjectsByTeacher(teacherId: string){  
  const q = query(
    collectionGroup(db, 'sectionSubjects'),
    where('subjectTeacherId', '==', teacherId)
  )
  return useCollection<SectionSubjectRead>(q)
}
