<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';
import { computed, ref } from 'vue';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useSubjectStore } from '@/stores/subject';
import { useSectionStore } from '@/stores/sections';

defineProps({
  progress: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Dashboard'
  }
})

const auth = getAuth();

const router = useRouter();

const userStore = useUserStore();

const subjectStore = useSubjectStore();

const sectionStore = useSectionStore();

const handleLogout = async () => {
  await signOut(auth)
    .then(() => {
      userStore.clearUser();
      subjectStore.stop();
      sectionStore.stop();
      router.push('/login');
    })
    .catch((error) => {
      console.error('Error logging out:', error);
    });
}

interface AppNavigationMenuItem extends Omit<NavigationMenuItem, 'children'> {
  role?: string;
  children?: AppNavigationMenuItem[];
}

const navItems = ref<AppNavigationMenuItem[]>([
  { icon: 'i-lucide-layout-dashboard', label: 'Dashboard', to: '/', role: 'admin' },
  { icon: 'i-lucide-users-round', label: 'Teachers', to: '/teachers', role: 'admin', children: [
    { label: 'Add', to: '/teachers/add' }
  ]},
  { icon: 'i-lucide-users', label: 'Students', to: '/students', role: 'admin', children: [
    { label: 'Add', to: '/students/add' }
  ]},
  { icon: 'i-lucide-layers', label: 'Sections', to: '/sections', role: 'admin' },
  { icon: 'i-lucide-book', label: 'Subjects', to: '/subjects', role: 'admin' },
  { icon: 'i-lucide-layers', label: 'Advisories', to: '/advisories', role: 'teacher' },
  { icon: 'i-lucide-book', label: 'Subjects', to: '/mysubjects', role: 'teacher' },
]);

const filteredNavItems = computed<AppNavigationMenuItem[]>(() => {
  if (!userStore.user) return [];
  return navItems.value.filter(item => !item.role || item.role === userStore.user?.role);
});


</script>

<template>  
  <UDashboardGroup>
      <UProgress class="fixed top-0 left-0 right-0 z-50 h-1!" v-if="progress" />
      <UDashboardSidebar 
        class="bg-elevated/25"
        collapsible 
        :ui="{ footer: 'border-t border-default' }">

        <template #header>
          <div class="text-lg px-4 font-bold">LMS</div>
        </template>

        <template #toggle>
          <UDashboardSidebarToggle variant="subtle" />
        </template>

        <UNavigationMenu orientation="vertical" :items="filteredNavItems" :ui="{
          item: 'mx-1',
          link: 'text-md'
        }" />

        <template #footer>

          <UButton
            class="w-full"
            label="Logout"
            size="xl"
            @click="handleLogout"
            color="neutral"
            variant="ghost" 
            icon="i-lucide-log-out"/>
        </template>

      </UDashboardSidebar>

      <UDashboardPanel>
        <template #header>
          <UDashboardNavbar>
            <template #title>
              <h1 class="text-2xl sm:text-3xl text-pretty font-bold text-highlighted">
                {{ title }}
              </h1>
            </template>
            <template #toggle>
              <UDashboardSidebarToggle variant="subtle" />
            </template>
            <template #right>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-circle-user-round" class="size-6"/>
                <UUser
                  :name="userStore.user?.username"
                  :description="userStore.user?.role" />
              </div>
            </template>
          </UDashboardNavbar>
        </template>


        <template #body>
          <UContainer>
            <slot />
          </UContainer>
        </template>

      </UDashboardPanel>
    </UDashboardGroup>  
</template>

<style>
.bg-elevated,.bg-elevated\/25 {
  background-color: var(--ui-bg-elevated)
}

@supports (color: color-mix(in lab,red,red)) {
  .bg-elevated\/25 {
      background-color:color-mix(in oklab,var(--ui-bg-elevated)25%,transparent);
  }
}
</style>