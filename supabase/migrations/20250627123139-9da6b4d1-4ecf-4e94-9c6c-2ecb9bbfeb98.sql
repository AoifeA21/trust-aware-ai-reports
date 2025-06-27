
-- Add more comprehensive mitigation strategies for different sectors
INSERT INTO public.mitigation_strategies (risk_type, severity, strategy_title, strategy_description, implementation_difficulty, effectiveness_score) VALUES
-- Education Sector
('Trust Erosion', 'Medium', 'AI Literacy Programs', 'Implement comprehensive AI literacy programs for educators and students', 'Medium', 7),
('Over-reliance', 'High', 'Critical Thinking Integration', 'Integrate critical thinking exercises with AI-assisted learning', 'Medium', 8),
('Bias/Discrimination', 'Critical', 'Inclusive AI Curriculum', 'Develop AI curriculum that addresses bias and promotes inclusivity', 'Hard', 9),
('Privacy Concerns', 'High', 'Student Data Protection', 'Implement strict protocols for protecting student data in AI systems', 'Hard', 9),
('Misinformation', 'Medium', 'Fact-Verification Training', 'Train students to verify AI-generated information with multiple sources', 'Easy', 7),

-- Business Sector
('Trust Erosion', 'High', 'AI Ethics Board', 'Establish internal AI ethics boards for decision oversight', 'Hard', 8),
('Over-reliance', 'Critical', 'Human-AI Collaboration Framework', 'Create frameworks ensuring human expertise remains central', 'Hard', 9),
('Bias/Discrimination', 'High', 'Algorithmic Auditing', 'Regular third-party audits of AI systems for bias detection', 'Hard', 9),
('Privacy Concerns', 'Critical', 'Zero-Trust Data Architecture', 'Implement zero-trust security models for AI data processing', 'Hard', 10),
('Job Displacement', 'High', 'Reskilling Programs', 'Comprehensive employee reskilling for AI-augmented roles', 'Medium', 8),
('Security Vulnerabilities', 'Critical', 'AI Security Framework', 'Multi-layered security framework for AI system protection', 'Hard', 9),

-- Healthcare Sector
('Trust Erosion', 'Critical', 'Medical AI Transparency', 'Provide clear explanations for AI-assisted medical decisions', 'Hard', 10),
('Over-reliance', 'High', 'Clinical Decision Support', 'AI as decision support, not replacement for medical judgment', 'Medium', 9),
('Bias/Discrimination', 'Critical', 'Health Equity Monitoring', 'Continuous monitoring for healthcare disparities in AI outcomes', 'Hard', 10),
('Privacy Concerns', 'Critical', 'HIPAA-Compliant AI', 'Ensure all AI systems meet or exceed HIPAA requirements', 'Hard', 10),
('Misinformation', 'Critical', 'Medical Information Validation', 'Multi-tier validation for AI-generated medical information', 'Hard', 9);

-- Add more comprehensive risk factors across sectors
INSERT INTO public.risk_factors (risk_type, factor_name, impact_level, frequency_percentage, description) VALUES
-- Education Factors
('Trust Erosion', 'Academic Integrity Concerns', 'High', 42.5, 'Students and educators question AI reliability in academic settings'),
('Over-reliance', 'Reduced Research Skills', 'Medium', 35.8, 'Students lose ability to conduct independent research'),
('Bias/Discrimination', 'Educational Inequality', 'Critical', 48.3, 'AI systems perpetuate existing educational disparities'),
('Privacy Concerns', 'Student Data Mining', 'High', 44.7, 'Excessive collection of student behavioral and academic data'),

-- Business Factors
('Trust Erosion', 'Decision Opacity', 'High', 51.2, 'Business stakeholders cannot understand AI-driven decisions'),
('Over-reliance', 'Strategic Dependency', 'Critical', 39.6, 'Organizations become overly dependent on AI for strategic decisions'),
('Job Displacement', 'Workforce Anxiety', 'High', 47.8, 'Employee fear and resistance due to AI automation'),
('Security Vulnerabilities', 'Data Breach Risks', 'Critical', 55.3, 'AI systems become targets for sophisticated cyber attacks'),
('Algorithmic Manipulation', 'Market Manipulation', 'High', 33.4, 'AI used to manipulate markets or consumer behavior'),

-- Healthcare Factors
('Trust Erosion', 'Clinical Skepticism', 'High', 46.9, 'Healthcare professionals question AI diagnostic accuracy'),
('Over-reliance', 'Diagnostic Overconfidence', 'Critical', 41.7, 'Over-reliance on AI leads to missed diagnoses'),
('Bias/Discrimination', 'Health Disparities', 'Critical', 58.2, 'AI systems show bias against certain demographic groups'),
('Privacy Concerns', 'Medical Data Breaches', 'Critical', 52.1, 'Sensitive medical information exposed through AI systems'),

-- General Technology Factors
('Lack of Transparency', 'Black Box Algorithms', 'Critical', 61.4, 'AI decision-making processes are completely opaque'),
('Lack of Transparency', 'Insufficient Documentation', 'High', 43.8, 'Poor documentation of AI system capabilities and limitations'),
('Security Vulnerabilities', 'Adversarial Attacks', 'High', 37.9, 'AI systems vulnerable to targeted manipulation attacks'),
('Algorithmic Manipulation', 'Behavioral Exploitation', 'High', 42.1, 'AI systems exploit human psychological vulnerabilities');

-- Add sample risk assessments for demonstration
INSERT INTO public.risk_assessments (ai_tool, risk_type, severity, description, email, report_requested) VALUES
('ChatGPT/OpenAI', 'Misinformation', 'High', 'Generated false information about medical treatments that could be harmful', 'researcher@university.edu', true),
('Tesla Autopilot', 'Over-reliance', 'Critical', 'Driver became overly dependent on autopilot in complex traffic situations', 'safety@transport.gov', true),
('Healthcare AI Diagnostics', 'Bias/Discrimination', 'Critical', 'AI system showed lower accuracy for patients from minority backgrounds', 'ethics@hospital.org', true),
('Facial Recognition Systems', 'Privacy Concerns', 'High', 'System collected biometric data without proper consent mechanisms', 'privacy@tech.com', false),
('Banking AI Systems', 'Trust Erosion', 'Medium', 'Loan approval decisions lack transparency, customers cannot understand reasoning', 'compliance@bank.com', true),
('Social Media Algorithms', 'Algorithmic Manipulation', 'High', 'Algorithm promotes divisive content to increase engagement time', 'policy@social.com', false),
('Google AI/Bard', 'Misinformation', 'Medium', 'Provided outdated financial advice that could impact investment decisions', 'feedback@finance.com', true),
('Netflix Recommendation', 'Privacy Concerns', 'Low', 'Concerns about viewing data being used for non-entertainment purposes', 'user@email.com', false);
