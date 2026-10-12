import React from 'react';
import { Outlet } from 'react-router-dom';
import { DashboardSidebar } from '../components/common/DashboardSidebar';
import { DashboardHeader } from '../components/common/DashboardHeader';

export interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="h-screen w-screen bg-light-surface dark:bg-dark-bg font-sans flex text-primary-dark dark:text-white transition-colors duration-300 overflow-hidden">
      {/* RETRACTABLE SIDEBAR */}
      <DashboardSidebar />

      {/* MAIN LAYOUT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden transition-all duration-300">
        {/* DASHBOARD HEADER */}
        <DashboardHeader />

        {/* PAGE CONTENT CONTAINER */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-h-0 scroll-smooth">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};
