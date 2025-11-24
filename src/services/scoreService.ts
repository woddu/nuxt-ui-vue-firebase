import { db } from '@/firebase'
import { collection, doc, setDoc, updateDoc } from 'firebase/firestore'
import type { InitalScoreDetails, Score } from '@/interfaces'

export const scoresRef = collection(db, "scores");

export async function createScore(initalScoreDetails: InitalScoreDetails) {
  const score = {
    ...initalScoreDetails,
  } as Score;

  const scoreRef = doc(scoresRef);
  await setDoc(scoreRef, { ...score, id: scoreRef.id });
  return scoreRef.id;
}

export async function updateScore(score: Score) {
    if (!score.id) {
      const scoreRef = doc(scoresRef);
      await setDoc(scoreRef, { ...score, id: scoreRef.id });
      return scoreRef.id;
    }
    const { id, ...data } = score;
    const docRef = doc(scoresRef, id);
    await updateDoc(docRef, data);
}

