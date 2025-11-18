import { TeacherSubject } from "@/interfaces";
import { db } from '@/firebase'
import { doc, runTransaction, arrayUnion, arrayRemove, collection, updateDoc } from 'firebase/firestore'
import { subjectsRef } from './subjectService';
import { teachersRef } from './teacherService';

export async function addSubjectTeacher(subjectId: string, teacherId: string) {
  const subjectRef = doc(subjectsRef, subjectId);

  const teacherRef = doc(teachersRef, teacherId);

  const teacherSubjectRef = collection(teacherRef, 'subjects');

  const newTeacherSubject = {
    teacherSubjectId: subjectId,
    WW1_First: 0,
    WW2_First: 0,
    WW3_First: 0,
    WW4_First: 0,
    WW5_First: 0,
    WW6_First: 0,
    WW7_First: 0,
    WW8_First: 0,
    WW9_First: 0,
    WW10_First: 0,
    WW1_Second: 0,
    WW2_Second: 0,
    WW3_Second: 0,
    WW4_Second: 0,
    WW5_Second: 0,
    WW6_Second: 0,
    WW7_Second: 0,
    WW8_Second: 0,
    WW9_Second: 0,
    WW10_Second: 0,
    PT1_First: 0,
    PT2_First: 0,
    PT3_First: 0,
    PT4_First: 0,
    PT5_First: 0,
    PT6_First: 0,
    PT7_First: 0,
    PT8_First: 0,
    PT9_First: 0,
    PT10_First: 0,
    PT1_Second: 0,
    PT2_Second: 0,
    PT3_Second: 0,
    PT4_Second: 0,
    PT5_Second: 0,
    PT6_Second: 0,
    PT7_Second: 0,
    PT8_Second: 0,
    PT9_Second: 0,
    PT10_Second: 0,
    Exam_First: 0,
    Exam_Second: 0
  }

  const teacherSubjectRefDoc = doc(teacherSubjectRef, subjectId);

  await runTransaction(db, async (tx) => {    
    const snap = await tx.get(teacherSubjectRefDoc);
    
    tx.update(subjectRef, {
      teacherIds: arrayUnion(teacherId),
    });
    
    if (snap.exists()) {
      throw new Error("This Teacher already has that Subject assigned.");
    }    
    tx.set(teacherSubjectRefDoc, newTeacherSubject);
  });
}

export async function updateSubjectTeacher(teacherId: string, teacherSubject: TeacherSubject) {
  if (!teacherSubject.id || !teacherId){

    return;
  }

  const teacherRef = doc(teachersRef, teacherId);

  const teacherSubjectRef = collection(teacherRef, 'subjects');

  const { id, ...data } = teacherSubject;
  const docRef = doc(teacherSubjectRef, id);
  await updateDoc(docRef, data);
}

export async function removeSubjectTeacher(subjectId: string, teacherId: string) {
  const subjectRef = doc(subjectsRef, subjectId);
  const teacherRef = doc(teachersRef, teacherId);
  const teacherSubjectsRef = collection(teacherRef, 'subjects');

  const teacherSubjectRef = doc(teacherSubjectsRef, subjectId);

  await runTransaction(db, async (tx) => {
    // 2. Remove teacherId from parent Subject doc's teacherIds array
    tx.update(subjectRef, {
      teacherIds: arrayRemove(teacherId),
    });
    
    tx.delete(teacherSubjectRef);
  });
}