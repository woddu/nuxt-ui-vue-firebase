import 'vue-router';

import { Role } from '@/interfaces';

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    requiresVerified?: boolean;
    roles?: Role[];
  }
}
