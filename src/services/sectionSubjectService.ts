import { db } from '@/firebase'
import { doc, runTransaction, serverTimestamp, arrayUnion, arrayRemove, collection } from 'firebase/firestore'
import type { Section, SectionSubjectWrite } from '@/interfaces'
import { sectionsRef } from './sectionService';


export async function addSectionSubject(section: Section, subjectId: string, teacherId: string) {    
    const sectionRef = doc(sectionsRef, section.id);

    const sectionSubjectsRef = collection(sectionRef, 'sectionSubjects');

    const sectionSubjectRef = doc(sectionSubjectsRef, subjectId);
    
    await runTransaction(db, async (tx) => {
        const snap = await tx.get(sectionSubjectRef)
        tx.update(sectionRef, {
            subjectIds: arrayUnion(subjectId),
        })

        if (snap.exists()) {
            throw new Error("This Subject is already assigned to the Section.")
        }
        
        const sectionSubject: SectionSubjectWrite = {
            subjectTeacherId: teacherId,
            sectionId: section.id,
            sectionName: section.name,
            assignedAt: serverTimestamp()
        };
        tx.set(sectionSubjectRef, sectionSubject)

    })
}

export async function removeSectionSubject(sectionId: string, subjectId: string) {
    const sectionRef = doc(sectionsRef, sectionId);
    const sectionSubjectsRef = collection(sectionRef, 'sectionSubjects');
    const sectionSubjectRef = doc(sectionSubjectsRef, subjectId);
    await runTransaction(db, async (tx) => {
        tx.update(sectionRef, {
            subjectIds: arrayRemove(subjectId),
        })                
        tx.delete(sectionSubjectRef)
    })
}