<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui';
import { useCollection } from 'vuefire';
import { studentsRef } from '@/firebase';
import { DocumentData } from 'firebase/firestore';
import { useTemplateRef } from 'vue';

const { data, error, pending } = useCollection(studentsRef)

const tableColumn: TableColumn<DocumentData>[] = [
  { accessorKey: 'lastname', header: 'Last Name', cell: ({ row }) => row.getValue('lastname') },
  { accessorKey: 'firstname', header: 'First Name', cell: ({ row }) => row.getValue('firstname') },
  { accessorKey: 'middlename', header: 'Middle Name', cell: ({ row }) => row.getValue('middlename') },
  { accessorKey: 'age', header: 'Age', cell: ({ row }) => row.getValue('age') },
];

const table = useTemplateRef('table');

</script>

<template>
  <AuthenticatedLayout>
    <h1 class="text-3xl sm:text-4xl text-pretty font-bold text-highlighted mb-4">Students</h1>

    <div class="flex items-center justify-between gap-2 px-4 py-3.5 overflow-x-auto">
      <UInput :model-value="(table?.tableApi?.getColumn('lastname')?.getFilterValue() as string)"
        class="max-w-sm min-w-[12ch]" placeholder="Filter Last Names..."
        @update:model-value="table?.tableApi?.getColumn('lastname')?.setFilterValue($event)" />

      <UModal title="Add Student">
        <UButton label="Add Student" />
      </UModal>
    </div>
    <div class="border border-muted relative z-[1] rounded-md ">
      <UTable
        ref="table"
        :data="data"
        :columns="tableColumn"
        :loading="pending"
        :error="error" />
    </div>
  </AuthenticatedLayout>
</template>