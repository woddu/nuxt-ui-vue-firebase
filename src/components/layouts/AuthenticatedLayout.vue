
<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';
import { ref } from 'vue';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';

defineProps({
  progress: {
    type: Boolean,
    default: false
  }
})

const auth = getAuth();
const router = useRouter();

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

const navItems = ref<NavigationMenuItem[]>([
  { label: 'Dashboard', to: '/' , onSelect: () => { isSidebarOpen.value = false; } },
  { label: 'Students', to: '/students', onSelect: () => { isSidebarOpen.value = false; } },
  { label: 'Sections', to: '/sections', onSelect: () => { isSidebarOpen.value = false; } },
]);


const isSidebarOpen = ref(false);

</script>

<template>
    <div class="layout">
      <UProgress class="fixed top-0 left-0 right-0 z-50" v-if="progress" />

      <!-- floating button with bars icon on top right for mobile -->
      <div class="floating-button">
        <UButton
          class="rounded-full p-2"
          icon="mdi-menu"
          @click="isSidebarOpen = !isSidebarOpen" />
      </div>


      <div class="sidebar" :class="{ active: isSidebarOpen }">
        
        <div class="relative rounded-lg overflow-hidden bg-default ring ring-default  divide-default h-full p-4 sm:p-6">
          <UNavigationMenu
            orientation="vertical"            
            :items="navItems" 
            :ui="{
              item: 'mx-1',  
              link: 'text-md'
            }"/>
          
          <UButton
            class="absolute bottom-4 sm:bottom-6"
            label="Logout"
            size="xl"
            @click="handleLogout" />
          
        </div>
        
      </div>

      <div class="main-content">

        <UContainer>
          <slot />
        </UContainer>
      </div>
    </div>
</template>


<style scoped>

.layout {
  display: flex;
  min-height: 100vh;
}

/* Sidebar styles */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100vh; /* Full viewport height */
  width: 250px;
  padding: .75rem;
  flex-shrink: 0;
  transition: transform 0.3s ease-in-out;
}

/* Main content */
.main-content {
  margin-left: 230px; /* Same as sidebar width */
  max-width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
  flex: 1;
  padding: 2rem;
}

.floating-button {
  opacity: 0;
  z-index: -1;
}

/* Responsive rules */
@media (max-width: 991px) {

  .floating-button {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 1000;
    opacity: 1;
  }

  .dashboard {
    flex-direction: column;
  }

  .sidebar {
    position: absolute;
    /* top: 0;
    left: 0;
    height: 100vh; */
    transform: translateX(-100%);
    z-index: 1000; 
    background-color: rgba(255, 255, 255, 0.0); /* semi-transparent */
    backdrop-filter: blur(0); /* blur effect */
    -webkit-backdrop-filter: blur(0); /* Safari support */
    
  }

  .sidebar.active {
    transform: translateX(0);
  }

  .main-content {
    margin-left: 0px; /* Same as sidebar width */
    padding: 1rem;
  }
}


</style>