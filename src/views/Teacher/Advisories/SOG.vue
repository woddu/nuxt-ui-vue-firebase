<script setup lang="ts">
import { useScoresBySection } from '@/composables/useScores';
import { useTeacherStore } from '@/stores/teacherSubjects';
import { useRouter } from 'vue-router';
import { computed } from 'vue';
import { useStudentsBySection } from '@/composables/useStudents';
import { Section } from '@/interfaces';
import { TableColumn } from '@nuxt/ui';
import { DocumentData } from 'firebase/firestore';

const emit = defineEmits<{
    (e: 'loading', value: boolean): void
}>();

const router = useRouter();

const teacherStore = useTeacherStore()

const scores = useScoresBySection(router.currentRoute.value.params.id as string)

const students = useStudentsBySection(router.currentRoute.value.params.id as string)

const pending = computed(() => 
  (students.pending.value || scores.pending.value)
)

const error = computed(() => 
  students.error.value ?? scores.error.value
)

const section = computed(() => 
  teacherStore.advisorySections()?.value.find(section => section.id === router.currentRoute.value.params.id) ?? {} as Section
)

const sectionSubjects = computed(() => {
  const subjects = teacherStore.subjects()?.value ?? [];
  const ids = section.value?.subjectIds ?? [];
  return subjects.filter(s => ids.includes(s.id));
});


const studentsWithScores = computed(() => {
  const scoreMap = new Map<string, Record<string, number>>();

  // Build nested map: studentId → { subjectId: grade }
  for (const s of scores.value ?? []) {
    if (!scoreMap.has(s.studentId)) {
      scoreMap.set(s.studentId, {});
    }
    scoreMap.get(s.studentId)![s.subjectId] = s.Final_Grade;
  }

  return students.value?.map(student => {
    const studentScores = scoreMap.get(student.id) ?? {};

    return {
      ...student,
      ...Object.fromEntries(
        sectionSubjects.value.map(subject => [
          subject.name,
          studentScores[subject.id] ?? null
        ])
      )
    };
  }) ?? [];
});

const tableColumn: TableColumn<DocumentData>[] = [
  {
    accessorKey: "Student",
    header: "Student",
    cell: ({ row }) => {   
      const student = row.original;
      const value = `${student.lastName}, ${student.firstName}`;
      return value || "N/A";
    }
  },
  ...sectionSubjects.value.map(subject => ({
    accessorKey: subject.name,
    header: subject.name,
    cell: ({ row }) => {
      const value = row.getValue(subject.name);
      return value !== null ? value : 'N/A';
    }
  }))
];

function check() {
  console.log("section: ", section.value)
  console.log("sectionSubjects: ",sectionSubjects.value)
  console.log("studentsWithScores: ", studentsWithScores.value)
}

</script>

<template>
  <UButton @click="check()" label="click"/>
  <div class="border border-muted relative z-1 rounded-md max-h-[calc(100vh-14rem)] md:max-h-[calc(100vh-12rem)]">
    <UTable sticky ref="table" :data="studentsWithScores" :columns="tableColumn" :loading="pending" :error="error"
      class="max-h-[calc(100vh-14rem)] md:max-h-[calc(100vh-12rem)]"/>
  </div>  
</template>