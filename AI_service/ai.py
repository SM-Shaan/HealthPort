from fastapi import FastAPI, HTTPException, Depends, status, File, UploadFile,  Form
from fastapi.responses import StreamingResponse, HTMLResponse, JSONResponse
from pydantic import BaseModel
from contextlib import asynccontextmanager
from typing import Annotated
from pathlib import Path
from fastapi.staticfiles import StaticFiles
import os, shutil
from embed_data import embed_data
import pandas as pd
from sentence_transformers import SentenceTransformer
from transformers import AutoTokenizer, AutoModelForCausalLM
import chromadb
import uvicorn
from dept import disease_detection , dept_generate, dept_finalize
from typing import List
from fastapi import Body

model_embed =None
collection=None
client=None
disease_list={}
dept_list=[]


@asynccontextmanager
async def lifespan(app: FastAPI):
    global model_embed, collection, client
    try:
        print("[STARTUP] Starting application initialization...", flush=True)

        # Load and sample the dataset (using only randomly 100 rows for faster deployment on Railway)
        df=pd.read_csv("dataset/data_textual.csv")
        df = df.sample(n=30, random_state=42)
        print(f"[STARTUP] CSV loaded. Columns: {df.columns.tolist()}", flush=True)
        print(f"[STARTUP] CSV shape: {df.shape}", flush=True)

        client = chromadb.PersistentClient(path="./chroma_db")
        collection = client.get_or_create_collection(name="disease_symptoms")
        print(f"[STARTUP] ChromaDB initialized. Current collection count: {collection.count()}", flush=True)

        # Define model paths
        model_dir = "models"
        embed_model_name = "all-MiniLM-L6-v2"
        embed_model_path = os.path.join(model_dir, embed_model_name)
        os.makedirs(model_dir, exist_ok=True)

        if os.path.exists(embed_model_path):
            print(f"[STARTUP] Loading Sentence Transformer model from local path: {embed_model_path}", flush=True)
            model_embed = SentenceTransformer(embed_model_path)
        else:
            print(f"[STARTUP] Downloading and caching Sentence Transformer model to: {embed_model_path}", flush=True)
            model_embed = SentenceTransformer(embed_model_name)
            model_embed.save(embed_model_path)
        print("[STARTUP] Sentence Transformer Model is ready for use.", flush=True)

        # Check if we need to embed data
        current_count = collection.count()
        if current_count == 0:
            print(f"[STARTUP] Collection is empty. Embedding {len(df)} rows into ChromaDB...", flush=True)
            print(f"[STARTUP] NOTE: This only happens on first deploy. Subsequent deploys will use cached data.", flush=True)

            # Embed in smaller batches to avoid Railway timeouts
            batch_size = 10
            for i in range(0, len(df), batch_size):
                batch_df = df.iloc[i:i+batch_size]
                embed_data(batch_df, model_embed, collection)
                print(f"[STARTUP] Embedded batch {i//batch_size + 1}/{(len(df)-1)//batch_size + 1} ({i+len(batch_df)}/{len(df)} rows)", flush=True)

            print(f"[STARTUP] Embedding complete! Collection count: {collection.count()}", flush=True)
        else:
            print(f"[STARTUP] Using existing embeddings. Collection count: {current_count}", flush=True)

        print("[STARTUP] Application initialization complete! Ready to accept requests.", flush=True)

    except Exception as e:
        print(f"[ERROR] ERROR during startup: {str(e)}", flush=True)
        import traceback
        traceback.print_exc()
        raise

    yield

    # Code here would run on shutdown
    print("[SHUTDOWN] Shutting down application...", flush=True)

app = FastAPI(lifespan=lifespan)

@app.post("/detect_disease")
async def detect_disease(query: str ="depression"):
    global disease_list
    disease_list= disease_detection(model_embed, collection, query)
    # Create a dictionary to store unique diseases with the highest percentage
    unique_diseases = {}
    for disease_dict in disease_list:
        for disease, percentage in disease_dict.items():
            if disease not in unique_diseases or percentage > unique_diseases[disease]:
                unique_diseases[disease] = percentage
    # Convert back to a list of dictionaries and sort by percentage
    disease_list = sorted([{disease: percentage} for disease, percentage in unique_diseases.items()], key=lambda d: list(d.values())[0], reverse=True)

    print(disease_list)
    return {"diseases": disease_list}

@app.get("/detect_dept")
async def detect_dept():
    print("Received disease list for department detection:", disease_list)
    global dept_list
    dept_list = [] # Clear the list for a new request
    for disease_dict in disease_list:
        disease_name = list(disease_dict.keys())[0]
        dept_list_1=[]
        for j in range(3):
            print(f'Sending {disease_name} for the {j} time')
            dept_1=dept_generate(disease_name)
            print(dept_1)
            dept_list_1.append(dept_1)
        final_dept=dept_finalize(dept_list_1, disease=disease_name)
        print(f'Finalized dept for disease {disease_name}: {final_dept}')
        dept_list.append(final_dept)
        
    print(dept_list)
    return {"departments": dept_list}


@app.get("/")
async def read_root():
    return {"message": "Welcome to HealthPort API"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
