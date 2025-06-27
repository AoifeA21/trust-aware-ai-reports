
"""
Google Colab Setup Script for AI Risk Assessment Analysis
Run this first in Google Colab to install required packages and set up the environment.
"""

# Install required packages
import subprocess
import sys

def install_packages():
    """Install all required packages for the analysis"""
    packages = [
        'pandas',
        'numpy', 
        'matplotlib',
        'seaborn',
        'scikit-learn',
        'scipy',
        'plotly',
        'psycopg2-binary',  # For PostgreSQL connection
        'python-dotenv'
    ]
    
    print("Installing required packages...")
    for package in packages:
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", package])
            print(f"✓ {package} installed successfully")
        except subprocess.CalledProcessError:
            print(f"✗ Failed to install {package}")
    
    print("\nAll packages installed!")

def setup_environment():
    """Set up the Google Colab environment"""
    print("Setting up Google Colab environment...")
    
    # Import required libraries
    import pandas as pd
    import numpy as np
    import matplotlib.pyplot as plt
    import seaborn as sns
    
    # Set display options
    pd.set_option('display.max_columns', None)
    pd.set_option('display.width', None)
    pd.set_option('display.max_colwidth', 100)
    
    # Set plotting style
    plt.style.use('default')
    sns.set_palette("husl")
    
    print("Environment setup complete!")

def create_sample_notebook():
    """Create a sample notebook structure"""
    notebook_code = '''
# AI Risk Assessment Analysis - Google Colab Notebook

## 1. Setup and Installation
!pip install pandas numpy matplotlib seaborn scikit-learn plotly

## 2. Import Libraries
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')

## 3. Load Data Cleaning Script
# Copy the data_cleaning.py content here or upload the file

## 4. Load Risk Analysis Script  
# Copy the risk_analysis.py content here or upload the file

## 5. Run Analysis
# Execute the analysis functions
cleaned_data, cleaning_report = run_data_cleaning_example()
analyzed_data, tool_scores, insights = run_comprehensive_analysis()

## 6. Create Custom Visualizations
# Add your custom visualization code here

## 7. Export Results
# Save results to Google Drive or download locally
'''
    
    with open('colab_notebook_template.py', 'w') as f:
        f.write(notebook_code)
    
    print("Sample notebook template created: colab_notebook_template.py")

def connect_to_supabase():
    """Sample code to connect to Supabase from Google Colab"""
    connection_code = '''
# Supabase Connection Example for Google Colab

import pandas as pd
import psycopg2
from sqlalchemy import create_engine

# Your Supabase connection details
SUPABASE_URL = "your_supabase_url"
SUPABASE_KEY = "your_supabase_key"
DB_PASSWORD = "your_db_password"

# Connection string
conn_string = f"postgresql://postgres:{DB_PASSWORD}@db.{SUPABASE_URL.split('//')[1]}/postgres"

# Connect and fetch data
def fetch_risk_data():
    try:
        engine = create_engine(conn_string)
        
        # Fetch risk assessments
        query = """
        SELECT * FROM public.risk_assessments 
        ORDER BY created_at DESC
        """
        df = pd.read_sql(query, engine)
        
        print(f"Successfully loaded {len(df)} risk assessment records")
        return df
        
    except Exception as e:
        print(f"Connection error: {e}")
        return None

# Fetch mitigation strategies
def fetch_mitigation_data():
    try:
        engine = create_engine(conn_string)
        
        query = """
        SELECT * FROM public.mitigation_strategies 
        ORDER BY effectiveness_score DESC
        """
        df = pd.read_sql(query, engine)
        
        print(f"Successfully loaded {len(df)} mitigation strategies")
        return df
        
    except Exception as e:
        print(f"Connection error: {e}")
        return None

# Usage
# risk_data = fetch_risk_data()
# mitigation_data = fetch_mitigation_data()
'''
    
    with open('supabase_connection.py', 'w') as f:
        f.write(connection_code)
    
    print("Supabase connection template created: supabase_connection.py")

if __name__ == "__main__":
    print("=== Google Colab Setup for AI Risk Assessment Analysis ===\n")
    
    # Install packages
    install_packages()
    
    # Setup environment
    setup_environment()
    
    # Create templates
    create_sample_notebook()
    connect_to_supabase()
    
    print("\n=== Setup Complete! ===")
    print("Next steps:")
    print("1. Upload the data_cleaning.py and risk_analysis.py files to Colab")
    print("2. Use the colab_notebook_template.py as a starting point")
    print("3. Configure supabase_connection.py with your credentials")
    print("4. Run the analysis scripts")
