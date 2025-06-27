
"""
AI Risk Assessment Data Cleaning Script
This script can be run in Google Colab or locally to clean and process risk assessment data.
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime, timedelta
import re
import warnings
warnings.filterwarnings('ignore')

class RiskAssessmentDataCleaner:
    def __init__(self):
        self.ai_tools_mapping = {
            'chatgpt': 'ChatGPT/OpenAI',
            'openai': 'ChatGPT/OpenAI',
            'gpt': 'ChatGPT/OpenAI',
            'tesla': 'Tesla Autopilot',
            'autopilot': 'Tesla Autopilot',
            'facial': 'Facial Recognition Systems',
            'face recognition': 'Facial Recognition Systems',
            'google': 'Google AI/Bard',
            'bard': 'Google AI/Bard',
            'alexa': 'Amazon Alexa',
            'amazon': 'Amazon Alexa',
            'netflix': 'Netflix Recommendation',
            'social media': 'Social Media Algorithms',
            'facebook': 'Social Media Algorithms',
            'instagram': 'Social Media Algorithms',
            'banking': 'Banking AI Systems',
            'healthcare': 'Healthcare AI Diagnostics',
            'medical': 'Healthcare AI Diagnostics'
        }
        
        self.risk_types_mapping = {
            'trust': 'Trust Erosion',
            'reliability': 'Trust Erosion',
            'over-reliance': 'Over-reliance',
            'dependence': 'Over-reliance',
            'bias': 'Bias/Discrimination',
            'discrimination': 'Bias/Discrimination',
            'privacy': 'Privacy Concerns',
            'data': 'Privacy Concerns',
            'misinformation': 'Misinformation',
            'fake news': 'Misinformation',
            'job': 'Job Displacement',
            'employment': 'Job Displacement',
            'security': 'Security Vulnerabilities',
            'hack': 'Security Vulnerabilities',
            'transparency': 'Lack of Transparency',
            'black box': 'Lack of Transparency',
            'manipulation': 'Algorithmic Manipulation'
        }
        
        self.severity_mapping = {
            'low': 'Low',
            'minor': 'Low',
            'medium': 'Medium',
            'moderate': 'Medium',
            'high': 'High',
            'severe': 'High',
            'critical': 'Critical',
            'extreme': 'Critical'
        }

    def load_sample_data(self):
        """Generate sample data for demonstration"""
        np.random.seed(42)
        n_samples = 150
        
        ai_tools = ['ChatGPT/OpenAI', 'Tesla Autopilot', 'Facial Recognition Systems', 
                   'Google AI/Bard', 'Amazon Alexa', 'Netflix Recommendation', 
                   'Social Media Algorithms', 'Banking AI Systems', 'Healthcare AI Diagnostics']
        
        risk_types = ['Trust Erosion', 'Over-reliance', 'Bias/Discrimination', 
                     'Privacy Concerns', 'Misinformation', 'Job Displacement', 
                     'Security Vulnerabilities', 'Lack of Transparency', 'Algorithmic Manipulation']
        
        severities = ['Low', 'Medium', 'High', 'Critical']
        
        data = []
        for i in range(n_samples):
            # Generate timestamps over the last 30 days
            days_ago = np.random.randint(0, 30)
            timestamp = datetime.now() - timedelta(days=days_ago)
            
            data.append({
                'id': f'risk_{i+1:03d}',
                'ai_tool': np.random.choice(ai_tools),
                'risk_type': np.random.choice(risk_types),
                'severity': np.random.choice(severities, p=[0.3, 0.35, 0.25, 0.1]),
                'description': f'Sample risk description {i+1}',
                'email': f'user{i+1}@example.com' if np.random.random() > 0.3 else '',
                'report_requested': np.random.choice([True, False], p=[0.4, 0.6]),
                'created_at': timestamp,
                'updated_at': timestamp
            })
        
        return pd.DataFrame(data)

    def clean_text_field(self, text):
        """Clean and standardize text fields"""
        if pd.isna(text) or text == '':
            return text
        
        # Convert to lowercase and strip whitespace
        text = str(text).lower().strip()
        
        # Remove extra spaces
        text = re.sub(r'\s+', ' ', text)
        
        return text

    def standardize_ai_tool(self, tool_name):
        """Standardize AI tool names"""
        if pd.isna(tool_name):
            return 'Other'
        
        tool_clean = self.clean_text_field(tool_name)
        
        for key, standard_name in self.ai_tools_mapping.items():
            if key in tool_clean:
                return standard_name
        
        return 'Other'

    def standardize_risk_type(self, risk_type):
        """Standardize risk type names"""
        if pd.isna(risk_type):
            return 'Other'
        
        risk_clean = self.clean_text_field(risk_type)
        
        for key, standard_type in self.risk_types_mapping.items():
            if key in risk_clean:
                return standard_type
        
        return 'Other'

    def standardize_severity(self, severity):
        """Standardize severity levels"""
        if pd.isna(severity):
            return 'Medium'  # Default value
        
        severity_clean = self.clean_text_field(severity)
        
        for key, standard_severity in self.severity_mapping.items():
            if key in severity_clean:
                return standard_severity
        
        return 'Medium'  # Default value

    def validate_email(self, email):
        """Validate email format"""
        if pd.isna(email) or email == '':
            return ''
        
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if re.match(email_pattern, str(email)):
            return str(email).lower()
        else:
            return ''  # Invalid email becomes empty

    def remove_duplicates(self, df):
        """Remove duplicate entries based on key fields"""
        # Consider duplicates as same ai_tool, risk_type, and similar timestamp (within 1 hour)
        df_sorted = df.sort_values('created_at')
        
        duplicates_mask = []
        for i, row in df_sorted.iterrows():
            is_duplicate = False
            for j, prev_row in df_sorted.iloc[:df_sorted.index.get_loc(i)].iterrows():
                if (row['ai_tool'] == prev_row['ai_tool'] and 
                    row['risk_type'] == prev_row['risk_type'] and
                    abs((row['created_at'] - prev_row['created_at']).total_seconds()) < 3600):
                    is_duplicate = True
                    break
            duplicates_mask.append(not is_duplicate)
        
        return df_sorted[duplicates_mask].reset_index(drop=True)

    def clean_dataset(self, df):
        """Main cleaning function"""
        print("Starting data cleaning process...")
        print(f"Initial dataset shape: {df.shape}")
        
        # Create a copy to avoid modifying original
        df_clean = df.copy()
        
        # Clean and standardize fields
        print("Standardizing AI tools...")
        df_clean['ai_tool'] = df_clean['ai_tool'].apply(self.standardize_ai_tool)
        
        print("Standardizing risk types...")
        df_clean['risk_type'] = df_clean['risk_type'].apply(self.standardize_risk_type)
        
        print("Standardizing severity levels...")
        df_clean['severity'] = df_clean['severity'].apply(self.standardize_severity)
        
        print("Validating emails...")
        df_clean['email'] = df_clean['email'].apply(self.validate_email)
        
        # Clean description field
        print("Cleaning descriptions...")
        df_clean['description'] = df_clean['description'].apply(
            lambda x: self.clean_text_field(x) if pd.notna(x) else ''
        )
        
        # Remove duplicates
        print("Removing duplicates...")
        df_clean = self.remove_duplicates(df_clean)
        
        # Add derived fields
        df_clean['severity_score'] = df_clean['severity'].map({
            'Low': 1, 'Medium': 2, 'High': 3, 'Critical': 4
        })
        
        df_clean['has_email'] = df_clean['email'] != ''
        
        print(f"Final dataset shape: {df_clean.shape}")
        print("Data cleaning completed!")
        
        return df_clean

    def generate_cleaning_report(self, df_original, df_clean):
        """Generate a comprehensive cleaning report"""
        report = {
            'original_rows': len(df_original),
            'cleaned_rows': len(df_clean),
            'rows_removed': len(df_original) - len(df_clean),
            'removal_percentage': ((len(df_original) - len(df_clean)) / len(df_original)) * 100,
            'ai_tools_standardized': len(df_clean['ai_tool'].unique()),
            'risk_types_standardized': len(df_clean['risk_type'].unique()),
            'valid_emails': df_clean['has_email'].sum(),
            'email_validation_rate': (df_clean['has_email'].sum() / len(df_clean)) * 100,
            'severity_distribution': df_clean['severity'].value_counts().to_dict(),
            'missing_descriptions': (df_clean['description'] == '').sum()
        }
        
        return report

    def visualize_cleaning_results(self, df_clean, report):
        """Create visualizations of the cleaned data"""
        fig, axes = plt.subplots(2, 3, figsize=(18, 12))
        fig.suptitle('AI Risk Assessment Data Cleaning Results', fontsize=16, fontweight='bold')
        
        # 1. Severity Distribution
        severity_counts = df_clean['severity'].value_counts()
        axes[0,0].pie(severity_counts.values, labels=severity_counts.index, autopct='%1.1f%%')
        axes[0,0].set_title('Severity Distribution')
        
        # 2. AI Tools Distribution
        ai_tool_counts = df_clean['ai_tool'].value_counts().head(8)
        axes[0,1].barh(ai_tool_counts.index, ai_tool_counts.values)
        axes[0,1].set_title('Top AI Tools Reported')
        axes[0,1].set_xlabel('Number of Reports')
        
        # 3. Risk Types Distribution
        risk_type_counts = df_clean['risk_type'].value_counts()
        axes[0,2].bar(range(len(risk_type_counts)), risk_type_counts.values)
        axes[0,2].set_xticks(range(len(risk_type_counts)))
        axes[0,2].set_xticklabels(risk_type_counts.index, rotation=45, ha='right')
        axes[0,2].set_title('Risk Types Distribution')
        axes[0,2].set_ylabel('Number of Reports')
        
        # 4. Timeline of Reports
        df_clean['date'] = df_clean['created_at'].dt.date
        timeline = df_clean.groupby('date').size()
        axes[1,0].plot(timeline.index, timeline.values, marker='o')
        axes[1,0].set_title('Reports Timeline')
        axes[1,0].set_xlabel('Date')
        axes[1,0].set_ylabel('Number of Reports')
        axes[1,0].tick_params(axis='x', rotation=45)
        
        # 5. Email vs No Email
        email_stats = [report['valid_emails'], report['cleaned_rows'] - report['valid_emails']]
        axes[1,1].bar(['With Email', 'Without Email'], email_stats)
        axes[1,1].set_title('Email Availability')
        axes[1,1].set_ylabel('Number of Reports')
        
        # 6. Cleaning Statistics
        cleaning_stats = ['Original\nRows', 'Cleaned\nRows', 'Removed\nRows']
        cleaning_values = [report['original_rows'], report['cleaned_rows'], report['rows_removed']]
        colors = ['blue', 'green', 'red']
        axes[1,2].bar(cleaning_stats, cleaning_values, color=colors, alpha=0.7)
        axes[1,2].set_title('Data Cleaning Summary')
        axes[1,2].set_ylabel('Number of Rows')
        
        plt.tight_layout()
        plt.show()
        
        return fig

# Usage example for Google Colab
def run_data_cleaning_example():
    """Example function to run in Google Colab"""
    print("=== AI Risk Assessment Data Cleaning Pipeline ===\n")
    
    # Initialize cleaner
    cleaner = RiskAssessmentDataCleaner()
    
    # Load sample data (in real use, you'd load from CSV or database)
    print("Loading sample data...")
    df_original = cleaner.load_sample_data()
    
    # Clean the data
    df_clean = cleaner.clean_dataset(df_original)
    
    # Generate report
    report = cleaner.generate_cleaning_report(df_original, df_clean)
    
    # Print report
    print("\n=== CLEANING REPORT ===")
    for key, value in report.items():
        print(f"{key.replace('_', ' ').title()}: {value}")
    
    # Create visualizations
    fig = cleaner.visualize_cleaning_results(df_clean, report)
    
    # Save cleaned data
    df_clean.to_csv('cleaned_risk_assessments.csv', index=False)
    print(f"\nCleaned data saved to 'cleaned_risk_assessments.csv'")
    
    return df_clean, report

# Run this in Google Colab
if __name__ == "__main__":
    cleaned_data, cleaning_report = run_data_cleaning_example()
