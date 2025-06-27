
# AI Risk Assessment Python Analysis Suite

This suite of Python scripts provides comprehensive data cleaning, analysis, and visualization capabilities for the AI Risk Assessment Platform. All scripts are designed to work in Google Colab for easy access and execution.

## Files Overview

### 1. `google_colab_setup.py`
**Purpose**: Initial setup script for Google Colab environment
**What it does**:
- Installs all required Python packages
- Sets up the environment with proper display options
- Creates template files for easy execution
- Provides Supabase connection examples

**Usage in Google Colab**:
```python
# Run this first in a new Colab notebook
exec(open('google_colab_setup.py').read())
```

### 2. `data_cleaning.py`
**Purpose**: Comprehensive data cleaning and standardization
**Key Features**:
- **Text Standardization**: Cleans and normalizes AI tool names, risk types, and severity levels
- **Email Validation**: Ensures email addresses are properly formatted
- **Duplicate Removal**: Identifies and removes duplicate submissions
- **Data Quality Reports**: Generates detailed cleaning statistics
- **Visualization**: Creates charts showing cleaning results

**Core Functions**:
- `RiskAssessmentDataCleaner.clean_dataset()`: Main cleaning pipeline
- `generate_cleaning_report()`: Creates comprehensive cleaning statistics
- `visualize_cleaning_results()`: Generates cleaning visualizations

**Sample Output Data Quality Metrics**:
- Original vs cleaned row counts
- Standardization success rates
- Email validation statistics
- Missing data analysis

### 3. `risk_analysis.py`
**Purpose**: Advanced analytics and risk intelligence
**Analysis Features**:
- **Risk Scoring**: Calculates weighted risk scores for tools and categories
- **Trend Analysis**: Identifies increasing/decreasing risk patterns
- **Correlation Analysis**: Finds relationships between risk factors
- **Clustering**: Groups similar risk patterns using machine learning
- **Predictive Insights**: Generates actionable recommendations

**Key Visualizations**:
- Risk heatmaps showing tool vs risk type correlations
- Bubble charts for risk profile analysis
- Time series showing risk trends
- Sunburst charts for risk hierarchy

**Insight Generation**:
- Identifies high-risk AI tools requiring attention
- Detects emerging risk trends
- Provides mitigation recommendations
- Calculates risk severity distributions

## How the System Works

### Data Flow Architecture

```
Raw Submissions → Data Cleaning → Risk Analysis → Insights & Reports
     ↓              ↓              ↓              ↓
 Web Form      Standardization   Scoring &     Mitigation
Supabase DB   Validation        Clustering    Strategies
```

### 1. **Data Collection** (Web Application)
- Users submit risk assessments through the web form
- Data is stored in Supabase PostgreSQL database
- Real-time dashboard shows immediate results

### 2. **Data Cleaning Pipeline** (`data_cleaning.py`)
- **Input**: Raw risk assessment data from database
- **Process**:
  - Standardizes AI tool names (e.g., "chatgpt" → "ChatGPT/OpenAI")
  - Normalizes risk types and severity levels
  - Validates email addresses
  - Removes duplicates and inconsistencies
  - Adds derived fields (risk scores, flags)
- **Output**: Clean, standardized dataset ready for analysis

### 3. **Risk Analysis Engine** (`risk_analysis.py`)
- **Input**: Cleaned risk assessment data
- **Advanced Analytics**:
  - **Risk Scoring**: Assigns numerical scores (1-4) based on severity
  - **Tool Risk Profiles**: Calculates average, total, and density scores per AI tool
  - **Trend Detection**: Identifies week-over-week changes in risk patterns
  - **Correlation Analysis**: Finds relationships between tools, risk types, and severity
  - **ML Clustering**: Groups similar risk patterns to identify common scenarios
- **Output**: Comprehensive risk intelligence and actionable insights

### 4. **Mitigation Integration** (Web Dashboard)
- Uses analysis results to show targeted mitigation strategies
- Links risk patterns to specific intervention recommendations
- Provides effectiveness scores for different mitigation approaches

## Dashboard Data Integration

The web dashboard uses the analysis results to provide:

### Real-Time Metrics
- **Total Assessments**: Live count from Supabase
- **Severity Distribution**: Critical, High, Medium, Low breakdowns
- **Tool Rankings**: Most reported AI tools with risk scores
- **Trend Indicators**: Week-over-week changes

### Interactive Features
- **Clickable Risk Categories**: Click any risk type to see mitigation strategies
- **Severity-Based Filtering**: Focus on Critical/High risk items
- **Tool-Specific Analysis**: Deep dive into particular AI tools
- **Temporal Views**: Track how risks evolve over time

### Mitigation Dashboard
When users click on risks, they see:
- **Targeted Strategies**: Specific to the risk type and severity
- **Implementation Difficulty**: Easy, Medium, Hard categorization
- **Effectiveness Scores**: 1-10 rating of strategy effectiveness
- **Risk Factors**: Contributing factors with frequency percentages

## Google Colab Usage Instructions

### Step 1: Setup
```python
# Upload all Python files to Colab
# Run setup script
exec(open('google_colab_setup.py').read())
```

### Step 2: Data Cleaning
```python
# Import and run cleaning
from data_cleaning import RiskAssessmentDataCleaner, run_data_cleaning_example

# Run with sample data
cleaned_data, report = run_data_cleaning_example()

# Or connect to your Supabase database
# Use connection code from supabase_connection.py
```

### Step 3: Risk Analysis
```python
# Import and run analysis
from risk_analysis import RiskAssessmentAnalyzer, run_comprehensive_analysis

# Run complete analysis
analyzed_data, tool_scores, insights = run_comprehensive_analysis()
```

### Step 4: Export Results
```python
# Results are automatically saved as:
# - cleaned_risk_assessments.csv
# - risk_analysis_report.txt
# - Various visualization plots

# Download to your local machine or save to Google Drive
```

## Key Benefits

### For Researchers
- **Standardized Data**: Clean, consistent dataset for analysis
- **Advanced Analytics**: ML-powered insights and clustering
- **Exportable Results**: CSV and text reports for further research

### For Organizations
- **Risk Intelligence**: Identify highest-risk AI tools and scenarios
- **Trend Monitoring**: Track how AI risks evolve over time
- **Mitigation Planning**: Evidence-based intervention strategies

### For Stakeholders
- **Executive Dashboards**: High-level risk overview and trends
- **Actionable Insights**: Specific recommendations for risk reduction
- **Compliance Support**: Documentation for regulatory requirements

## Technical Architecture

### Database Schema
```sql
risk_assessments: Core submission data
mitigation_strategies: Intervention recommendations  
risk_factors: Contributing factor analysis
```

### Python Dependencies
- **pandas**: Data manipulation and analysis
- **numpy**: Numerical computing
- **matplotlib/seaborn**: Statistical visualizations
- **plotly**: Interactive charts
- **scikit-learn**: Machine learning and clustering
- **psycopg2**: PostgreSQL database connectivity

### Scalability Features
- **Batch Processing**: Handle large datasets efficiently
- **Incremental Updates**: Process only new data
- **Cloud Integration**: Works with Supabase, AWS, GCP
- **Export Flexibility**: Multiple output formats (CSV, JSON, PDF)

This comprehensive system transforms raw risk submissions into actionable intelligence, helping organizations build safer AI systems through data-driven insights and targeted mitigation strategies.
