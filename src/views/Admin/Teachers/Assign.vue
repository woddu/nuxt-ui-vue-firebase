<script setup lang="ts">
import { useSubjectsByTeacher } from '@/composables/useSubjects';
import { useTeacherById } from '@/composables/useTeachers';
import { Section, Subject } from '@/interfaces';
import { setAdvisoryTeacher, removeAdvisoryTeacher } from '@/services/sectionService';
import { addSectionSubject } from '@/services/sectionSubjectService';
import { addSubjectTeacher } from '@/services/subjectTeacherService';
import { useSectionStore } from '@/stores/sections';
import { useSubjectStore } from '@/stores/subject';
import { columnCapitalize } from '@/views/util';
import { SelectMenuItem, TableColumn } from '@nuxt/ui';
import { DocumentData } from 'firebase/firestore';
import { h, onMounted, resolveComponent } from 'vue';
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const emit = defineEmits<{
  (e: 'loading', value: boolean): void
}>()

const UButton = resolveComponent('UButton');

const toast = useToast()

const showAssignSubjectModal = ref(false);
const showAssignSectionModal = ref(false);
const showAssignAdvisoryModal = ref(false);
const showDeleteAdvisoryModal = ref(false);

const isLoading = ref(false);

const router = useRouter();

const teacherDoc = useTeacherById(router.currentRoute.value.params.id as string);

const subjectsOfTeacher = useSubjectsByTeacher(router.currentRoute.value.params.id as string);


const subjectStore = useSubjectStore();
const subjects = subjectStore.subjects();
const sectionsStore = useSectionStore();
const sections = sectionsStore.sections();

const availableSubjects = computed(() => {
  if (subjects?.pending.value) return []
  return (
    subjects?.data.value?.filter(
      (s: Subject) => !s.teacherIds.includes(router.currentRoute.value.params.id as string)
    ) ?? []
  )
})



const grouped = computed(() => {
  if (!subjectsOfTeacher.data.value || !sections.data.value) {
    return []
  }

  return subjectsOfTeacher.data.value.map((subject: Subject) => {
    const relatedSections = sections.data.value.filter(
      (section: Section) =>
        (section.subjectIds ?? []).includes(subject.id)
    )
    console.log
    return { subject, sections: relatedSections }
  })
})


const groupedPending = computed(() =>
  teacherDoc.pending.value ||
  subjectsOfTeacher.pending.value
)

const groupedError = computed(() =>
  teacherDoc.error.value ||
  subjectsOfTeacher.error.value 
)

const teacherSubjectTableColumn: TableColumn<DocumentData>[] = [
  {
    header: 'Subject',
    accessorFn: (row) => row.subject.name, // directly return the primitive
    cell: (info) => info.getValue()        // already the string
  },
  {
    header: 'Sections',
    accessorFn: (row) => row.sections,     // return the array
    cell: (info) => {
      const sections = info.getValue() as Section[];
      return sections.map(s => s.name).join(', ');
    }
  },{
    id: 'actions',
    enableHiding: false,
    cell: (info) => {
      return h(UButton, {
        label: 'Assign Section',
        variant: 'soft',
        size: 'xl',
        onClick: () => {
          selectedSubject.value = info.row.original.subject.id;
          showAssignSectionModal.value = true;
        }
      })
    }      
  }
]

const availableSubjectsItems = computed<SelectMenuItem[]>(() => {
  return availableSubjects.value.map((s: Subject) => ({
    id: s.id,
    label: s.name,   // what the user sees
  } as SelectMenuItem))
})

const selectedSubject = ref<string | null>(null);

const selectedSubjectItem = computed(() => {
  if (!selectedSubject.value || !availableSubjects.value?.length) return null
  return subjects.value.find(s => s.id === selectedSubject.value) || null
})


/* For multi-selecting subjects to assign to teacher 
const selectedSubjectIds = ref<{
  id: string;
  label: string;
  value: string;
}[]>([])

const selectedSubjectNames = computed(() => {
  if (!availableSubjects.value?.length) return []
  const ids = selectedSubjectIds.value.map(item => item.id)
  return availableSubjects.value
    .filter(s => ids.includes(s.id))
    .map(s => s.name)
}) */


function assignSubject() {
  isLoading.value = true;

  addSubjectTeacher(
    selectedSubject.value as string,
    router.currentRoute.value.params.id as string
  ).then(() => {
    toast.add({ title: 'Success', description: `Subject: ${selectedSubjectItem.value?.name} assigned successfully.`, color: 'success' })
    showAssignSubjectModal.value = false;
    selectedSubject.value = null;
  }).catch((error) => {
    toast.add({ title: 'Error', description: `Failed to assign subject to teacher: ${error.message}`, color: 'error' });
  }).finally(() => {
    isLoading.value = false;
  });
}


