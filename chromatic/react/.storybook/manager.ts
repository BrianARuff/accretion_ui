import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'Accretion UI React (v18+ / v19+)',
    brandUrl: 'https://www.npmjs.com/package/@accretion_ui/react'
  })
});
