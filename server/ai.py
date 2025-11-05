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
import chromadb
import uvicorn
from dept import disease_detection , dept_generate

model =None
collection=None
client=None
disease_list=[]
dept_list=[]

@asynccontextmanager
async def lifespan(app: FastAPI):
    global model, collection, client
    df=pd.read_csv("dataset/data_textual.csv") # This is your startup logic
    df=df[:1000]
    # print(df.head())
    client = chromadb.PersistentClient(path="./chroma_db")
    collection = client.get_or_create_collection(name="disease_symptoms")
    HF_TOKEN = "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" 


    model = SentenceTransformer("all-MiniLM-L6-v2")
    if collection.count() == 0:
        embed_data(df, model, collection)
    print("Collection count after embedding:", collection.count())
    
    yield
    # Code here would run on shutdown

app = FastAPI(lifespan=lifespan)

@app.post("/detect_disease")
def detect_disease(query: str ="depression"):
    global disease_list
    disease_list= disease_detection(model, collection, query)
    # to only store unique diseases
    disease_list = list(set(disease_list))

    print(disease_list)
    return {"diseases": disease_list}

@app.post("/detect_dept")
def detect_dept():
    global dept_list
    for i in disease_list:
        print(f'Sending {i}')
        dept=dept_generate(i)
        print(dept)
        dept_list.append(dept)
        
    print(dept_list)
    return {"departments": dept_list}


@app.get("/")
async def read_root():
    return {"message": "Welcome to HealthPort API"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