const availableSections = computed(() => {
  if (
    sections.pending.value ||
    subjects.pending.value ||
    !availableSubjects.value.length ||
    !selectedSubject.value
  )
    return [];

  const subject = subjects.data.value?.find(
    (s: Subject) => s.id === selectedSubject.value
  );
  if (!subject) return [];

  // Define allowed strands per track
  const trackStrandMap: Record<string, (strand: string) => boolean> = {
    "Core Subject (All Tracks)": () => true, // all strands allowed

    "Academic Track (except Immersion)": (strand: string) =>
      ["STEM", "ABM", "HUMSS", "GAS"].includes(strand),

    "TVL/ Sports/ Arts and Design Track": (strand: string) =>
      ["TVL", "Sports", "Arts and Design"].includes(strand),

    "Work Immersion/ Culminating Activity (for Academic Track)": (strand: string) =>
      ["STEM", "ABM", "HUMSS", "GAS"].includes(strand),
  };

  const isStrandAllowed =
    trackStrandMap[subject.track] ?? (() => false); // fallback: disallow if unknown

  return (
    sections.data.value?.filter(
      (section: Section) =>
        !(section.subjectIds ?? []).includes(subject.id) &&
        isStrandAllowed(section.strand)
    ) ?? []
  );
});


const availableSectionsItems = computed<SelectMenuItem[]>(() => {
  return availableSections.value.map((s: Section) => ({
    id: s.id,
    label: s.name,   // what the user sees
  } as SelectMenuItem))
})

const selectedSection = ref<string | null>(null);

const selectedSectionItem = computed(() => {
  if (!selectedSection.value || !availableSections.value?.length) return null
  return availableSections.value.find(s => s.id === selectedSection.value) || null
})

function assignSection() {
  isLoading.value = true;

  addSectionSubject(
    selectedSectionItem.value as Section,
    selectedSubject.value as string,
    router.currentRoute.value.params.id as string
  ).then(() => {
    toast.add({ title: 'Success', description: `Section: ${selectedSectionItem.value?.name} assigned successfully.`, color: 'success' })
    selectedSection.value = null;
    selectedSubject.value = null;
    showAssignSectionModal.value = false;
  }).catch((error) => {
    toast.add({ title: 'Error', description: `Failed to assign section to subject: ${error.message}`, color: 'error' });
  }).finally(() => {
    isLoading.value = false;
  });
}

const advisories = computed(() => {
  if (sections.pending.value || !sections.data.value) return [];
  return sections.data.value
  .filter((section: Section) => section.adviserId)
  .filter((section: Section) => section.adviserId == router.currentRoute.value.params.id) ?? [];
});

const advisoriesTableColumn: TableColumn<DocumentData>[] = [
  columnCapitalize('name'),
  {
    id: 'actions',
    enableHiding: false,
    cell: (info) => {
      return h(UButton, {
        icon: 'i-lucide-trash',
        variant: 'soft',
        color: 'error',
        size: 'xl',
        onClick: () => {
          selectedAdvisory.value = info.row.original.id;
          showAssignSectionModal.value = true;
        }
      })
    }
  }
]

const availableAdvisoriesItems = computed(() =>
  sections.data.value
    ?.filter((section: Section) => !section.adviserId) // keep only those with no adviserId
    .map((section: Section) => {
      return {
        id: section.id,
        label: section.name,
      } as SelectMenuItem
    }) ?? []
)

const selectedAdvisory = ref<string | null>(null);

const selectedAdvisoryItem = computed(() => {
  if (!selectedAdvisory.value || !availableAdvisoriesItems.value?.length) return null
  return sections.value.find(s => s.id === selectedAdvisory.value) || null
})

function assignAdvisory() {
  isLoading.value = true;

  setAdvisoryTeacher(
    selectedAdvisory.value as string,
    router.currentRoute.value.params.id as string
  ).then(() => {
    toast.add({ title: 'Success', description: `Advisory: ${sections.data.value.find(s => s.id === selectedAdvisory.value)?.name} assigned successfully.`, color: 'success' })
    selectedAdvisory.value = null;
    showAssignAdvisoryModal.value = false;
  }).catch((error) => {
    toast.add({ title: 'Error', description: `Failed to assign advisory to teacher: ${error.message}`, color: 'error' });
  }).finally(() => {
    isLoading.value = false;
  });
}

