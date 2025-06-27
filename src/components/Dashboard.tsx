
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#ef4444', '#f59e0b', '#10b981', '#f97316'];

const Dashboard = () => {
  const [assessments, setAssessments] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    critical: 0,
    high: 0,
    thisWeek: 0
  });

  useEffect(() => {
    // Load data from localStorage
    const data = JSON.parse(localStorage.getItem('riskAssessments') || '[]');
    setAssessments(data);
    
    // Calculate stats
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weeklySubmissions = data.filter(item => new Date(item.timestamp) > oneWeekAgo);
    
    setStats({
      total: data.length,
      critical: data.filter(item => item.severity === 'Critical').length,
      high: data.filter(item => item.severity === 'High').length,
      thisWeek: weeklySubmissions.length
    });
  }, []);

  // Process data for charts
  const severityData = assessments.reduce((acc, curr) => {
    acc[curr.severity] = (acc[curr.severity] || 0) + 1;
    return acc;
  }, {});

  const severityChartData = Object.entries(severityData).map(([key, value]) => ({
    name: key,
    value: value as number
  }));

  const toolData = assessments.reduce((acc, curr) => {
    acc[curr.aiTool] = (acc[curr.aiTool] || 0) + 1;
    return acc;
  }, {});

  const toolChartData = Object.entries(toolData)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 8)
    .map(([key, value]) => ({
      name: key.length > 15 ? key.substring(0, 15) + '...' : key,
      value: value as number
    }));

  const riskTypeData = assessments.reduce((acc, curr) => {
    acc[curr.riskType] = (acc[curr.riskType] || 0) + 1;
    return acc;
  }, {});

  const riskTypeChartData = Object.entries(riskTypeData).map(([key, value]) => ({
    name: key,
    value: value as number
  }));

  // Generate some sample trend data
  const trendData = Array.from({length: 30}, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const dayAssessments = assessments.filter(assessment => {
      const assessmentDate = new Date(assessment.timestamp);
      return assessmentDate.toDateString() === date.toDateString();
    });
    
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      submissions: dayAssessments.length,
      critical: dayAssessments.filter(a => a.severity === 'Critical').length,
      high: dayAssessments.filter(a => a.severity === 'High').length
    };
  });

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Reports</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                📊
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100">Critical Risks</p>
                <p className="text-3xl font-bold">{stats.critical}</p>
              </div>
              <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                🚨
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">High Risks</p>
                <p className="text-3xl font-bold">{stats.high}</p>
              </div>
              <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                ⚠️
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">This Week</p>
                <p className="text-3xl font-bold">{stats.thisWeek}</p>
              </div>
              <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                📅
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Severity Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Severity Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={severityChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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

        {/* AI Tools Report Count */}
        <Card>
          <CardHeader>
            <CardTitle>Reports by AI Tool</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={toolChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk Types */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={riskTypeChartData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={120}
                  fontSize={12}
                />
                <Tooltip />
                <Bar dataKey="value" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Trend Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>30-Day Trend Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="submissions" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Total Submissions"
                />
                <Line 
                  type="monotone" 
                  dataKey="critical" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="Critical"
                />
                <Line 
                  type="monotone" 
                  dataKey="high" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  name="High"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Submissions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Risk Assessments</CardTitle>
        </CardHeader>
        <CardContent>
          {assessments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No risk assessments submitted yet. Submit your first assessment to see data here!
            </p>
          ) : (
            <div className="space-y-4">
              {assessments.slice(-5).reverse().map((assessment, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium">{assessment.aiTool}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        assessment.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                        assessment.severity === 'High' ? 'bg-orange-100 text-orange-800' :
                        assessment.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {assessment.severity}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(assessment.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Risk Type: {assessment.riskType}
                  </p>
                  {assessment.description && (
                    <p className="text-sm text-gray-600 truncate">
                      {assessment.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
