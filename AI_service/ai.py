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
disease_list=[]
dept_list=[]


@asynccontextmanager
async def lifespan(app: FastAPI):
    global model_embed, collection, client, qwen_model, tokenizer_qwen3
    df=pd.read_csv("dataset/data_sample.csv") # Using sample dataset for faster deployment
    # print(df.head())
    client = chromadb.PersistentClient(path="./chroma_db")
    collection = client.get_or_create_collection(name="disease_symptoms")
    HF_TOKEN = "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" 

    # Define model paths
    model_dir = "models"

    embed_model_name = "all-MiniLM-L6-v2"
    embed_model_path = os.path.join(model_dir, embed_model_name)
    os.makedirs(model_dir, exist_ok=True)

    if os.path.exists(embed_model_path):
        print(f"✅ Loading Sentence Transformer model from local path: {embed_model_path}")
        model_embed = SentenceTransformer(embed_model_path)
    else:
        print(f"⬇️ Downloading and caching Sentence Transformer model to: {embed_model_path}")
        model_embed = SentenceTransformer(embed_model_name)
        model_embed.save(embed_model_path)
    print("Sentence Transformer Model is ready for use.")

    if collection.count() == 0:
        embed_data(df, model_embed, collection)
    print("Collection count after embedding:", collection.count())
    
    yield
    # Code here would run on shutdown

app = FastAPI(lifespan=lifespan)

@app.post("/detect_disease")
async def detect_disease(query: str ="depression"):
    global disease_list
    disease_list= disease_detection(model_embed, collection, query)
    # to only store unique diseases
    disease_list = list(set(disease_list))

    print(disease_list)
    return {"diseases": disease_list}

@app.post("/detect_dept")
async def detect_dept(disease_list: List[str] = Body(...)):
    print("Received disease list for department detection:", disease_list)
    global dept_list
    for i in disease_list:
        dept_list_1=[]
        for j in range(3):
            print(f'Sending {i} for the {j} time')
            dept_1=dept_generate(i)
            print(dept_1)
            dept_list_1.append(dept_1)
        final_dept=dept_finalize(dept_list_1, disease=i)
        print(f'Finalized dept for disease {i}: {final_dept}')
        dept_list.append(final_dept)
        
    print(dept_list)
    return {"departments": dept_list}


@app.get("/")
async def read_root():
    return {"message": "Welcome to HealthPort API"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
