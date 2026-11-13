import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { HabitTrackerCore } from '../../components/habits/HabitTrackerCore';

interface DashboardOutletContext {
  onOpenMobileMenu?: () => void;
}

export const HabitTrackerPage: React.FC = () => {
  const context = useOutletContext<DashboardOutletContext | undefined>();

  return (
    <HabitTrackerCore
      mode="dashboard"
      onOpenMobileMenu={context?.onOpenMobileMenu}
    />
  );
};
