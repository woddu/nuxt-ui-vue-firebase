import { defineStore } from 'pinia'
import { _RefFirestore, VueFirestoreQueryData } from 'vuefire'
import { useSubjects } from '@/composables/useSubjects'
import { Subject } from '@/interfaces'

export const useSubjectStore = defineStore('subjects', () => {
    let subjectsCollection: _RefFirestore<VueFirestoreQueryData<Subject>>;
    let stopSubjects: (() => void) | null = null

    function start() {
        // bind only once
        if (!stopSubjects) {
            subjectsCollection = useSubjects()
            stopSubjects = subjectsCollection.stop
        }
    }

    function subjects() {
        if (subjectsCollection) {
            return subjectsCollection;
        } else {
            start();
            return subjectsCollection;
        }
    }

    function stop() {
        if (stopSubjects) {
            stopSubjects()
            stopSubjects = null
        }
    }

    return { subjects , start, stop }
}, {
  persist: true
})
