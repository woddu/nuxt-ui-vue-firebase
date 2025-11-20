<script setup lang="ts">
import { useScoresByStudent } from '@/composables/useScores';
import { useStudentById } from '@/composables/useStudents';
import { Score } from '@/interfaces';
import { updateScore } from '@/services/scoreService';
import { FormError } from '@nuxt/ui';
import { ref } from 'vue';
import { onMounted, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';

const emit = defineEmits<{
    (e: 'loading', value: boolean): void
}>()

const toast = useToast();

const router = useRouter();

const isLoading = ref(false)

const student = useStudentById(router.currentRoute.value.params.id as string)

const studentScore = useScoresByStudent(router.currentRoute.value.params.id as string)

const studentScoreModel = reactive<Score>({
    id: '',
    studentId: '',
    studentLastName: '',
    studentFirstName: '',
    studentGender: '',
    subjectId: router.currentRoute.value.query.subjectId as string,
    subjectName: router.currentRoute.value.query.subjectName as string,
    sectionId: router.currentRoute.value.query.sectionId as string,
    sectionName: router.currentRoute.value.query.sectionName as string,
    teacherSubjectId: router.currentRoute.value.query.teacherSubjectId as string,
    semester: '',
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
    Exam_Second: 0,
    Initial_Grade: 0,
    Final_Grade: 0
});

const validate = (state: Score): FormError[] => {
    const errors = [];

    if(!state.studentId || !state.studentLastName || !state.studentFirstName || !state.studentGender){
        errors.push({ title: 'student', message: 'Student info is incomplete.' });
    }

    return errors
}

async function saveStudentScore(){
    isLoading.value = true;

    const errors = validate(studentScoreModel);
    if(errors.length > 0){
        for (const error of errors) {
            toast.add({ title: 'Validation Error', description: error.message, color: 'error' });
        }
        return; 
    }

    updateScore(studentScoreModel)
        .then(() => {
            toast.add({ title: 'Success', description: 'Student score updated successfully.', color: 'success' });
        })
        .catch(() => {
            toast.add({ title: 'Error', description: 'Failed to update student score.', color: 'error' });
        })
        .finally(() => {
            isLoading.value = false;
        });
}

onMounted(() => {    
    emit('loading', false);
})

watch([student, studentScore], ([newStudent, newScore]) => {
  if (newStudent) {
    studentScoreModel.studentId = newStudent.id;
    studentScoreModel.studentLastName = newStudent.lastName;
    studentScoreModel.studentFirstName = newStudent.firstName;
    studentScoreModel.studentGender = newStudent.gender;
  }

  if (newScore && studentScoreModel.studentId !== '') {
    Object.assign(studentScoreModel, newScore);
  }
});


watch(isLoading, (newValue) => {
    emit('loading', newValue);
})

</script>

<template>
    <PageHeaderTitle :title="studentScoreModel.studentLastName + ', ' + studentScoreModel.studentFirstName + ' Scores'" />
    <UForm :validate="validate" :state="studentScoreModel" @submit="saveStudentScore">
        <UAccordion 
            class="border-b border-default "
            :items="[{label: '1st Quarter'}]"
            :ui="{
                label: 'text-2xl text-highlighted font-bold'
            }"
        >
            <template #body>
                <div class="border-s border-default ms-3 ps-4 md:ms-5 md:ps-5">                        
                    <UAccordion
                        class="mb-2" 
                        :items="[{label: 'Written Works'}]"
                        :ui="{
                            label: 'text-xl text-highlighted font-semibold'
                        }"
                    >
                        <template #body>
                            <div class="border-s border-default ms-3 ps-4 md:ms-5 md:ps-5">                        
                                <div class="grid grid-cols-2 md:grid-cols-1! md:grid-rows-2 gap-4">
                                    <div class="grid grid-rows-5 md:grid-rows-1! md:grid-cols-5 gap-4">                            
                                        <UFormField label="#1">
                                            <UInputNumber v-model="studentScoreModel.WW1_First" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                        </UFormField>
                                        <UFormField label="#2">
                                            <UInputNumber v-model="studentScoreModel.WW2_First" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                        </UFormField>
                                        <UFormField label="#3">
                                            <UInputNumber v-model="studentScoreModel.WW3_First" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                        </UFormField>
                                        <UFormField label="#4">
                                            <UInputNumber v-model="studentScoreModel.WW4_First" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                        </UFormField>
                                        <UFormField label="#5">
                                            <UInputNumber v-model="studentScoreModel.WW5_First" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                        </UFormField>
                                    </div>  
                                    <div class="grid grid-rows-5 md:grid-rows-1! md:grid-cols-5 gap-4">      
                                        <UFormField label="#6">
                                            <UInputNumber v-model="studentScoreModel.WW6_First" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                        </UFormField>
                                        <UFormField label="#7">
                                            <UInputNumber v-model="studentScoreModel.WW7_First" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                        </UFormField>
                                        <UFormField label="#8">
                                            <UInputNumber v-model="studentScoreModel.WW8_First" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                        </UFormField>
                                        <UFormField label="#9">
                                            <UInputNumber v-model="studentScoreModel.WW9_First" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                        </UFormField>
                                        <UFormField label="#10">
                                            <UInputNumber v-model="studentScoreModel.WW10_First" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                        </UFormField>                                
                                    </div>
                                </div>                        
                            </div>                        
                        </template>
                    </UAccordion>
                    <UAccordion 
                        class="mb-2" 
                        :items="[{label: 'Performance Tasks'}]"
                        :ui="{
                            label: 'text-xl text-highlighted font-semibold'
                        }"
                    >
                        <template #body>
                                <div class="border-s border-default ms-3 ps-4 md:ms-5 md:ps-5">                        
                                <div class="grid grid-cols-2 md:grid-cols-1! md:grid-rows-2 gap-4">
                                    <div class="grid grid-rows-5 md:grid-rows-1! md:grid-cols-5 gap-4">                            
                                        <UFormField label="#1">
                                            <UInputNumber v-model="studentScoreModel.PT1_First" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                        </UFormField>
                                        <UFormField label="#2">
                                            <UInputNumber v-model="studentScoreModel.PT2_First" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                        </UFormField>
                                        <UFormField label="#3">
                                            <UInputNumber v-model="studentScoreModel.PT3_First" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                        </UFormField>
                                        <UFormField label="#4">
                                            <UInputNumber v-model="studentScoreModel.PT4_First" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                        </UFormField>
                                        <UFormField label="#5">
                                            <UInputNumber v-model="studentScoreModel.PT5_First" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                        </UFormField>
                                    </div>  
                                    <div class="grid grid-rows-5 md:grid-rows-1! md:grid-cols-5 gap-4">      
                                        <UFormField label="#6">
                                            <UInputNumber v-model="studentScoreModel.PT6_First" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                        </UFormField>
                                        <UFormField label="#7">
                                            <UInputNumber v-model="studentScoreModel.PT7_First" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                        </UFormField>
                                        <UFormField label="#8">
                                            <UInputNumber v-model="studentScoreModel.PT8_First" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                        </UFormField>
                                        <UFormField label="#9">
                                            <UInputNumber v-model="studentScoreModel.PT9_First" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                        </UFormField>
                                        <UFormField label="#10">
                                            <UInputNumber v-model="studentScoreModel.PT10_First" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                        </UFormField>                                
                                    </div>
                                </div>
                            </div>
                        </template>
                    </UAccordion>
                    <UAccordion 
                        :items="[{label: 'Exam'}]"
                        :ui="{
                            label: 'text-xl text-highlighted font-semibold'
                        }"
                    >
                        <template #body>
                            <div class="border-s border-default ms-3 ps-4 md:ms-5 md:ps-5">                        
                                <UFormField label="Exam">
                                    <UInputNumber v-model="studentScoreModel.Exam_First" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                </UFormField>
                            </div>
                        </template>
                    </UAccordion>
                </div>
            </template>
        </UAccordion>
        <UAccordion 
            :items="[{label: '2nd Quarter'}]"
            :ui="{
                label: 'text-2xl text-highlighted font-bold'
            }"
        >
            <template #body>
                <div class="border-s border-default ms-3 ps-4 md:ms-5 md:ps-5">                        
                    <UAccordion
                        class="mb-2" 
                        :items="[{label: 'Written Works'}]"
                        :ui="{
                            label: 'text-xl text-highlighted font-semibold'
                        }"
                    >
                        <template #body>
                            <div class="border-s border-default ms-3 ps-4 md:ms-5 md:ps-5">                        
                                <div class="grid grid-cols-2 md:grid-cols-1! md:grid-rows-2 gap-4">
                                    <div class="grid grid-rows-5 md:grid-rows-1! md:grid-cols-5 gap-4">                            
                                        <UFormField label="#1">
                                            <UInputNumber v-model="studentScoreModel.WW1_Second" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                        </UFormField>
                                        <UFormField label="#2">
                                            <UInputNumber v-model="studentScoreModel.WW2_Second" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                        </UFormField>
                                        <UFormField label="#3">
                                            <UInputNumber v-model="studentScoreModel.WW3_Second" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                        </UFormField>
                                        <UFormField label="#4">
                                            <UInputNumber v-model="studentScoreModel.WW4_Second" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                        </UFormField>
                                        <UFormField label="#5">
                                            <UInputNumber v-model="studentScoreModel.WW5_Second" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                        </UFormField>
                                    </div>  
                                    <div class="grid grid-rows-5 md:grid-rows-1! md:grid-cols-5 gap-4">      
                                        <UFormField label="#6">
                                            <UInputNumber v-model="studentScoreModel.WW6_Second" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                        </UFormField>
                                        <UFormField label="#7">
                                            <UInputNumber v-model="studentScoreModel.WW7_Second" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                        </UFormField>
                                        <UFormField label="#8">
                                            <UInputNumber v-model="studentScoreModel.WW8_Second" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                        </UFormField>
                                        <UFormField label="#9">
                                            <UInputNumber v-model="studentScoreModel.WW9_Second" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                        </UFormField>
                                        <UFormField label="#10">
                                            <UInputNumber v-model="studentScoreModel.WW10_Second" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                        </UFormField>                                
                                    </div>
                                </div>                        
                            </div>                        
                        </template>
                    </UAccordion>
                    <UAccordion 
                        class="mb-2" 
                        :items="[{label: 'Performance Tasks'}]"
                        :ui="{
                            label: 'text-xl text-highlighted font-semibold'
                        }"
                    >
                        <template #body>
                            <div class="border-s border-default ms-3 ps-4 md:ms-5 md:ps-5">                        
                                <div class="grid grid-cols-2 md:grid-cols-1! md:grid-rows-2 gap-4">
                                    <div class="grid grid-rows-5 md:grid-rows-1! md:grid-cols-5 gap-4">                            
                                        <UFormField label="#1">
                                            <UInputNumber v-model="studentScoreModel.PT1_Second" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                        </UFormField>
                                        <UFormField label="#2">
                                            <UInputNumber v-model="studentScoreModel.PT2_Second" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                        </UFormField>
                                        <UFormField label="#3">
                                            <UInputNumber v-model="studentScoreModel.PT3_Second" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                        </UFormField>
                                        <UFormField label="#4">
                                            <UInputNumber v-model="studentScoreModel.PT4_Second" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                        </UFormField>
                                        <UFormField label="#5">
                                            <UInputNumber v-model="studentScoreModel.PT5_Second" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                        </UFormField>
                                    </div>  
                                    <div class="grid grid-rows-5 md:grid-rows-1! md:grid-cols-5 gap-4">      
                                        <UFormField label="#6">
                                            <UInputNumber v-model="studentScoreModel.PT6_Second" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                        </UFormField>
                                        <UFormField label="#7">
                                            <UInputNumber v-model="studentScoreModel.PT7_Second" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                        </UFormField>
                                        <UFormField label="#8">
                                            <UInputNumber v-model="studentScoreModel.PT8_Second" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                        </UFormField>
                                        <UFormField label="#9">
                                            <UInputNumber v-model="studentScoreModel.PT9_Second" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                        </UFormField>
                                        <UFormField label="#10">
                                            <UInputNumber v-model="studentScoreModel.PT10_Second" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                        </UFormField>                                
                                    </div>
                                </div>
                            </div>
                        </template>
                    </UAccordion>
                    <UAccordion 
                        class="mb-2" 
                        :items="[{label: 'Exam'}]"
                        :ui="{
                            label: 'text-xl text-highlighted font-semibold'
                        }"
                    >
                        <template #body>
                            <div class="border-s border-default ms-3 ps-4 md:ms-5 md:ps-5">                        
                                <UFormField label="Exam">
                                    <UInputNumber v-model="studentScoreModel.Exam_First" :min="0" :max="100" placeholder="Enter score" size="xl"/>
                                </UFormField>
                            </div>
                        </template>
                    </UAccordion>
                </div>  
            </template>
        </UAccordion>
        <UButton :loading="isLoading"  :disabled="isLoading" type="submit" label="Save" class="mt-6" size="xl"/>
    </UForm>    
</template>