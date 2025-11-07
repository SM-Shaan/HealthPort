import pandas as pd

df=pd.read_csv('dataset\dataset_tabular.csv')
symptom_columns = df.columns[1:].tolist()  # Exclude the first column (disease names)

# Create a DataFrame with the symptom column
df_symptoms = pd.DataFrame({'symptom': symptom_columns})

# Add a new, empty column for the Bengali names
df_symptoms['bengali_name'] = ''

output_file = 'dataset/symptoms.csv'
df_symptoms.to_csv(output_file, index=False)

print(f"Successfully created '{output_file}' with symptom column headers.")

