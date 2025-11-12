import { useCollection } from 'vuefire'
import {  orderBy, query, where } from 'firebase/firestore'
import { Score } from '@/interfaces'
import { scoresRef } from '@/services/scoreService'

export function useScoresByStudent(studentId: string) {
    const scoresQuery = query(
        scoresRef,
        where("studentId", "==", studentId),
        orderBy("studentLastName", "desc")
    );
    return useCollection<Score>(scoresQuery);
}

export function useScoresBySection(sectionId: string) {
    const scoresQuery = query(
        scoresRef, 
        where("sectionId", "==", sectionId),
        orderBy("studentGender", "desc")
    );
    return useCollection<Score>(scoresQuery);
}
