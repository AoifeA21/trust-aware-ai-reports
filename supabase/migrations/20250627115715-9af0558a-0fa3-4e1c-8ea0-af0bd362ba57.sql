
-- Create the main risk assessments table
CREATE TABLE public.risk_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ai_tool TEXT NOT NULL,
  risk_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
  description TEXT,
  email TEXT,
  report_requested BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create mitigation strategies table
CREATE TABLE public.mitigation_strategies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  risk_type TEXT NOT NULL,
  severity TEXT NOT NULL,
  strategy_title TEXT NOT NULL,
  strategy_description TEXT NOT NULL,
  implementation_difficulty TEXT CHECK (implementation_difficulty IN ('Easy', 'Medium', 'Hard')),
  effectiveness_score INTEGER CHECK (effectiveness_score >= 1 AND effectiveness_score <= 10),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create risk factors analysis table
CREATE TABLE public.risk_factors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  risk_type TEXT NOT NULL,
  factor_name TEXT NOT NULL,
  impact_level TEXT CHECK (impact_level IN ('Low', 'Medium', 'High', 'Critical')),
  frequency_percentage DECIMAL(5,2),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert sample mitigation strategies
INSERT INTO public.mitigation_strategies (risk_type, severity, strategy_title, strategy_description, implementation_difficulty, effectiveness_score) VALUES
('Trust Erosion', 'High', 'Transparency Reports', 'Implement regular transparency reports showing AI decision-making processes', 'Medium', 8),
('Trust Erosion', 'Critical', 'Human Oversight Integration', 'Add mandatory human review for critical AI decisions', 'Hard', 9),
('Over-reliance', 'Medium', 'User Education Programs', 'Develop training programs to educate users about AI limitations', 'Easy', 7),
('Over-reliance', 'High', 'Decision Confirmation Systems', 'Implement systems requiring user confirmation for important decisions', 'Medium', 8),
('Bias/Discrimination', 'High', 'Bias Testing Framework', 'Regular testing for bias across different demographic groups', 'Hard', 9),
('Bias/Discrimination', 'Critical', 'Diverse Training Data', 'Ensure training datasets represent diverse populations', 'Hard', 10),
('Privacy Concerns', 'Medium', 'Data Minimization', 'Collect only necessary data and implement data retention policies', 'Medium', 8),
('Privacy Concerns', 'High', 'Advanced Encryption', 'Implement end-to-end encryption for all user data', 'Hard', 9),
('Misinformation', 'High', 'Fact-Checking Integration', 'Integrate real-time fact-checking systems', 'Hard', 8),
('Misinformation', 'Critical', 'Source Verification', 'Implement mandatory source verification for all AI-generated content', 'Hard', 9);

-- Insert sample risk factors
INSERT INTO public.risk_factors (risk_type, factor_name, impact_level, frequency_percentage, description) VALUES
('Trust Erosion', 'Lack of Explainability', 'High', 45.2, 'Users cannot understand how AI reached its decisions'),
('Trust Erosion', 'Inconsistent Results', 'Medium', 32.1, 'AI provides different outputs for similar inputs'),
('Over-reliance', 'Automation Bias', 'High', 38.7, 'Users blindly trust AI recommendations without verification'),
('Over-reliance', 'Skill Atrophy', 'Medium', 28.3, 'Users lose critical thinking skills due to AI dependence'),
('Bias/Discrimination', 'Training Data Bias', 'Critical', 52.8, 'Biased training data leads to discriminatory outcomes'),
('Bias/Discrimination', 'Algorithmic Bias', 'High', 41.6, 'Inherent biases in algorithm design and implementation'),
('Privacy Concerns', 'Data Collection Overreach', 'High', 49.3, 'AI systems collect more data than necessary'),
('Privacy Concerns', 'Inadequate Consent', 'Medium', 35.9, 'Users are not properly informed about data usage'),
('Misinformation', 'Content Hallucination', 'Critical', 43.7, 'AI generates false or misleading information'),
('Misinformation', 'Context Misinterpretation', 'High', 37.2, 'AI misunderstands context leading to wrong information');

-- Enable Row Level Security (make tables publicly readable for dashboard)
ALTER TABLE public.risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mitigation_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_factors ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (for dashboard)
CREATE POLICY "Allow public read access to risk_assessments" ON public.risk_assessments FOR SELECT USING (true);
CREATE POLICY "Allow public insert to risk_assessments" ON public.risk_assessments FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access to mitigation_strategies" ON public.mitigation_strategies FOR SELECT USING (true);
CREATE POLICY "Allow public read access to risk_factors" ON public.risk_factors FOR SELECT USING (true);
