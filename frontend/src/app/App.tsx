import { FinchAppLayout } from '@blueskyproject/finch';
import type { RouteItem } from '@blueskyproject/finch';
import ComponentsPage from './pages/ComponentsPage';

import { HouseIcon } from '@phosphor-icons/react';

export default function App() {
  const routes: RouteItem[] = [
    {
      element: <ComponentsPage />,
      path: '/',
      label: 'Test',
      icon: <HouseIcon size={32} />,
      isBackgroundTransparent: false,  
    },
  ];

  return (
      <FinchAppLayout
        routes={routes}
        headerTitle="Bluesky Web"
      />
  );
};

