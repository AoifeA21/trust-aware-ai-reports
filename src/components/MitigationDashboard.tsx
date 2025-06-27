
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#ef4444', '#f59e0b', '#10b981'];

interface MitigationStrategy {
  id: string;
  risk_type: string;
  severity: string;
  strategy_title: string;
  strategy_description: string;
  implementation_difficulty: string;
  effectiveness_score: number;
}

interface RiskFactor {
  id: string;
  risk_type: string;
  factor_name: string;
  impact_level: string;
  frequency_percentage: number;
  description: string;
}

const MitigationDashboard = ({ selectedRiskType, selectedSeverity }: { 
  selectedRiskType?: string; 
  selectedSeverity?: string; 
}) => {
  const [strategies, setStrategies] = useState<MitigationStrategy[]>([]);
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMitigationData();
  }, [selectedRiskType, selectedSeverity]);

  const fetchMitigationData = async () => {
    try {
      // Fetch mitigation strategies
      let strategiesQuery = supabase.from('mitigation_strategies').select('*');
      if (selectedRiskType) {
        strategiesQuery = strategiesQuery.eq('risk_type', selectedRiskType);
      }
      if (selectedSeverity) {
        strategiesQuery = strategiesQuery.eq('severity', selectedSeverity);
      }
      
      const { data: strategiesData, error: strategiesError } = await strategiesQuery
        .order('effectiveness_score', { ascending: false });

      // Fetch risk factors
      let factorsQuery = supabase.from('risk_factors').select('*');
      if (selectedRiskType) {
        factorsQuery = factorsQuery.eq('risk_type', selectedRiskType);
      }
      
      const { data: factorsData, error: factorsError } = await factorsQuery
        .order('frequency_percentage', { ascending: false });

      if (strategiesError) throw strategiesError;
      if (factorsError) throw factorsError;

      setStrategies(strategiesData || []);
      setRiskFactors(factorsData || []);
    } catch (error) {
      console.error('Error fetching mitigation data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const effectivenessData = strategies.map(s => ({
    name: s.strategy_title.length > 20 ? s.strategy_title.substring(0, 20) + '...' : s.strategy_title,
    effectiveness: s.effectiveness_score,
    difficulty: s.implementation_difficulty
  }));

  const impactDistribution = riskFactors.reduce((acc, factor) => {
    const existing = acc.find(item => item.name === factor.impact_level);
    if (existing) {
      existing.value += factor.frequency_percentage;
    } else {
      acc.push({ name: factor.impact_level, value: factor.frequency_percentage });
    }
    return acc;
  }, [] as Array<{ name: string; value: number }>);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Risk Mitigation Dashboard
        </h2>
        <p className="text-muted-foreground">
          {selectedRiskType ? `Mitigation strategies for ${selectedRiskType}` : 'Comprehensive risk mitigation strategies'}
          {selectedSeverity && ` - ${selectedSeverity} severity`}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{strategies.length}</div>
            <p className="text-sm text-muted-foreground">Available Strategies</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {strategies.length > 0 ? Math.round(strategies.reduce((sum, s) => sum + s.effectiveness_score, 0) / strategies.length) : 0}
            </div>
            <p className="text-sm text-muted-foreground">Avg Effectiveness</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{riskFactors.length}</div>
            <p className="text-sm text-muted-foreground">Risk Factors</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {strategies.filter(s => s.implementation_difficulty === 'Easy').length}
            </div>
            <p className="text-sm text-muted-foreground">Easy to Implement</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strategy Effectiveness Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Strategy Effectiveness Scores</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={effectivenessData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Bar dataKey="effectiveness" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk Impact Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Factor Impact Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={impactDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {impactDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Mitigation Strategies */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Mitigation Strategies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {strategies.map((strategy) => (
              <div key={strategy.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg">{strategy.strategy_title}</h3>
                  <div className="flex items-center space-x-2">
                    <Badge className={getDifficultyColor(strategy.implementation_difficulty)}>
                      {strategy.implementation_difficulty}
                    </Badge>
                    <Badge variant="outline">
                      {strategy.effectiveness_score}/10
                    </Badge>
                  </div>
                </div>
                <p className="text-muted-foreground mb-3">{strategy.strategy_description}</p>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Risk Type: {strategy.risk_type} | Severity: {strategy.severity}
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-medium">Effectiveness:</span>
                    <div className="flex space-x-1">
                      {[...Array(10)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i < strategy.effectiveness_score ? 'bg-blue-500' : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Factors Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Key Risk Factors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {riskFactors.map((factor) => (
              <div key={factor.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">{factor.factor_name}</h3>
                  <div className="flex items-center space-x-2">
                    <Badge className={getImpactColor(factor.impact_level)}>
                      {factor.impact_level} Impact
                    </Badge>
                    <Badge variant="outline">
                      {factor.frequency_percentage}% Frequency
                    </Badge>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">{factor.description}</p>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${factor.frequency_percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MitigationDashboard;
