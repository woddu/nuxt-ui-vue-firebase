<script setup lang="ts">
import { TeacherSubject } from '@/interfaces';
import { useTeacherStore } from '@/stores/teacherSubjects';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const emit = defineEmits<{
    (e: 'loading', value: boolean): void
}>()

const router = useRouter();

const teacherStore = useTeacherStore();

const isLoading = ref(false);

const teacherSubject = computed(() => {
    return teacherStore.teacherSubjects()?.data.value.find(subject => 
        subject.id === router.currentRoute.value.params.id
    );
})

const teacherSubjectName = computed(() => {
    return teacherStore.subjects()?.data.value.find(subject => 
        subject.id === router.currentRoute.value.params.id
    )?.name;
})

const subjectSections = computed(() => {
    return teacherStore.subjectSections()?.data.value.filter(section => 
        section.id === router.currentRoute.value.params.id
    );
})

const teacherSubjectModel = reactive<TeacherSubject>({
    id: '',
    teacherSubjectId: '',
    WW1_First: 0,
    WW2_First: 0,
    WW3_First: 0,
    WW4_First: 0,
    WW5_First: 0,
    WW6_First: 0,
    WW7_First: 0,
    WW8_First: 0,
    WW9_First: 0,
    WW10_First: 0,
    WW1_Second: 0,
    WW2_Second: 0,
    WW3_Second: 0,
    WW4_Second: 0,
    WW5_Second: 0,
    WW6_Second: 0,
    WW7_Second: 0,
    WW8_Second: 0,
    WW9_Second: 0,
    WW10_Second: 0,
    PT1_First: 0,
    PT2_First: 0,
    PT3_First: 0,
    PT4_First: 0,
    PT5_First: 0,
    PT6_First: 0,
    PT7_First: 0,
    PT8_First: 0,
    PT9_First: 0,
    PT10_First: 0,
    PT1_Second: 0,
    PT2_Second: 0,
    PT3_Second: 0,
    PT4_Second: 0,
    PT5_Second: 0,
    PT6_Second: 0,
    PT7_Second: 0,
    PT8_Second: 0,
    PT9_Second: 0,
    PT10_Second: 0,
    Exam_First: 0,
    Exam_Second: 0
});

onMounted(() => {    
    emit('loading', false);
})

watch(teacherSubject, (newValue) => {
    if (newValue) {
        Object.assign(teacherSubjectModel, newValue);
    }
})

watch(isLoading, (newValue) => {
    emit('loading', newValue);
})

</script>

<template>

    <PageHeaderTitle :title="teacherSubjectName + ' Highest Possible Scores'" />
    <UForm>
        <UAccordion 
            :items="[{label: '1st Quarter'}]"
            :ui="{
                label: 'text-xl text-highlighted font-semibold'
            }"
        >
            <template #content>
                <UInput v-model="teacherSubjectModel.WW1_First" type="number" min="0" max="100" placeholder="Enter score" />
                <UInput v-model="teacherSubjectModel.WW2_First" type="number" min="0" max="100" placeholder="Enter score" />
                <UInput v-model="teacherSubjectModel.WW3_First" type="number" min="0" max="100" placeholder="Enter score" />
                <UInput v-model="teacherSubjectModel.WW4_First" type="number" min="0" max="100" placeholder="Enter score" />
                <UInput v-model="teacherSubjectModel.WW5_First" type="number" min="0" max="100" placeholder="Enter score" />

            </template>
        </UAccordion>
        <UAccordion 
            :items="[{label: '2nd Quarter'}]"
            :ui="{
                label: 'text-xl text-highlighted font-semibold'
            }"
        >
            <template #content>

            </template>
        </UAccordion>
    </UForm>
</template>