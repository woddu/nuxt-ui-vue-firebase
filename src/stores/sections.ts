import { defineStore } from 'pinia'
import { _RefFirestore, VueFirestoreQueryData } from 'vuefire'
import { Section } from '@/interfaces'
import { useSections } from '@/composables/useSections'

export const useSectionStore = defineStore('sections', () => {
    let sectionsCollection: _RefFirestore<VueFirestoreQueryData<Section>>;
    let stopSections: (() => void) | null = null

    function start() {
        // bind only once
        if (!stopSections) {
            sectionsCollection = useSections()
            stopSections = sectionsCollection.stop
        }
    }

    function sections() {
        if (sectionsCollection) {
            return sectionsCollection;
        } else {
            start();
            return sectionsCollection;
        }
    }

    function stop() {
        if (stopSections) {
            stopSections()
            stopSections = null
        }
    }

    return { sections, start, stop }
}, {
  persist: true
})
