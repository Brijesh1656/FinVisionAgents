import React from 'react';
import { LogoIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="w-full p-4 border-b border-border shadow-lg bg-surface/50 sticky top-0 z-10 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex items-center space-x-3">
        <LogoIcon className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-xl font-bold text-gray-100">FinVision-Agents</h1>
          <p className="text-sm text-subtle">AI-Powered Financial Analysis</p>
        </div>
      </div>
    </header>
  );
};