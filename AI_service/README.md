# HealthPort AI Diagnostic Service

An AI-powered medical diagnosis microservice that recommends diseases based on symptoms and suggests appropriate medical departments.

## Features

### 1. Disease Detection (`/detect_disease`)
- **Input:** Patient symptoms (text)
- **Process:** Uses sentence embeddings and vector similarity search
- **Output:** Top 5 possible diseases matching the symptoms
- **Technology:**
  - Sentence Transformers (all-MiniLM-L6-v2)
  - ChromaDB vector database
  - 493,891 disease-symptom mappings

### 2. Department Recommendation (`/detect_dept`)
- **Input:** List of detected diseases
- **Process:** AI-powered department matching using DeepSeek
- **Output:** Recommended medical department for each disease
- **Technology:**
  - Ollama API with DeepSeek-v3.1 model
  - Multi-run consensus (3 attempts per disease)
  - Finalization step for best match

## Architecture

```
Patient Symptoms
      ↓
[Sentence Transformer] → Symptom Embedding
      ↓
[ChromaDB Vector Search] → Similar Symptoms
      ↓
[Top 5 Diseases]
      ↓
[DeepSeek AI Model] → Department Matching
      ↓
[Recommended Departments]
```

## Dataset

### data_textual.csv (71 MB)
- **Size:** 493,891 rows
- **Format:** CSV with 3 columns
  - `response`: Disease name
  - `query`: Comma-separated symptoms
  - `id`: Unique identifier

**Example:**
```csv
response,query,id
panic disorder,"anxiety and nervousness,shortness of breath,depressive or psychotic symptoms",0
```

### symptoms.csv (13 KB)
- List of medical symptoms
- Includes Bengali translation support

## Installation

### 1. Install Dependencies

```bash
cd server
pip install -r requirements.txt
```

### 2. Download Models (First Run)

On first run, the service automatically downloads:
- **all-MiniLM-L6-v2** (~90 MB) - Sentence embedding model
- Saved to `./models/` folder for reuse

### 3. Configure API Keys

**Important:** Update the Ollama API key in `dept.py`:

```python
# Line 27 in dept.py
headers={'Authorization': 'Bearer YOUR_API_KEY_HERE'}
```

Get your API key from: https://ollama.com

## Running the Service

### Local Development

```bash
cd server
python ai.py
```

Server starts on: `http://localhost:8000`

### API Documentation

Visit: `http://localhost:8000/docs` for Swagger UI

## API Endpoints

### 1. Health Check
```bash
GET /
Response: {"message": "Welcome to HealthPort API"}
```

### 2. Detect Disease
```bash
POST /detect_disease
Content-Type: application/json

Query Parameter:
  query: "anxiety and nervousness, chest pain, dizziness"

Response:
{
  "diseases": [
    "panic disorder",
    "anxiety disorder",
    "cardiovascular disease",
    "vestibular disorder",
    "hyperthyroidism"
  ]
}
```

### 3. Recommend Department
```bash
POST /detect_dept
Content-Type: application/json

Body:
["panic disorder", "anxiety disorder"]

Response:
{
  "departments": [
    "Psychiatry",
    "Mental Health"
  ]
}
```

## Usage Example

### Python Client

```python
import requests

# 1. Detect diseases from symptoms
response = requests.post(
    "http://localhost:8000/detect_disease",
    params={"query": "fever, cough, shortness of breath"}
)
diseases = response.json()["diseases"]
print("Detected diseases:", diseases)

# 2. Get department recommendations
response = requests.post(
    "http://localhost:8000/detect_dept",
    json=diseases
)
departments = response.json()["departments"]
print("Recommended departments:", departments)
```

### cURL

```bash
# Detect disease
curl -X POST "http://localhost:8000/detect_disease?query=headache%2C%20fever%2C%20nausea"

# Get departments
curl -X POST "http://localhost:8000/detect_dept" \
  -H "Content-Type: application/json" \
  -d '["migraine", "meningitis"]'
```

## Integration with Main Backend

### Option 1: Separate Microservice (Recommended)
Deploy AI service separately and call from main FastAPI backend:

```python
# In backend-fastapi/app/routers/diagnosis.py
import httpx

@router.post("/api/diagnose")
async def diagnose_symptoms(symptoms: str):
    async with httpx.AsyncClient() as client:
        # Call AI service
        response = await client.post(
            "http://ai-service:8000/detect_disease",
            params={"query": symptoms}
        )
        diseases = response.json()["diseases"]

        # Get departments
        response = await client.post(
            "http://ai-service:8000/detect_dept",
            json=diseases
        )
        departments = response.json()["departments"]

        return {
            "diseases": diseases,
            "departments": departments
        }
```

