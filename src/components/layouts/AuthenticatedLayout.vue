
<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';
import { computed, ref } from 'vue';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

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

const handleLogout = async () => {
  await signOut(auth)
  .then(() => {
    console.log('User logged out successfully');
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
  { label: 'Dashboard', to: '/', role: 'admin' },
  { label: 'Students', to: '/students', role: 'admin' },
  { label: 'Sections', to: '/sections', role: 'admin' },
  { label: 'Advisories', to: '/advisories', role: 'teacher' },
]);

const filteredNavItems = computed<AppNavigationMenuItem[]>(() => {
  if (!userStore.user) return [];
  return navItems.value.filter(item => !item.role || item.role === userStore.user?.role);
});


</script>

<template>
    <UDashboardGroup>
    <UProgress class="fixed top-0 left-0 right-0 z-50 h-1!" v-if="progress" />
      <UDashboardSidebar collapsible :ui="{ footer: 'border-t border-default' }">
        
        <template #header>
          <div class="p-4 font-bold">LMS</div>
        </template>

        <template #toggle>
          <UDashboardSidebarToggle variant="subtle" />
        </template>

        <UNavigationMenu
          orientation="vertical"            
          :items="filteredNavItems" 
          :ui="{
            item: 'mx-1',  
            link: 'text-md'
          }"/>
        
        <template #footer>

          <UButton
            class="w-full"
            label="Logout"
            size="xl"
            @click="handleLogout" 
            color="neutral"
            variant="ghost"/>
        </template>
            
      </UDashboardSidebar>

      <UDashboardPanel>
        <template #header>
          <UDashboardNavbar>
            <template #title>
              <h1 
              class="text-2xl sm:text-3xl text-pretty font-bold text-highlighted">
                  {{ title }}
              </h1>
            </template>
            <template #toggle>
              <UDashboardSidebarToggle variant="subtle" />
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


