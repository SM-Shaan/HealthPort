import pandas as pd

df=pd.read_csv('dataset\dataset_tabular.csv')
symptom_columns = df.columns[1:].tolist()  # Exclude the first column (disease names)
df_symptoms = pd.DataFrame({'symptom': symptom_columns})

output_file = 'dataset/symptoms.csv'
df_symptoms.to_csv(output_file, index=False)

print(f"Successfully created '{output_file}' with symptom column headers.")
