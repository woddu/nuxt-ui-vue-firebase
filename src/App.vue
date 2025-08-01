
<script setup lang="ts">
import { RouterView } from 'vue-router';
import type { NavigationMenuItem } from '@nuxt/ui';
import { ref } from 'vue';

const navItems = ref<NavigationMenuItem[]>([
  { label: 'Home', to: '/' , onSelect: () => { isSidebarOpen.value = false; } },
  { label: 'Students', to: '/students', onSelect: () => { isSidebarOpen.value = false; } },
  { label: 'Contact', to: '/contact', onSelect: () => { isSidebarOpen.value = false; } },
]);

const isSidebarOpen = ref(false);

</script>

<template>
  <UApp>

    <div class="layout">
      
      <!-- floating button with bars icon on top right for mobile -->
      <div class="floating-button">
        <UButton
          class="rounded-full p-2"
          icon="mdi-menu"
          @click="isSidebarOpen = !isSidebarOpen" />
      </div>


      <div class="sidebar" :class="{ active: isSidebarOpen }">
        <UCard class="h-full">
          <UNavigationMenu  orientation="vertical" variant="link" :items="navItems" />
        </UCard>
      </div>

      <div class="main-content">

        <UContainer>
          <RouterView />
        </UContainer>
      </div>
    </div>
  </UApp>
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
  padding: 1rem;
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
@media (max-width: 768px) {

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