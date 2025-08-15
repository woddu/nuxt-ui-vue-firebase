import { studentsRef } from "@/firebase";
import { getCountFromServer } from "firebase/firestore";
import { ref } from "vue";

export default async function useStudentsCount() {
    const pending = ref(true);
    const count = ref(0);
    await getCountFromServer(studentsRef)
    .then((snapshot) => {
        count.value = snapshot.data().count;
        pending.value = false;
    });

    return { pending, count };
}