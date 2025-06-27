
"""
AI Risk Assessment Analysis Script
Advanced analytics and insights generation for risk assessment data.
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats
from sklearn.cluster import KMeans
from sklearn.preprocessing import LabelEncoder
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import warnings
warnings.filterwarnings('ignore')

class RiskAssessmentAnalyzer:
    def __init__(self):
        self.severity_weights = {'Low': 1, 'Medium': 2, 'High': 3, 'Critical': 4}
        
    def calculate_risk_scores(self, df):
        """Calculate comprehensive risk scores"""
        # Weighted risk score by severity
        df['risk_score'] = df['severity'].map(self.severity_weights)
        
        # Tool-specific risk scores
        tool_risk_scores = df.groupby('ai_tool').agg({
            'risk_score': ['mean', 'sum', 'count'],
            'severity': lambda x: (x == 'Critical').sum()
        }).round(2)
        
        tool_risk_scores.columns = ['avg_risk_score', 'total_risk_score', 'report_count', 'critical_count']
        tool_risk_scores['risk_density'] = (tool_risk_scores['total_risk_score'] / 
                                          tool_risk_scores['report_count']).round(2)
        
        return df, tool_risk_scores
    
    def trend_analysis(self, df):
        """Analyze trends in risk reporting"""
        df['date'] = pd.to_datetime(df['created_at']).dt.date
        df['week'] = pd.to_datetime(df['created_at']).dt.isocalendar().week
        df['month'] = pd.to_datetime(df['created_at']).dt.month
        
        # Daily trends
        daily_trends = df.groupby(['date', 'severity']).size().unstack(fill_value=0)
        
        # Weekly trends
        weekly_trends = df.groupby(['week', 'risk_type']).size().unstack(fill_value=0)
        
        # Calculate trend direction (increasing/decreasing)
        recent_week = df['week'].max()
        prev_week = recent_week - 1
        
        trend_direction = {}
        for risk_type in df['risk_type'].unique():
            recent_count = len(df[(df['week'] == recent_week) & (df['risk_type'] == risk_type)])
            prev_count = len(df[(df['week'] == prev_week) & (df['risk_type'] == risk_type)])
            
            if prev_count > 0:
                change_pct = ((recent_count - prev_count) / prev_count) * 100
                trend_direction[risk_type] = {
                    'change_pct': round(change_pct, 1),
                    'direction': 'increasing' if change_pct > 5 else 'decreasing' if change_pct < -5 else 'stable'
                }
        
        return daily_trends, weekly_trends, trend_direction
    
    def severity_correlation_analysis(self, df):
        """Analyze correlations between different factors and severity"""
        # Encode categorical variables
        le_tool = LabelEncoder()
        le_risk = LabelEncoder()
        
        df_encoded = df.copy()
        df_encoded['ai_tool_encoded'] = le_tool.fit_transform(df['ai_tool'])
        df_encoded['risk_type_encoded'] = le_risk.fit_transform(df['risk_type'])
        
        # Correlation matrix
        correlation_features = ['ai_tool_encoded', 'risk_type_encoded', 'risk_score', 'report_requested']
        correlation_matrix = df_encoded[correlation_features].select_dtypes(include=[np.number]).corr()
        
        return correlation_matrix, le_tool, le_risk
    
    def risk_clustering(self, df):
        """Perform clustering analysis to identify risk patterns"""
        # Prepare features for clustering
        feature_df = pd.get_dummies(df[['ai_tool', 'risk_type', 'severity']])
        
        # Perform K-means clustering
        kmeans = KMeans(n_clusters=4, random_state=42)
        df['cluster'] = kmeans.fit_predict(feature_df)
        
        # Analyze clusters
        cluster_analysis = df.groupby('cluster').agg({
            'ai_tool': lambda x: x.mode().iloc[0],
            'risk_type': lambda x: x.mode().iloc[0],
            'severity': lambda x: x.mode().iloc[0],
            'risk_score': 'mean'
        }).round(2)
        
        cluster_analysis['cluster_size'] = df['cluster'].value_counts().sort_index()
        
        return df, cluster_analysis, kmeans
    
    def generate_risk_insights(self, df, tool_scores, trends):
        """Generate actionable insights from the analysis"""
        insights = []
        
        # High-risk tools
        high_risk_tools = tool_scores[tool_scores['avg_risk_score'] >= 3].index.tolist()
        if high_risk_tools:
            insights.append({
                'type': 'High Risk Tools',
                'message': f"Tools with highest average risk: {', '.join(high_risk_tools[:3])}",
                'priority': 'High',
                'recommendation': 'Implement additional monitoring and safety measures for these tools'
            })
        
        # Critical severity analysis  
        critical_pct = (df['severity'] == 'Critical').mean() * 100
        if critical_pct > 10:
            insights.append({
                'type': 'Critical Risk Alert',
                'message': f"{critical_pct:.1f}% of reports are Critical severity",
                'priority': 'Critical',
                'recommendation': 'Immediate attention required for critical risk mitigation'
            })
        
        # Trend analysis insights
        for risk_type, trend_info in trends.items():
            if trend_info['direction'] == 'increasing' and trend_info['change_pct'] > 20:
                insights.append({
                    'type': 'Increasing Risk Trend',
                    'message': f"{risk_type} reports increased by {trend_info['change_pct']}% this week",
                    'priority': 'Medium',
                    'recommendation': f'Investigate root causes of increasing {risk_type} incidents'
                })
        
        # Email engagement
        email_rate = df['report_requested'].mean() * 100
        if email_rate < 30:
            insights.append({
                'type': 'Low Engagement',
                'message': f"Only {email_rate:.1f}% of users request detailed reports",
                'priority': 'Low',
                'recommendation': 'Consider improving report value proposition to increase engagement'
            })
        
        return insights
    
    def create_advanced_visualizations(self, df, tool_scores):
        """Create advanced visualizations using Plotly"""
        
        # 1. Risk Heatmap
        risk_matrix = df.pivot_table(values='risk_score', 
                                   index='ai_tool', 
                                   columns='risk_type', 
                                   aggfunc='mean')
        
        fig_heatmap = px.imshow(risk_matrix, 
                               title='AI Tool vs Risk Type Heatmap (Average Risk Score)',
                               color_continuous_scale='Reds')
        
        # 2. Bubble Chart: Risk Score vs Report Count
        bubble_data = tool_scores.reset_index()
        fig_bubble = px.scatter(bubble_data, 
                               x='report_count', 
                               y='avg_risk_score',
                               size='total_risk_score',
                               color='critical_count',
                               hover_name='ai_tool',
                               title='AI Tools: Risk Profile Analysis',
                               labels={'report_count': 'Number of Reports',
                                      'avg_risk_score': 'Average Risk Score'})
        
        # 3. Time Series Analysis
        df['date'] = pd.to_datetime(df['created_at']).dt.date
        time_series = df.groupby(['date', 'severity']).size().reset_index(name='count')
        fig_timeline = px.line(time_series, 
                              x='date', 
                              y='count', 
                              color='severity',
                              title='Risk Reports Timeline by Severity')
        
        # 4. Risk Distribution Sunburst
        fig_sunburst = px.sunburst(df, 
                                  path=['ai_tool', 'risk_type', 'severity'],
                                  title='Risk Assessment Hierarchy')
        
        return fig_heatmap, fig_bubble, fig_timeline, fig_sunburst
    
    def export_analysis_report(self, df, insights, tool_scores):
        """Export comprehensive analysis report"""
        with open('risk_analysis_report.txt', 'w') as f:
            f.write("=== AI RISK ASSESSMENT ANALYSIS REPORT ===\n\n")
            
            # Summary Statistics
            f.write("SUMMARY STATISTICS:\n")
            f.write(f"Total Reports: {len(df)}\n")
            f.write(f"Unique AI Tools: {df['ai_tool'].nunique()}\n")
            f.write(f"Unique Risk Types: {df['risk_type'].nunique()}\n")
            f.write(f"Average Risk Score: {df['risk_score'].mean():.2f}\n")
            f.write(f"Critical Reports: {(df['severity'] == 'Critical').sum()}\n\n")
            
            # Top Risk Tools
            f.write("TOP RISK TOOLS:\n")
            top_tools = tool_scores.sort_values('avg_risk_score', ascending=False).head(5)
            for tool, data in top_tools.iterrows():
                f.write(f"- {tool}: Avg Risk {data['avg_risk_score']}, "
                       f"Reports {data['report_count']}, Critical {data['critical_count']}\n")
            f.write("\n")
            
            # Key Insights
            f.write("KEY INSIGHTS:\n")
            for insight in insights:
                f.write(f"[{insight['priority']}] {insight['type']}: {insight['message']}\n")
                f.write(f"   Recommendation: {insight['recommendation']}\n\n")
        
        print("Analysis report exported to 'risk_analysis_report.txt'")

def run_comprehensive_analysis():
    """Main function to run comprehensive risk analysis"""
    print("=== AI Risk Assessment Comprehensive Analysis ===\n")
    
    # Load data (assuming cleaned data exists)
    try:
        df = pd.read_csv('cleaned_risk_assessments.csv')
        df['created_at'] = pd.to_datetime(df['created_at'])
    except FileNotFoundError:
        print("Creating sample data for analysis...")
        from data_cleaning import RiskAssessmentDataCleaner
        cleaner = RiskAssessmentDataCleaner()
        df = cleaner.load_sample_data()
        df = cleaner.clean_dataset(df)
    
    # Initialize analyzer
    analyzer = RiskAssessmentAnalyzer()
    
    # Perform analyses
    print("Calculating risk scores...")
    df, tool_scores = analyzer.calculate_risk_scores(df)
    
    print("Analyzing trends...")
    daily_trends, weekly_trends, trend_direction = analyzer.trend_analysis(df)
    
    print("Performing correlation analysis...")
    correlation_matrix, le_tool, le_risk = analyzer.severity_correlation_analysis(df)
    
    print("Running clustering analysis...")
    df, cluster_analysis, kmeans = analyzer.risk_clustering(df)
    
    print("Generating insights...")
    insights = analyzer.generate_risk_insights(df, tool_scores, trend_direction)
    
    # Print results
    print("\n=== ANALYSIS RESULTS ===")
    print("\nTop Risk Tools:")
    print(tool_scores.sort_values('avg_risk_score', ascending=False).head())
    
    print("\nTrend Analysis:")
    for risk_type, trend in trend_direction.items():
        print(f"{risk_type}: {trend['direction']} ({trend['change_pct']}%)")
    
    print("\nCluster Analysis:")
    print(cluster_analysis)
    
    print("\nKey Insights:")
    for insight in insights:
        print(f"[{insight['priority']}] {insight['message']}")
    
    # Create visualizations
    print("\nCreating visualizations...")
    fig_heatmap, fig_bubble, fig_timeline, fig_sunburst = analyzer.create_advanced_visualizations(df, tool_scores)
    
    # Export report
    analyzer.export_analysis_report(df, insights, tool_scores)
    
    return df, tool_scores, insights

if __name__ == "__main__":
    analyzed_data, tool_scores, insights = run_comprehensive_analysis()
