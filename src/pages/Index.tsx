
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import RiskAssessmentForm from '@/components/RiskAssessmentForm';
import Dashboard from '@/components/Dashboard';
import ReportsSection from '@/components/ReportsSection';

const Index = () => {
  const [activeTab, setActiveTab] = useState('assessment');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'assessment' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                AI Risk Assessment Platform
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Help us build safer AI systems by reporting your experiences with AI tools. 
                Your feedback contributes to improving AI trustworthiness, transparency, and accountability.
              </p>
            </div>
            <RiskAssessmentForm />
          </div>
        )}
        
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Real-Time Risk Dashboard
              </h2>
              <p className="text-lg text-muted-foreground">
                Live insights and analytics from AI risk assessments
              </p>
            </div>
            <Dashboard />
          </div>
        )}
        
        {activeTab === 'reports' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Automated Reporting System
              </h2>
              <p className="text-lg text-muted-foreground">
                Generate, export, and distribute AI risk assessment reports
              </p>
            </div>
            <ReportsSection />
          </div>
        )}
      </div>
      
      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-muted-foreground">
              AI Risk Assessment Platform - Building Safer AI Through Data-Driven Insights
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Powered by real-time analytics and automated reporting
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
