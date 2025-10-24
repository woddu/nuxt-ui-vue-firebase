import { TeacherSubject } from "@/interfaces";
import { query, collection, doc } from "firebase/firestore";
import { useCollection } from "vuefire";
import { teachersRef } from "@/services/teacherService";

export async function useTeacherSubjects(teacherId: string) {
  const teacherRef = doc(teachersRef, teacherId);

  const teacherSubjects = collection(teacherRef, "subjects");
  
  return useCollection<TeacherSubject>(
    query(teacherSubjects)
  );
}

// export function useSubjectTeachersByTeacher(teacherId: string) {
//   const { data: teacherAssignments, pending, error } = useCollection(
//     query(
//       collectionGroup(db, "teachers"),
//       where("subjectTeacherId", "==", teacherId)
//     )
//   );

//   const subjects = ref<Subject[]>([]);

//   // reactively fetch subjects when assignments change
//   watchEffect(async () => {
//     if (!teacherAssignments.value) {
//       subjects.value = [];
//       return;
//     }

//     const results: Subject[] = [];
//     for (const assignment of teacherAssignments.value) {
//       const subjectRef = assignment.ref.parent.parent;
//       if (subjectRef) {
//         const subjectSnap = await getDoc(subjectRef);
//         if (subjectSnap.exists()) {
//           results.push({
//             id: subjectSnap.id,
//             ...(subjectSnap.data() as Omit<Subject, "id">),
//           });
//         }
//       }
//     }
//     subjects.value = results;
//   });

//   return { subjects, pending, error };
// }

// export function useSubjectTeachersForTeacher(teacherId: string) {
//   const { data: teacherAssignments, pending, error } = useCollection(
//     query(
//       collection(db, "subjects"),
//       where("teacherIds", "not-in", [teacherId])
//     )
//   );

//   const subjects = ref<Subject[]>([]);

//   // reactively fetch subjects when assignments change
//   watchEffect(async () => {
//     if (!teacherAssignments.value) {
//       subjects.value = [];
//       return;
//     }

//     const results: Subject[] = [];
//     for (const assignment of teacherAssignments.value) {
//       const subjectRef = assignment.ref.parent.parent;
//       if (subjectRef) {
//         const subjectSnap = await getDoc(subjectRef);
//         if (subjectSnap.exists()) {
//           results.push({
//             id: subjectSnap.id,
//             ...(subjectSnap.data() as Omit<Subject, "id">),
//           });
//         }
//       }
//     }
//     subjects.value = results;
//   });

//   return { subjects, pending, error };
// }
