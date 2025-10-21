import { Teacher } from '@/interfaces';
import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', () => {
  const user = ref<Teacher | null>(null);

  function setUser(newUser: Teacher | null) {
    user.value = newUser;
  }

  return {
    user,
    setUser
  };
});