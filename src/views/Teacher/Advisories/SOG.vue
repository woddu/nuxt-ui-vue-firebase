<script setup lang="ts">
import { useScoresBySection } from '@/composables/useScores';
import { useTeacherStore } from '@/stores/teacherSubjects';
import { useRouter } from 'vue-router';
import { computed } from 'vue';
import { useStudentsBySection } from '@/composables/useStudents';
import { Section } from '@/interfaces';

const emit = defineEmits<{
    (e: 'loading', value: boolean): void
}>();

const router = useRouter();

const teacherStore = useTeacherStore()

const scores = useScoresBySection(router.currentRoute.value.params.id as string)

const students = useStudentsBySection(router.currentRoute.value.params.id as string)

const section = computed(() => 
  teacherStore.advisorySections()?.value.find(section => section.id === router.currentRoute.value.params.id) ?? {} as Section
)

const sectionSubjects = computed(() => {  
  teacherStore.subjects()?.value.filter(subject => section.value.subjectIds.includes(subject.id))
})

const studentsWithScores = computed(() => {
    const scoreMap = new Map(scores.value.map(s => [s.studentId, s]));
    students.value.map(student => ({
            ...student,
            grade: scoreMap.get(student.id)?.Final_Grade ?? null
        })
    )
})

// function groupBy<T, K extends keyof T>(array: T[], key: K): Record<string, T[]> {
//   return array.reduce((result, current) => {
//     const fieldValue = String(current[key]); // convert to string for object keys
//     if (!result[fieldValue]) {
//       result[fieldValue] = [];
//     }
//     result[fieldValue].push(current);
//     return result;
//   }, {} as Record<string, T[]>);
// }

function check() {
  console.log("section: ", section.value)
  console.log("sectionSubjects: ",sectionSubjects.value)
}

</script>

<template>
  <UButton @click="check()" label="click"/>

</template>