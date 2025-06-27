
"""
Comprehensive AI Risk Assessment Data Cleaning and Analysis Module
Author: [Your Name]
Date: December 2024

This module provides comprehensive data cleaning, preprocessing, and analysis 
capabilities for AI risk assessment data across multiple sectors including 
education, business, and healthcare.
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')

class AIRiskDataCleaner:
    """
    Comprehensive data cleaning class for AI risk assessment data
    """
    
    def __init__(self):
        self.cleaning_report = {
            'total_records': 0,
            'duplicates_removed': 0,
            'missing_values_handled': 0,
            'outliers_detected': 0,
            'data_quality_score': 0
        }
    
    def load_sample_data(self):
        """Generate comprehensive sample data for demonstration"""
        np.random.seed(42)
        
        # AI Tools
        ai_tools = [
            'ChatGPT/OpenAI', 'Google Bard/Gemini', 'Claude (Anthropic)',
            'Tesla Autopilot', 'Healthcare AI Diagnostics', 'Banking AI Systems',
            'Facial Recognition Systems', 'Social Media Algorithms',
            'Educational AI Tutors', 'Recruitment AI Systems',
            'Netflix Recommendation', 'Amazon Alexa', 'IBM Watson',
            'Microsoft Copilot', 'Adobe AI Tools'
        ]
        
        # Risk Types
        risk_types = [
            'Trust Erosion', 'Over-reliance', 'Bias/Discrimination',
            'Privacy Concerns', 'Misinformation', 'Job Displacement',
            'Security Vulnerabilities', 'Algorithmic Manipulation',
            'Lack of Transparency', 'Data Quality Issues'
        ]
        
        # Severity Levels
        severity_levels = ['Low', 'Medium', 'High', 'Critical']
        
        # Sectors
        sectors = ['Education', 'Business', 'Healthcare', 'Technology', 'Government']
        
        # Generate 1000 sample records
        n_records = 1000
        
        data = {
            'id': range(1, n_records + 1),
            'ai_tool': np.random.choice(ai_tools, n_records),
            'risk_type': np.random.choice(risk_types, n_records),
            'severity': np.random.choice(severity_levels, n_records, p=[0.2, 0.3, 0.3, 0.2]),
            'sector': np.random.choice(sectors, n_records),
            'impact_score': np.random.uniform(1, 10, n_records),
            'frequency_percentage': np.random.uniform(0, 100, n_records),
            'mitigation_cost': np.random.uniform(1000, 100000, n_records),
            'implementation_time': np.random.uniform(1, 52, n_records),  # weeks
            'effectiveness_score': np.random.uniform(1, 10, n_records),
            'reported_by': [f'user_{i}@domain.com' for i in range(n_records)],
            'report_date': pd.date_range(start='2023-01-01', periods=n_records, freq='H'),
            'description_length': np.random.randint(10, 500, n_records),
            'follow_up_required': np.random.choice([True, False], n_records, p=[0.3, 0.7])
        }
        
        df = pd.DataFrame(data)
        
        # Introduce some data quality issues for cleaning demonstration
        # Missing values
        df.loc[np.random.choice(df.index, 50), 'description_length'] = np.nan
        df.loc[np.random.choice(df.index, 30), 'mitigation_cost'] = np.nan
        
        # Duplicates
        duplicate_indices = np.random.choice(df.index, 25)
        df = pd.concat([df, df.iloc[duplicate_indices]], ignore_index=True)
        
        # Outliers
        df.loc[np.random.choice(df.index, 20), 'impact_score'] = np.random.uniform(15, 20, 20)
        
        return df
    
    def clean_data(self, df):
        """
        Comprehensive data cleaning pipeline
        """
        original_shape = df.shape
        self.cleaning_report['total_records'] = original_shape[0]
        
        print("🔄 Starting comprehensive data cleaning process...")
        
        # 1. Handle duplicates
        duplicates_before = df.duplicated().sum()
        df = df.drop_duplicates()
        duplicates_removed = duplicates_before - df.duplicated().sum()
        self.cleaning_report['duplicates_removed'] = duplicates_removed
        print(f"✅ Removed {duplicates_removed} duplicate records")
        
        # 2. Handle missing values
        missing_before = df.isnull().sum().sum()
        
        # Fill missing numerical values with median
        numerical_cols = df.select_dtypes(include=[np.number]).columns
        for col in numerical_cols:
            if df[col].isnull().sum() > 0:
                df[col].fillna(df[col].median(), inplace=True)
        
        # Fill missing categorical values with mode
        categorical_cols = df.select_dtypes(include=['object']).columns
        for col in categorical_cols:
            if df[col].isnull().sum() > 0:
                df[col].fillna(df[col].mode()[0], inplace=True)
        
        missing_after = df.isnull().sum().sum()
        self.cleaning_report['missing_values_handled'] = missing_before - missing_after
        print(f"✅ Handled {missing_before - missing_after} missing values")
        
        # 3. Handle outliers
        outliers_detected = 0
        for col in ['impact_score', 'effectiveness_score']:
            if col in df.columns:
                Q1 = df[col].quantile(0.25)
                Q3 = df[col].quantile(0.75)
                IQR = Q3 - Q1
                lower_bound = Q1 - 1.5 * IQR
                upper_bound = Q3 + 1.5 * IQR
                
                outliers = df[(df[col] < lower_bound) | (df[col] > upper_bound)]
                outliers_detected += len(outliers)
                
                # Cap outliers instead of removing them
                df[col] = df[col].clip(lower=max(1, lower_bound), upper=min(10, upper_bound))
        
        self.cleaning_report['outliers_detected'] = outliers_detected
        print(f"✅ Detected and handled {outliers_detected} outliers")
        
        # 4. Data validation
        df = self._validate_data(df)
        
        # 5. Calculate data quality score
        self.cleaning_report['data_quality_score'] = self._calculate_quality_score(df)
        
        print(f"✅ Data cleaning completed. Quality score: {self.cleaning_report['data_quality_score']:.2f}/10")
        
        return df
    
    def _validate_data(self, df):
        """Validate data consistency and fix issues"""
        # Ensure scores are within valid ranges
        score_columns = ['impact_score', 'effectiveness_score']
        for col in score_columns:
            if col in df.columns:
                df[col] = df[col].clip(1, 10)
        
        # Ensure percentage values are within 0-100
        if 'frequency_percentage' in df.columns:
            df['frequency_percentage'] = df['frequency_percentage'].clip(0, 100)
        
        return df
    
    def _calculate_quality_score(self, df):
        """Calculate overall data quality score"""
        score = 10.0
        
        # Deduct points for missing values
        missing_ratio = df.isnull().sum().sum() / (df.shape[0] * df.shape[1])
        score -= missing_ratio * 5
        
        # Deduct points for potential issues
        if df.duplicated().sum() > 0:
            score -= 1
        
        return max(0, score)
    
    def generate_cleaning_report(self):
        """Generate comprehensive cleaning report"""
        print("\n" + "="*50)
        print("📊 DATA CLEANING REPORT")
        print("="*50)
        
        for key, value in self.cleaning_report.items():
            print(f"{key.replace('_', ' ').title()}: {value}")
        
        return self.cleaning_report
    
    def export_cleaned_data(self, df, format='csv', filename=None):
        """Export cleaned data in multiple formats"""
        if filename is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"cleaned_ai_risk_data_{timestamp}"
        
        if format.lower() == 'csv':
            df.to_csv(f"{filename}.csv", index=False)
            print(f"✅ Data exported to {filename}.csv")
        elif format.lower() == 'json':
            df.to_json(f"{filename}.json", orient='records', indent=2)
            print(f"✅ Data exported to {filename}.json")
        elif format.lower() == 'excel':
            df.to_excel(f"{filename}.xlsx", index=False)
            print(f"✅ Data exported to {filename}.xlsx")
        
        return f"{filename}.{format.lower()}"

def run_comprehensive_cleaning():
    """Main function to run the comprehensive cleaning process"""
    print("🚀 Starting AI Risk Assessment Data Cleaning Process")
    print("Author: [Your Name] | Date: December 2024")
    print("-" * 60)
    
    # Initialize cleaner
    cleaner = AIRiskDataCleaner()
    
    # Load sample data
    print("📥 Loading sample data...")
    df = cleaner.load_sample_data()
    print(f"Loaded {len(df)} records with {len(df.columns)} columns")
    
    # Clean data
    cleaned_df = cleaner.clean_data(df)
    
    # Generate report
    report = cleaner.generate_cleaning_report()
    
    # Export cleaned data
    cleaner.export_cleaned_data(cleaned_df, 'csv')
    cleaner.export_cleaned_data(cleaned_df, 'json')
    
    return cleaned_df, report

# Example usage
if __name__ == "__main__":
    cleaned_data, cleaning_report = run_comprehensive_cleaning()
    
    # Display sample of cleaned data
    print("\n📋 Sample of cleaned data:")
    print(cleaned_data.head())
    
    print("\n🎯 Data cleaning process completed successfully!")
