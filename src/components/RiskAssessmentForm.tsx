
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const AI_TOOLS = [
  'ChatGPT/OpenAI',
  'Tesla Autopilot',
  'Facial Recognition Systems',
  'Google AI/Bard',
  'Amazon Alexa',
  'Netflix Recommendation',
  'Social Media Algorithms',
  'Banking AI Systems',
  'Healthcare AI Diagnostics',
  'Other'
];

const RISK_TYPES = [
  'Trust Erosion',
  'Over-reliance',
  'Bias/Discrimination',
  'Privacy Concerns',
  'Misinformation',
  'Job Displacement',
  'Security Vulnerabilities',
  'Lack of Transparency',
  'Algorithmic Manipulation',
  'Other'
];

const RiskAssessmentForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    aiTool: '',
    riskType: '',
    severity: '',
    description: '',
    email: '',
    reportRequested: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Insert data into Supabase
      const { error } = await supabase
        .from('risk_assessments')
        .insert([{
          ai_tool: formData.aiTool,
          risk_type: formData.riskType,
          severity: formData.severity,
          description: formData.description,
          email: formData.email,
          report_requested: formData.reportRequested
        }]);

      if (error) throw error;

      toast({
        title: "Risk Assessment Submitted",
        description: formData.reportRequested 
          ? "Your report will be sent to your email within 24 hours." 
          : "Thank you for your submission!",
      });

      // Reset form
      setFormData({
        aiTool: '',
        riskType: '',
        severity: '',
        description: '',
        email: '',
        reportRequested: false
      });
    } catch (error) {
      console.error('Error submitting assessment:', error);
      toast({
        title: "Submission Error",
        description: "There was an error submitting your assessment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AI Risk Assessment Report
        </CardTitle>
        <p className="text-muted-foreground">Help us understand and mitigate AI risks in real-world applications</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="aiTool">AI Tool/System *</Label>
            <Select value={formData.aiTool} onValueChange={(value) => setFormData({...formData, aiTool: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select the AI tool you encountered" />
              </SelectTrigger>
              <SelectContent>
                {AI_TOOLS.map((tool) => (
                  <SelectItem key={tool} value={tool}>{tool}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="riskType">Risk Category *</Label>
            <Select value={formData.riskType} onValueChange={(value) => setFormData({...formData, riskType: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select the type of risk encountered" />
              </SelectTrigger>
              <SelectContent>
                {RISK_TYPES.map((risk) => (
                  <SelectItem key={risk} value={risk}>{risk}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="severity">Severity Level *</Label>
            <Select value={formData.severity} onValueChange={(value) => setFormData({...formData, severity: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Rate the severity of the risk" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low - Minor inconvenience</SelectItem>
                <SelectItem value="Medium">Medium - Noticeable impact</SelectItem>
                <SelectItem value="High">High - Significant concern</SelectItem>
                <SelectItem value="Critical">Critical - Major safety/security risk</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              placeholder="Please describe your experience and the specific risk you encountered..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email (optional)</Label>
            <Input 
              type="email"
              placeholder="Enter your email to receive a personalized risk report"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input 
              type="checkbox"
              id="reportRequested"
              checked={formData.reportRequested}
              onChange={(e) => setFormData({...formData, reportRequested: e.target.checked})}
              className="rounded border-gray-300"
            />
            <Label htmlFor="reportRequested" className="text-sm">
              Send me a detailed risk assessment report via email
            </Label>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            disabled={!formData.aiTool || !formData.riskType || !formData.severity || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Risk Assessment'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RiskAssessmentForm;
