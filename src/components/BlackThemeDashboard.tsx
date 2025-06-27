
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TrendingUp, AlertTriangle, Shield, Users, Brain, Lightbulb, Target, Zap } from 'lucide-react';
import MitigationDashboard from './MitigationDashboard';

const COLORS = ['#3b82f6', '#8b5cf6', '#ef4444', '#f59e0b', '#10b981', '#f97316', '#06b6d4', '#84cc16'];

const BlackThemeDashboard = () => {
  const [assessments, setAssessments] = useState([]);
  const [strategies, setStrategies] = useState([]);
  const [riskFactors, setRiskFactors] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    critical: 0,
    high: 0,
    thisWeek: 0,
    avgEffectiveness: 0,
    sectorsAnalyzed: 0
  });
  const [selectedRisk, setSelectedRisk] = useState<{ riskType?: string; severity?: string }>({});
  const [showMitigation, setShowMitigation] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [assessmentsRes, strategiesRes, factorsRes] = await Promise.all([
        supabase.from('risk_assessments').select('*').order('created_at', { ascending: false }),
        supabase.from('mitigation_strategies').select('*').order('effectiveness_score', { ascending: false }),
        supabase.from('risk_factors').select('*').order('frequency_percentage', { ascending: false })
      ]);

      if (assessmentsRes.error) throw assessmentsRes.error;
      if (strategiesRes.error) throw strategiesRes.error;
      if (factorsRes.error) throw factorsRes.error;

      const assessmentsData = assessmentsRes.data || [];
      const strategiesData = strategiesRes.data || [];
      const factorsData = factorsRes.data || [];

      setAssessments(assessmentsData);
      setStrategies(strategiesData);
      setRiskFactors(factorsData);
      
      // Calculate enhanced stats
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const weeklySubmissions = assessmentsData.filter(item => 
        new Date(item.created_at) > oneWeekAgo
      );

      const sectorsAnalyzed = new Set(assessmentsData.map(item => item.ai_tool)).size;
      const avgEffectiveness = strategiesData.length > 0 
        ? strategiesData.reduce((sum, s) => sum + s.effectiveness_score, 0) / strategiesData.length 
        : 0;
      
      setStats({
        total: assessmentsData.length,
        critical: assessmentsData.filter(item => item.severity === 'Critical').length,
        high: assessmentsData.filter(item => item.severity === 'High').length,
        thisWeek: weeklySubmissions.length,
        avgEffectiveness: avgEffectiveness,
        sectorsAnalyzed: sectorsAnalyzed
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Process data for enhanced charts
  const severityData = assessments.reduce((acc, curr) => {
    acc[curr.severity] = (acc[curr.severity] || 0) + 1;
    return acc;
  }, {});

  const severityChartData = Object.entries(severityData).map(([key, value]) => ({
    name: key,
    value: value as number,
    percentage: ((value as number) / assessments.length * 100).toFixed(1)
  }));

  const toolData = assessments.reduce((acc, curr) => {
    acc[curr.ai_tool] = (acc[curr.ai_tool] || 0) + 1;
    return acc;
  }, {});

  const toolChartData = Object.entries(toolData)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 10)
    .map(([key, value]) => ({
      name: key.length > 20 ? key.substring(0, 20) + '...' : key,
      value: value as number,
      risk_level: assessments.filter(a => a.ai_tool === key).length > 5 ? 'High' : 'Medium'
    }));

  const riskTypeData = assessments.reduce((acc, curr) => {
    acc[curr.risk_type] = (acc[curr.risk_type] || 0) + 1;
    return acc;
  }, {});

  const riskTypeChartData = Object.entries(riskTypeData).map(([key, value]) => ({
    name: key,
    value: value as number,
    severity_avg: assessments.filter(a => a.risk_type === key).reduce((sum, a) => {
      const severityScore = { 'Low': 1, 'Medium': 2, 'High': 3, 'Critical': 4 }[a.severity] || 0;
      return sum + severityScore;
    }, 0) / (value as number)
  }));

  // Enhanced sector analysis
  const sectorAnalysis = riskFactors.reduce((acc, curr) => {
    const sector = curr.risk_type;
    const existing = acc.find(item => item.sector === sector);
    if (existing) {
      existing.frequency += curr.frequency_percentage;
      existing.count += 1;
    } else {
      acc.push({
        sector: sector,
        frequency: curr.frequency_percentage,
        count: 1,
        avgFrequency: curr.frequency_percentage
      });
    }
    return acc;
  }, []).map(item => ({
    ...item,
    avgFrequency: item.frequency / item.count
  }));

  const handleRiskClick = (riskType: string, severity?: string) => {
    setSelectedRisk({ riskType, severity });
    setShowMitigation(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-gray-800/50 border-gray-700 animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-gray-700 rounded mb-4 w-3/4"></div>
                <div className="h-32 bg-gray-700 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (showMitigation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Button 
            variant="outline" 
            onClick={() => setShowMitigation(false)}
            className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700 mb-6"
          >
            ← Back to Analytics Dashboard
          </Button>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <MitigationDashboard 
              selectedRiskType={selectedRisk.riskType} 
              selectedSeverity={selectedRisk.severity}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            AI Risk Intelligence Platform
          </h1>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto">
            Advanced analytics and comprehensive risk assessment dashboard powered by machine learning insights
          </p>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-300 text-sm font-medium">Total Risk Assessments</p>
                  <p className="text-4xl font-bold text-white">{stats.total}</p>
                  <p className="text-blue-200 text-xs mt-1">Comprehensive analysis completed</p>
                </div>
                <div className="h-12 w-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <BarChart className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-600/20 to-red-800/20 border-red-500/30 backdrop-blur-sm cursor-pointer hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300">
            <CardContent className="p-6" onClick={() => handleRiskClick('', 'Critical')}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-300 text-sm font-medium">Critical Risk Cases</p>
                  <p className="text-4xl font-bold text-white">{stats.critical}</p>
                  <p className="text-red-200 text-xs mt-1">Require immediate attention</p>
                </div>
                <div className="h-12 w-12 bg-red-500/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 border-orange-500/30 backdrop-blur-sm cursor-pointer hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300">
            <CardContent className="p-6" onClick={() => handleRiskClick('', 'High')}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-300 text-sm font-medium">High Risk Cases</p>
                  <p className="text-4xl font-bold text-white">{stats.high}</p>
                  <p className="text-orange-200 text-xs mt-1">Monitor closely</p>
                </div>
                <div className="h-12 w-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-600/20 to-green-800/20 border-green-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-300 text-sm font-medium">Weekly Reports</p>
                  <p className="text-4xl font-bold text-white">{stats.thisWeek}</p>
                  <p className="text-green-200 text-xs mt-1">Recent activity</p>
                </div>
                <div className="h-12 w-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Target className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-purple-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-300 text-sm font-medium">Avg Effectiveness</p>
                  <p className="text-4xl font-bold text-white">{stats.avgEffectiveness.toFixed(1)}</p>
                  <p className="text-purple-200 text-xs mt-1">Mitigation strategies</p>
                </div>
                <div className="h-12 w-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-600/20 to-cyan-800/20 border-cyan-500/30 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyan-300 text-sm font-medium">AI Tools Analyzed</p>
                  <p className="text-4xl font-bold text-white">{stats.sectorsAnalyzed}</p>
                  <p className="text-cyan-200 text-xs mt-1">Comprehensive coverage</p>
                </div>
                <div className="h-12 w-12 bg-cyan-500/20 rounded-full flex items-center justify-center">
                  <Brain className="h-6 w-6 text-cyan-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mitigation Center */}
        <Card className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border-indigo-500/30 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-indigo-400 mr-3" />
              <h3 className="text-2xl font-bold text-white">Advanced Risk Mitigation Center</h3>
            </div>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Access comprehensive mitigation strategies, predictive analytics, and AI-powered risk factor analysis 
              to proactively address emerging threats and vulnerabilities.
            </p>
            <Button 
              onClick={() => setShowMitigation(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold"
            >
              <Lightbulb className="h-5 w-5 mr-2" />
              Launch Mitigation Intelligence
            </Button>
          </CardContent>
        </Card>

        {/* Enhanced Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Severity Distribution */}
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-yellow-400" />
                Risk Severity Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={severityChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {severityChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* AI Tools Analysis */}
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Brain className="h-5 w-5 mr-2 text-blue-400" />
                AI Tools Risk Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={toolChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={11}
                    stroke="#9CA3AF"
                  />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '6px',
                      color: '#F3F4F6'
                    }}
                  />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Risk Categories */}
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Target className="h-5 w-5 mr-2 text-purple-400" />
                Risk Categories Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={riskTypeChartData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" stroke="#9CA3AF" />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={140}
                    fontSize={11}
                    stroke="#9CA3AF"
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '6px',
                      color: '#F3F4F6'
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#8B5CF6" 
                    className="cursor-pointer hover:opacity-80"
                    onClick={(data) => handleRiskClick(data.name)}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Sector Risk Frequency */}
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="h-5 w-5 mr-2 text-green-400" />
                Sector Risk Frequency Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={sectorAnalysis.slice(0, 6)}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="sector" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                  <PolarRadiusAxis tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                  <Radar name="Frequency" dataKey="avgFrequency" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '6px',
                      color: '#F3F4F6'
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Assessments */}
        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Zap className="h-5 w-5 mr-2 text-yellow-400" />
              Recent Risk Assessments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {assessments.length === 0 ? (
              <div className="text-center py-12">
                <Brain className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No risk assessments available yet.</p>
                <p className="text-gray-500 text-sm">Submit your first assessment to begin the analysis!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {assessments.slice(0, 8).map((assessment, index) => (
                  <div 
                    key={assessment.id} 
                    className="bg-gray-700/30 border border-gray-600 rounded-lg p-4 hover:bg-gray-700/50 transition-all duration-300 cursor-pointer hover:shadow-lg"
                    onClick={() => handleRiskClick(assessment.risk_type, assessment.severity)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <Brain className="h-4 w-4 text-blue-400" />
                          <span className="font-medium text-white">{assessment.ai_tool}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          assessment.severity === 'Critical' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                          assessment.severity === 'High' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
                          assessment.severity === 'Medium' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                          'bg-green-500/20 text-green-300 border border-green-500/30'
                        }`}>
                          {assessment.severity}
                        </span>
                      </div>
                      <span className="text-sm text-gray-400">
                        {new Date(assessment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">
                      <span className="font-medium text-purple-300">Risk Type:</span> {assessment.risk_type}
                    </p>
                    {assessment.description && (
                      <p className="text-sm text-gray-400 truncate mb-2">
                        {assessment.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-blue-400 flex items-center">
                        <Shield className="h-3 w-3 mr-1" />
                        Click for mitigation strategies
                      </span>
                      <span className="text-xs text-gray-500">
                        Assessment #{index + 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BlackThemeDashboard;
