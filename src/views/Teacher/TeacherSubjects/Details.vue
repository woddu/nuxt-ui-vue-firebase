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
                label: 'text-2xl text-highlighted font-bold'
            }"
        >
            <template #content>
                <UAccordion
                    class="pl-5 mb-2" 
                    :items="[{label: 'Written Works'}]"
                    :ui="{
                        label: 'text-xl text-highlighted font-semibold'
                    }"
                >
                    <template #content>
                        <div class="grid grid-cols-2 md:grid-cols-1! md:grid-rows-2 gap-4">
                            <div class="grid grid-rows-5 md:grid-rows-1! md:grid-cols-5 gap-4">                            
                                <UFormField label="#1">
                                    <UInputNumber v-model="teacherSubjectModel.WW1_First" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                </UFormField>
                                <UFormField label="#2">
                                    <UInputNumber v-model="teacherSubjectModel.WW2_First" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                </UFormField>
                                <UFormField label="#3">
                                    <UInputNumber v-model="teacherSubjectModel.WW3_First" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                </UFormField>
                                <UFormField label="#4">
                                    <UInputNumber v-model="teacherSubjectModel.WW4_First" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                </UFormField>
                                <UFormField label="#5">
                                    <UInputNumber v-model="teacherSubjectModel.WW5_First" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                </UFormField>
                            </div>  
                            <div class="grid grid-rows-5 md:grid-rows-1! md:grid-cols-5 gap-4">      
                                <UFormField label="#6">
                                    <UInputNumber v-model="teacherSubjectModel.WW6_First" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                </UFormField>
                                <UFormField label="#7">
                                    <UInputNumber v-model="teacherSubjectModel.WW7_First" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                </UFormField>
                                <UFormField label="#8">
                                    <UInputNumber v-model="teacherSubjectModel.WW8_First" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                </UFormField>
                                <UFormField label="#9">
                                    <UInputNumber v-model="teacherSubjectModel.WW9_First" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                </UFormField>
                                <UFormField label="#10">
                                    <UInputNumber v-model="teacherSubjectModel.WW10_First" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                </UFormField>                                
                            </div>
                        </div>                        
                    </template>
                </UAccordion>
                <UAccordion 
                    class="pl-5 mb-2" 
                    :items="[{label: 'Performance Tasks'}]"
                    :ui="{
                        label: 'text-xl text-highlighted font-semibold'
                    }"
                >
                    <template #content>
                        <div class="grid grid-cols-2 md:grid-cols-1! md:grid-rows-2 gap-4">
                            <div class="grid grid-rows-5 md:grid-rows-1! md:grid-cols-5 gap-4">                            
                                <UFormField label="#1">
                                    <UInputNumber v-model="teacherSubjectModel.PT1_First" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                </UFormField>
                                <UFormField label="#2">
                                    <UInputNumber v-model="teacherSubjectModel.PT2_First" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                </UFormField>
                                <UFormField label="#3">
                                    <UInputNumber v-model="teacherSubjectModel.PT3_First" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                </UFormField>
                                <UFormField label="#4">
                                    <UInputNumber v-model="teacherSubjectModel.PT4_First" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                </UFormField>
                                <UFormField label="#5">
                                    <UInputNumber v-model="teacherSubjectModel.PT5_First" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                </UFormField>
                            </div>  
                            <div class="grid grid-rows-5 md:grid-rows-1! md:grid-cols-5 gap-4">      
                                <UFormField label="#6">
                                    <UInputNumber v-model="teacherSubjectModel.PT6_First" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                </UFormField>
                                <UFormField label="#7">
                                    <UInputNumber v-model="teacherSubjectModel.PT7_First" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                </UFormField>
                                <UFormField label="#8">
                                    <UInputNumber v-model="teacherSubjectModel.PT8_First" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                </UFormField>
                                <UFormField label="#9">
                                    <UInputNumber v-model="teacherSubjectModel.PT9_First" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                </UFormField>
                                <UFormField label="#10">
                                    <UInputNumber v-model="teacherSubjectModel.PT10_First" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                </UFormField>                                
                            </div>
                        </div>
                    </template>
                </UAccordion>
                <UAccordion 
                    class="pl-5 mb-2" 
                    :items="[{label: 'Exam'}]"
                    :ui="{
                        label: 'text-xl text-highlighted font-semibold'
                    }"
                >
                    <template #content>
                        <UFormField label="Exam">
                            <UInputNumber v-model="teacherSubjectModel.Exam_First" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                        </UFormField>
                    </template>
                </UAccordion>
            </template>
        </UAccordion>
        <UAccordion 
            class="mb-4"
            :items="[{label: '2nd Quarter'}]"
            :ui="{
                label: 'text-2xl text-highlighted font-bold'
            }"
        >
            <template #content>
                <UAccordion
                    class="pl-5 mb-2" 
                    :items="[{label: 'Written Works'}]"
                    :ui="{
                        label: 'text-xl text-highlighted font-semibold'
                    }"
                >
                    <template #content>
                        <div class="grid grid-cols-2 md:grid-cols-1! md:grid-rows-2 gap-4">
                            <div class="grid grid-rows-5 md:grid-rows-1! md:grid-cols-5 gap-4">                            
                                <UFormField label="#1">
                                    <UInputNumber v-model="teacherSubjectModel.WW1_Second" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                </UFormField>
                                <UFormField label="#2">
                                    <UInputNumber v-model="teacherSubjectModel.WW2_Second" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                </UFormField>
                                <UFormField label="#3">
                                    <UInputNumber v-model="teacherSubjectModel.WW3_Second" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                </UFormField>
                                <UFormField label="#4">
                                    <UInputNumber v-model="teacherSubjectModel.WW4_Second" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                </UFormField>
                                <UFormField label="#5">
                                    <UInputNumber v-model="teacherSubjectModel.WW5_Second" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                </UFormField>
                            </div>  
                            <div class="grid grid-rows-5 md:grid-rows-1! md:grid-cols-5 gap-4">      
                                <UFormField label="#6">
                                    <UInputNumber v-model="teacherSubjectModel.WW6_Second" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                </UFormField>
                                <UFormField label="#7">
                                    <UInputNumber v-model="teacherSubjectModel.WW7_Second" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                </UFormField>
                                <UFormField label="#8">
                                    <UInputNumber v-model="teacherSubjectModel.WW8_Second" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                </UFormField>
                                <UFormField label="#9">
                                    <UInputNumber v-model="teacherSubjectModel.WW9_Second" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                </UFormField>
                                <UFormField label="#10">
                                    <UInputNumber v-model="teacherSubjectModel.WW10_Second" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                </UFormField>                                
                            </div>
                        </div>                        
                    </template>
                </UAccordion>
                <UAccordion 
                    class="pl-5 mb-2" 
                    :items="[{label: 'Performance Tasks'}]"
                    :ui="{
                        label: 'text-xl text-highlighted font-semibold'
                    }"
                >
                    <template #content>
                        <div class="grid grid-cols-2 md:grid-cols-1! md:grid-rows-2 gap-4">
                            <div class="grid grid-rows-5 md:grid-rows-1! md:grid-cols-5 gap-4">                            
                                <UFormField label="#1">
                                    <UInputNumber v-model="teacherSubjectModel.PT1_Second" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                </UFormField>
                                <UFormField label="#2">
                                    <UInputNumber v-model="teacherSubjectModel.PT2_Second" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                </UFormField>
                                <UFormField label="#3">
                                    <UInputNumber v-model="teacherSubjectModel.PT3_Second" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                </UFormField>
                                <UFormField label="#4">
                                    <UInputNumber v-model="teacherSubjectModel.PT4_Second" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                </UFormField>
                                <UFormField label="#5">
                                    <UInputNumber v-model="teacherSubjectModel.PT5_Second" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                </UFormField>
                            </div>  
                            <div class="grid grid-rows-5 md:grid-rows-1! md:grid-cols-5 gap-4">      
                                <UFormField label="#6">
                                    <UInputNumber v-model="teacherSubjectModel.PT6_Second" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                </UFormField>
                                <UFormField label="#7">
                                    <UInputNumber v-model="teacherSubjectModel.PT7_Second" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                </UFormField>
                                <UFormField label="#8">
                                    <UInputNumber v-model="teacherSubjectModel.PT8_Second" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                </UFormField>
                                <UFormField label="#9">
                                    <UInputNumber v-model="teacherSubjectModel.PT9_Second" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                </UFormField>
                                <UFormField label="#10">
                                    <UInputNumber v-model="teacherSubjectModel.PT10_Second" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                </UFormField>                                
                            </div>
                        </div>
                    </template>
                </UAccordion>
                <UAccordion 
                    class="pl-5 mb-2" 
                    :items="[{label: 'Exam'}]"
                    :ui="{
                        label: 'text-xl text-highlighted font-semibold'
                    }"
                >
                    <template #content>
                        <UFormField label="Exam">
                            <UInputNumber v-model="teacherSubjectModel.Exam_First" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                        </UFormField>
                    </template>
                </UAccordion>
            </template>
        </UAccordion>

        <UAccordion 
            class="mb-4"
            :items="[{label: 'Sections'}]"
            :ui="{
                label: 'text-2xl text-highlighted font-semibold'
            }" >
            <template #content>
                <ul>
                    <li v-for="subjectSection in subjectSections" :key="subjectSection.id">
                        <UButton
                            class="cursor-pointer"
                            variant="ghost"
                            :label="subjectSection.sectionName" 
                            @click="() => {
                                isLoading = true;
                                // router.push({
                                //     name: 'Teacher-Subject-Details',
                                //     params: { id: subjectSection.id }
                                // });
                            }"
                            size="xl"/>
                    </li>
                </ul>
            </template>
        </UAccordion>
    </UForm>
</template>