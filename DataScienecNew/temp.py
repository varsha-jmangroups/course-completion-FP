import os
import pandas as pd

def get_csv_files_info(folder_path):
    # Get a list of all CSV files in the specified folder
    csv_files = [f for f in os.listdir(folder_path) if f.endswith('.csv')]
    
    if not csv_files:
        print("No CSV files found in the specified folder.")
        return
    
    for csv_file in csv_files:
        file_path = os.path.join(folder_path, csv_file)
        
        # Read the CSV file using pandas
        try:
            df = pd.read_csv(file_path)
            if "password" in df.columns:
                df.drop('password', axis=1, inplace=True)
            print(f"File: {csv_file}")
            print("df.info", df.info())
            print(df.head(3), "\n")  # Show first few rows of the dataframe
        except Exception as e:
            print(f"Could not read {csv_file}. Error: {e}")

if __name__ == "__main__":
    # Specify your folder path here
    folder_path = r'./data'  # Change this to your folder path
    get_csv_files_info(folder_path)
