import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { PwaInstallModal } from '../common/PwaInstallModal';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-ivory text-charcoal">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <PwaInstallModal />
    </div>
  );
};
