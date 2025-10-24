<script setup lang="ts">
import { useSections } from '@/composables/useSections';
import { useSectionsOfSubjects } from '@/composables/useSectionSubjects';
import { useSubjects, useSubjectsByTeacher } from '@/composables/useSubjects';
import { useTeacherById } from '@/composables/useTeachers';
import { Section, Subject } from '@/interfaces';
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';


const emit = defineEmits<{
  (e: 'loading', value: boolean): void
}>()

const toast = useToast()

const isLoading = ref(false);

const router = useRouter();

const teacherDoc = useTeacherById(router.currentRoute.value.params.id as string);
const teacherDocPending = ref(teacherDoc.pending.value);

const subjectsOfTeacher = useSubjectsByTeacher(router.currentRoute.value.params.id as string);
const subjectsOfTeacherPending = ref(subjectsOfTeacher.pending.value);

const sectionsSubjectOfTeacher = useSectionsOfSubjects(subjectsOfTeacher.data.value.map((st: Subject) => st.id));
const sectionsSubjectOfTeacherPending = ref(sectionsSubjectOfTeacher.pending.value);

const subjects = useSubjects();
const subjectsPending = ref(subjects.pending.value);

const sections = useSections();
const sectionsPending = ref(sections.pending.value);

const availableSubjects = computed(() => {
  if (subjects.pending.value) return [] // or null if you want to signal "loading"
  return subjects.data.value.filter((s: Subject) => !s.teacherIds.includes(router.currentRoute.value.params.id as string)) ?? []
});

const availableSections = computed(() => {
  if (sectionsPending.value || subjectsPending.value) return []
  const filteredIds = availableSubjects.value.map((fs: Subject) => fs.id)
  return sections.data.value?.filter(
    (section: Section) => !section.subjectIds.some((id: string) => filteredIds.includes(id))
  ) ?? []
})

const grouped = computed(() => {
  // guard against pending state
  if (!subjectsOfTeacher.data.value || !sectionsSubjectOfTeacher.data.value) {
    return []
  }

  return subjectsOfTeacher.data.value.map((subject: Subject) => {
    const relatedSections = sectionsSubjectOfTeacher.data.value.filter(
      (section: Section) => section.subjectIds.includes(subject.id)
    )
    return {
      subject,
      sections: relatedSections
    }
  })
})

watch(
  () => teacherDocPending.value,
  (newVal) => {
    emit('loading', newVal);
  },
  { immediate: true }
);

watch(
  () => subjectsOfTeacherPending.value,
  (newVal) => {
    emit('loading', newVal);
    
  },
  { immediate: true }
);

watch(
  () => sectionsSubjectOfTeacherPending.value,
  (newVal) => {
    emit('loading', newVal);
  },
  { immediate: true }
);

watch(
  () => subjectsPending.value,
  (newVal) => {
    emit('loading', newVal);
    console.log('subjects', subjects.data.value);
  },
  { immediate: true }
);

watch(
  () => sectionsPending.value,
  (newVal) => {
    emit('loading', newVal);
    console.log('sections', sections.data.value);
    console.log('availableSections', availableSections.value);
  },
  { immediate: true }
);

</script>

<template>

  <UCard>
    subjects of {{ teacherDoc?.firstName }} {{ teacherDoc?.lastName }}
    <ul>
      <li v-for="group in grouped" :key="group.subject.id">
        <strong>{{ group.subject.name }}</strong>
        <ul>
          <li v-for="section in group.sections" :key="section.id">
            {{ section.name }}
          </li>
        </ul>
      </li>
    </ul>
  </UCard>

  <UCard>
    available subjects to assign
    <ul>
      <li v-for="subject in availableSubjects" :key="subject.id">
        {{ subject.name }}
      </li>
    </ul>
  </UCard>

  <UCard>
    available sections to assign
    <ul>
      <li v-for="section in availableSections" :key="section.id">
        {{ section.name }}
      </li>
    </ul>
  </UCard>

</template>