const deleteAdvisory = () => {
  isLoading.value = true;

  removeAdvisoryTeacher(selectedAdvisory.value as string)
  .then(() => {
    toast.add({ title: 'Success', description: `Advisory: ${selectedAdvisoryItem.value?.name} removed successfully.`, color: 'success' })
    selectedAdvisory.value = null;
    showDeleteAdvisoryModal.value = false;
  }).catch((error) => {
    toast.add({ title: 'Error', description: `Failed to remove advisory: ${error.message}`, color: 'error' });
  }).finally(() => {
    isLoading.value = false;
  });
}

watch(isLoading, (newVal) => {
  emit('loading', newVal);
});

onMounted(() => {
  emit('loading', false);
});

watch(groupedPending, () => {
  console.log("")
});

</script>

<template>

  <PageHeaderTitle :title="teacherDoc?.lastName + ', ' + teacherDoc?.firstName + ' ' + (teacherDoc?.middleName ? teacherDoc?.middleName : '')" />

  <div class="flex items-center justify-between gap-2 px-4 py-3.5 overflow-x-auto">
    <h1 class="text-2xl font-medium text-highlighted">
      Assigned Subjects
    </h1>

    <UModal v-model:open="showAssignSubjectModal" title="Assign Subject" description="Assign Subject to Teacher">

      <template #body>
        <UForm class="flex flex-col gap-4" @submit="assignSubject">
          <USelectMenu v-model="selectedSubject" value-key="id" :items="availableSubjectsItems" placeholder="Select Subject" size="xl"/>
          <UButton
              type="submit"
              :loading="isLoading"
              label="Assign Subject"
              size="xl" />
        </UForm>
      </template>

      <UButton
          icon="i-lucide-plus"
          label="Assign Subject"
          size="xl" 
          @click="() => selectedSubject = null"/>
          <!-- @click="addTeacher()" -->
    </UModal>
      
  </div>
  <div class="border border-muted relative z-1 rounded-md mb-1">
    <UTable
      sticky
      :data="grouped"
      :columns="teacherSubjectTableColumn"
      :loading="groupedPending"
      :error="groupedError" />
      <UModal v-model:open="showAssignSectionModal" title="Assign Section" :description="'Assign Section to Subject' + (selectedSubjectItem ? `: ${selectedSubjectItem.name}` : '')">
          <template #body>
            <UForm class="flex flex-col gap-4" @submit="assignSection">
              <USelectMenu v-model="selectedSection" value-key="id" :items="availableSectionsItems" placeholder="Select Section" size="xl"/>
              <UButton
                  type="submit"
                  :loading="isLoading"
                  label="Assign Section"
                  size="xl" />
            </UForm>
          </template>
      </UModal>
  </div>

  <div class="flex items-center justify-between gap-2 px-4 py-3.5 overflow-x-auto">
    <h1 class="text-2xl font-medium text-highlighted">
      Advisories
    </h1>

    <UModal v-model:open="showAssignAdvisoryModal" title="Assign Advisory" description="Assign Advisory to Teacher">
      <template #body>
        <UForm class="flex flex-col gap-4" @submit="assignAdvisory">
          <USelectMenu v-model="selectedAdvisory" value-key="id" :items="availableAdvisoriesItems" placeholder="Select Advisory" size="xl"/>
          <UButton
              type="submit"
              :loading="isLoading"
              label="Assign Advisory"
              size="xl" />
        </UForm>
      </template>
      <UButton 
        icon="i-lucide-plus"
        label="Assign Advisory"
        size="xl" 
        @click="() => selectedAdvisory = null"/>
    </UModal>    
  </div>
  <div class="border border-muted relative z-1 rounded-md">
      <UTable
        sticky
        :data="advisories"
        :columns="advisoriesTableColumn"
        :loading="groupedPending"
        :error="groupedError" />
        <UModal v-model:open="showDeleteAdvisoryModal" title="Remove Advisory" :description="'Remove ' + selectedAdvisoryItem?.name + ' from ' + teacherDoc?.lastName">
          <template #body>
            <p>Are you sure you want to remove this advisory?</p>
          </template>
          <template #footer>
            <UButton :loading="isLoading" loading-icon="i-lucide-loader" :disabled="isLoading" label="Cancel" @click="showDeleteAdvisoryModal = false" size="xl"/>
            <UButton :loading="isLoading" loading-icon="i-lucide-loader" :disabled="isLoading" label="Delete" color="error" @click="deleteAdvisory" size="xl"/>
          </template>
        </UModal>
    </div>

</template>