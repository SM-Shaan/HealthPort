from datasets import load_dataset
import pandas as pd
from sentence_transformers import SentenceTransformer
import chromadb



def embed_data(df, model, collection):

    # Keep a mapping from ID → disease name
    for row in df.iterrows():
        
        # print(test)
        # print(row[1]['response'])
        emb = model.encode(row[1]['query']).tolist()
        collection.add(
            ids=[str(row[1]['id'])], 
            embeddings=[emb], 
            documents=[row[1]['query']],   
            metadatas=[{             
                "disease": row[1]['response'],
                "symptoms": row[1]['query']
            }]
        )

    # client.delete_collection(name="disease_symptoms")