
import { useState } from "react";
import Navigation from "@/components/Navigation";
import RiskAssessmentForm from "@/components/RiskAssessmentForm";
import BlackThemeDashboard from "@/components/BlackThemeDashboard";
import EnhancedReportsSection from "@/components/EnhancedReportsSection";

const Index = () => {
  const [activeTab, setActiveTab] = useState("form");

  const renderActiveTab = () => {
    switch (activeTab) {
      case "form":
        return <RiskAssessmentForm />;
      case "dashboard":
        return <BlackThemeDashboard />;
      case "reports":
        return <EnhancedReportsSection />;
      default:
        return <RiskAssessmentForm />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="pt-16">
        {renderActiveTab()}
      </main>
    </div>
  );
};

export default Index;
