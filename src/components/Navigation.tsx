
import React from 'react';
import { Button } from '@/components/ui/button';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Risk Assessment Platform
              </h1>
            </div>
            <div className="flex space-x-4">
              <Button
                variant={activeTab === 'assessment' ? 'default' : 'ghost'}
                onClick={() => onTabChange('assessment')}
                className={activeTab === 'assessment' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''}
              >
                Submit Assessment
              </Button>
              <Button
                variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
                onClick={() => onTabChange('dashboard')}
                className={activeTab === 'dashboard' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''}
              >
                Dashboard
              </Button>
              <Button
                variant={activeTab === 'reports' ? 'default' : 'ghost'}
                onClick={() => onTabChange('reports')}
                className={activeTab === 'reports' ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''}
              >
                Reports
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Real-time Risk Monitoring
            </span>
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
