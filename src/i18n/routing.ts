import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['ar'], // Disabled Turkish temporarily: 'tr'
  defaultLocale: 'ar',
  localePrefix: 'as-needed', // Arabic will run at `/`, Turkish at `/tr`
});

export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);