### Option 2: Merged Backend
Merge the AI endpoints into the main FastAPI backend.

## Deployment

### Docker (Recommended)

Create `server/Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Expose port
EXPOSE 8000

# Run application
CMD ["uvicorn", "ai:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:
```bash
docker build -t healthport-ai .
docker run -p 8000:8000 healthport-ai
```

### Railway Deployment

1. Create new Railway service
2. Set root directory: `server`
3. Set start command: `uvicorn ai:app --host 0.0.0.0 --port $PORT`
4. Add environment variables:
   ```
   OLLAMA_API_KEY=your_api_key
   PORT=8000
   ```

## Performance

### Cold Start
- First request: ~30 seconds (model loading + embedding creation)
- Subsequent requests: <1 second

### Memory Requirements
- Embedding model: ~90 MB
- ChromaDB: ~500 MB (with full dataset)
- Total: ~600 MB RAM minimum

### Optimization Tips
1. **Limit dataset**: Currently loads only first 1000 rows (line 30 in `ai.py`)
   ```python
   df=df[:1000]  # Adjust this number
   ```

2. **Persistent storage**: ChromaDB persists to `./chroma_db/` folder
   - No need to re-embed on restart
   - Delete folder to rebuild from scratch

3. **Batch processing**: Process multiple queries together for better performance

## Security

### Current Issues ⚠️

1. **Exposed API Keys** (line 27, 56 in `dept.py`)
   - Move to environment variables
   ```python
   import os
   headers={'Authorization': f'Bearer {os.getenv("OLLAMA_API_KEY")}'}
   ```

2. **No authentication** on endpoints
   - Add API key authentication
   - Integrate with main backend auth

3. **No rate limiting**
   - Add rate limiting to prevent abuse

### Recommended Fixes

```python
# Add to ai.py
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer

security = HTTPBearer()

async def verify_token(credentials: HTTPBearer = Depends(security)):
    if credentials.credentials != os.getenv("API_SECRET"):
        raise HTTPException(status_code=401, detail="Invalid API key")
    return credentials.credentials

# Protect endpoints
@app.post("/detect_disease", dependencies=[Depends(verify_token)])
async def detect_disease(query: str):
    ...
```

## Monitoring

### Logs
Check logs for:
- Model loading status
- Embedding creation
- Query processing time
- API call failures

### Health Checks
Add health endpoint:
```python
@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "model_loaded": model_embed is not None,
        "collection_count": collection.count() if collection else 0
    }
```

## Troubleshooting

### Issue: Model not loading
```bash
# Delete cache and retry
rm -rf models/
rm -rf chroma_db/
python ai.py
```

### Issue: ChromaDB errors
```bash
# Reset vector database
rm -rf chroma_db/
# Restart service
```

### Issue: Ollama API errors
- Check API key is valid
- Verify internet connection
- Check Ollama service status

## Future Enhancements

1. **Multi-language support**
   - Bengali translation (translate.py exists)
   - Add more languages

2. **Confidence scores**
   - Return probability for each disease
   - Threshold filtering

3. **Caching**
   - Cache common symptom queries
   - Redis integration

4. **Analytics**
   - Track most common symptoms
   - Disease trends

5. **Integration features**
   - Link with doctor specialties
   - Auto-suggest doctors based on department

## Files Structure

```
server/
├── ai.py                    # Main FastAPI application
├── dept.py                  # Department recommendation logic
├── embed_data.py            # Data embedding utilities
├── requirements.txt         # Python dependencies
├── README.md                # This file
├── dataset/
│   ├── data_textual.csv    # Disease-symptom mappings (71 MB)
│   ├── symptoms.csv         # Symptom list (13 KB)
│   └── translate.py         # Translation utilities
├── models/                  # Downloaded ML models (auto-created)
│   └── all-MiniLM-L6-v2/   # Sentence transformer
└── chroma_db/              # Vector database (auto-created)
    └── ...
```

## Tech Stack

- **FastAPI** - Web framework
- **Sentence Transformers** - Text embedding
- **ChromaDB** - Vector database
- **Ollama + DeepSeek** - AI inference
- **Pandas** - Data processing

## License

Part of HealthPort project.

## Support

For issues:
1. Check logs for errors
2. Verify API keys are set
3. Ensure models are downloaded
4. Check ChromaDB is initialized

---

**Last Updated:** November 2025
**Version:** 1.0.0
