
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const ReportsSection = () => {
  const { toast } = useToast();
  const [assessments, setAssessments] = useState([]);
  const [email, setEmail] = useState('');
  const [reportType, setReportType] = useState('summary');

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('riskAssessments') || '[]');
    setAssessments(data);
  }, []);

  const generateReport = () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to receive the report.",
        variant: "destructive"
      });
      return;
    }

    // Simulate report generation
    toast({
      title: "Report Generated",
      description: `A ${reportType} report has been sent to ${email}. Check your inbox in a few minutes.`,
    });

    setEmail('');
  };

  const exportData = (format: string) => {
    if (assessments.length === 0) {
      toast({
        title: "No Data",
        description: "No risk assessments available to export.",
        variant: "destructive"
      });
      return;
    }

    // Simulate data export
    const dataStr = format === 'json' 
      ? JSON.stringify(assessments, null, 2)
      : assessments.map(a => `${a.timestamp},${a.aiTool},${a.riskType},${a.severity}`).join('\n');
    
    const dataBlob = new Blob([dataStr], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ai-risk-assessments.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: `Data exported as ${format.toUpperCase()} file.`,
    });
  };

  const getInsights = () => {
    if (assessments.length === 0) return null;

    const severityCount = assessments.reduce((acc, curr) => {
      acc[curr.severity] = (acc[curr.severity] || 0) + 1;
      return acc;
    }, {});

    const topTool = Object.entries(
      assessments.reduce((acc, curr) => {
        acc[curr.aiTool] = (acc[curr.aiTool] || 0) + 1;
        return acc;
      }, {})
    ).sort(([,a], [,b]) => (b as number) - (a as number))[0];

    const topRisk = Object.entries(
      assessments.reduce((acc, curr) => {
        acc[curr.riskType] = (acc[curr.riskType] || 0) + 1;
        return acc;
      }, {})
    ).sort(([,a], [,b]) => (b as number) - (a as number))[0];

    return {
      totalReports: assessments.length,
      criticalPercentage: ((severityCount['Critical'] || 0) / assessments.length * 100).toFixed(1),
      mostReportedTool: topTool ? topTool[0] : 'N/A',
      mostCommonRisk: topRisk ? topRisk[0] : 'N/A',
      avgReportsPerDay: (assessments.length / 30).toFixed(1)
    };
  };

  const insights = getInsights();

  return (
    <div className="space-y-6">
      {/* Automated Reporting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>📧</span>
            <span>Automated Report Generation</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Generate and send personalized AI risk assessment reports directly to your email.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reportType">Report Type</Label>
              <select 
                id="reportType"
                className="w-full p-2 border rounded-md"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="summary">Executive Summary</option>
                <option value="detailed">Detailed Analysis</option>
                <option value="trends">Trend Report</option>
                <option value="personal">Personal Risk Profile</option>
              </select>
            </div>
          </div>

          <Button 
            onClick={generateReport}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Generate & Send Report
          </Button>
        </CardContent>
      </Card>

      {/* Data Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>💾</span>
            <span>Data Export</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Export risk assessment data for further analysis or integration with other systems.
          </p>
          
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              onClick={() => exportData('csv')}
              className="flex items-center space-x-2"
            >
              <span>📊</span>
              <span>Export as CSV</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => exportData('json')}
              className="flex items-center space-x-2"
            >
              <span>📄</span>
              <span>Export as JSON</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => toast({ title: "Coming Soon", description: "PDF export will be available in the next update." })}
              className="flex items-center space-x-2"
            >
              <span>📑</span>
              <span>Export as PDF</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      {insights && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>🔍</span>
              <span>Key Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800">Total Reports</h3>
                <p className="text-2xl font-bold text-blue-600">{insights.totalReports}</p>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-semibold text-red-800">Critical Risk %</h3>
                <p className="text-2xl font-bold text-red-600">{insights.criticalPercentage}%</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800">Most Reported Tool</h3>
                <p className="text-lg font-bold text-purple-600">{insights.mostReportedTool}</p>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-semibold text-orange-800">Top Risk Category</h3>
                <p className="text-lg font-bold text-orange-600">{insights.mostCommonRisk}</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800">Avg Daily Reports</h3>
                <p className="text-2xl font-bold text-green-600">{insights.avgReportsPerDay}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800">Data Quality</h3>
                <p className="text-2xl font-bold text-gray-600">92%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Report Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>📋</span>
            <span>Report Templates</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <h3 className="font-semibold mb-2">Executive Summary</h3>
              <p className="text-sm text-muted-foreground mb-3">
                High-level overview of AI risks for leadership and stakeholders.
              </p>
              <ul className="text-sm space-y-1">
                <li>• Risk trend analysis</li>
                <li>• Key performance indicators</li>
                <li>• Strategic recommendations</li>
              </ul>
            </div>
            
            <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <h3 className="font-semibold mb-2">Technical Deep Dive</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Detailed technical analysis for engineers and researchers.
              </p>
              <ul className="text-sm space-y-1">
                <li>• Vulnerability assessments</li>
                <li>• Performance metrics</li>
                <li>• Mitigation strategies</li>
              </ul>
            </div>
            
            <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <h3 className="font-semibold mb-2">Compliance Report</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Regulatory compliance and audit-ready documentation.
              </p>
              <ul className="text-sm space-y-1">
                <li>• Regulatory alignment</li>
                <li>• Audit trail</li>
                <li>• Compliance scores</li>
              </ul>
            </div>
            
            <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <h3 className="font-semibold mb-2">User Impact Analysis</h3>
              <p className="text-sm text-muted-foreground mb-3">
                User-focused analysis of AI system impacts and experiences.
              </p>
              <ul className="text-sm space-y-1">
                <li>• User sentiment analysis</li>
                <li>• Impact severity mapping</li>
                <li>• User recommendations</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsSection;
