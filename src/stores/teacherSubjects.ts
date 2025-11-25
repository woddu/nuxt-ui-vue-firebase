import { useSectionsByAdviser } from "@/composables/useSections";
import { useSubjects } from "@/composables/useSubjects";
import { useTeacherSubjects } from "@/composables/useTeacherSubjects";
import { Section, SectionSubjectRead, Subject, TeacherSubject } from "@/interfaces";
import { defineStore } from "pinia";
import { _RefFirestore, VueFirestoreQueryData } from "vuefire";
import { useUserStore } from "./user";
import { useSectionsSubjectsByTeacher } from "@/composables/useSectionSubjects";

export const useTeacherStore = defineStore('teacher', () => {
  let teacherSubjectsCollection: _RefFirestore<VueFirestoreQueryData<TeacherSubject>> | null = null;
  let subjectsCollection: _RefFirestore<VueFirestoreQueryData<Subject>> | null = null;
  let advisorySectionsCollection: _RefFirestore<VueFirestoreQueryData<Section>> | null = null;
  let subjectSectionsCollection: _RefFirestore<VueFirestoreQueryData<SectionSubjectRead>> | null = null;
  let stopCollections: (() => void) | null = null;

  const userStore = useUserStore();

  function start(teacherId: string) {
    console.log("Starting teacher store for:", teacherId);
    stop(); // reset previous listeners if switching teacher
    try{
      teacherSubjectsCollection = useTeacherSubjects(teacherId);
      subjectsCollection = useSubjects();
      advisorySectionsCollection = useSectionsByAdviser(teacherId);
      subjectSectionsCollection = useSectionsSubjectsByTeacher(teacherId);
      stopCollections = () => {
        teacherSubjectsCollection?.stop();
        subjectsCollection?.stop();
        advisorySectionsCollection?.stop();
        subjectSectionsCollection?.stop();
      };
    } catch (error) {
      console.error("Error starting teacher store:", error);
      stop();
    }
  }

  function teacherSubjects() {
    if (teacherSubjectsCollection) {
      return teacherSubjectsCollection;
    } else {
      start(userStore.user?.id ?? "");
      return teacherSubjectsCollection;
    }
  }

  function subjects() {
    if (subjectsCollection) {
      return subjectsCollection;
    } else {
      start(userStore.user?.id ?? "");
      return subjectsCollection;
    }
  }

  function advisorySections() {
    if (advisorySectionsCollection) {
      return advisorySectionsCollection;
    } else {
      start(userStore.user?.id ?? "");
      return advisorySectionsCollection;
    }
  }

  function subjectSections(){
    if (subjectSectionsCollection) {
      return subjectSectionsCollection;
    } else {
      start(userStore.user?.id ?? "");
      return subjectSectionsCollection;
    }
  }

  function stop() {
    stopCollections?.();
    stopCollections = null;
    teacherSubjectsCollection = null;
    subjectsCollection = null;
    advisorySectionsCollection = null;
    subjectSectionsCollection = null
  }

  return {
    teacherSubjects,
    subjects,
    advisorySections,
    subjectSections,
    start,
    stop,
  };
}, {
  persist: true
});
