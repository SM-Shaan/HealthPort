# AI Diagnostic Service - Deployment Guide

Deploy the HealthPort AI diagnostic microservice to production.

## Architecture Overview

The AI service can be deployed as a **separate microservice** that communicates with the main backend via HTTP. The main backend acts as an API gateway, receiving requests from the frontend and forwarding them to the AI service.

```
Frontend (Vercel)
    ↓
Main Backend (Railway) ← AI Service (Railway)
    ↓
MySQL Database         ChromaDB
```

## Deployment Options

### Option 1: Railway Deployment (Recommended for Separate Service)
### Option 2: Docker + Any Cloud
### Option 3: HTTP-Based Integration (Connect Services)

---

## Option 1: Railway Deployment (Separate Service)

### Step 1: Prepare for Deployment

1. **Get Ollama API Key**

Obtain your API key from https://ollama.com/

2. **Optimize Dataset Loading (Optional)**

In `ai.py` line 30, adjust dataset size if needed:
```python
df=df[:1000]  # Use 1000 rows for faster startup, or increase for better accuracy
```

### Step 2: Create Railway Service

1. Go to https://railway.app/dashboard
2. Click **New Project**
3. Select **Deploy from GitHub repo**
4. Choose your HealthPort repository

### Step 3: Configure Service

**Settings:**
```
Name: healthport-ai
Root Directory: AI_service
Start Command: uvicorn ai:app --host 0.0.0.0 --port $PORT
```

### Step 4: Set Environment Variables

Add in Railway Variables tab:

```bash
OLLAMA_API_KEY=your_ollama_api_key_here
PORT=8000
PYTHONUNBUFFERED=1
```

**IMPORTANT:** Replace `your_ollama_api_key_here` with your actual Ollama API key.

### Step 5: Deploy

1. Click **Deploy**
2. Wait 3-5 minutes (first deployment downloads models ~90MB)
3. Check logs for:
   ```
   ✅ Loading Sentence Transformer model from local path
   Collection count after embedding: 1000
   Application startup complete
   ```

### Step 6: Generate Public URL

1. Go to **Settings** → **Networking**
2. Click **Generate Domain**
3. Copy your URL: `https://healthport-ai-production.up.railway.app`

### Step 7: Configure Main Backend

Add the AI service URL to your **main backend** service in Railway:

1. Go to your main backend service (not the AI service)
2. Click **Variables** tab
3. Add new variable:
   ```
   AI_SERVICE_URL=https://healthport-ai-production.up.railway.app
   ```
4. Railway will auto-redeploy the main backend

### Step 8: Test Deployment

**Test AI Service Directly:**
```bash
# Health check
curl https://your-ai-service.up.railway.app/

# Test disease detection
curl -X POST "https://your-ai-service.up.railway.app/detect_disease?query=fever%2C%20cough"

# Test department recommendation
curl -X POST "https://your-ai-service.up.railway.app/detect_dept" \
  -H "Content-Type: application/json" \
  -d '["influenza", "pneumonia"]'
```

**Test Integration (Main Backend → AI Service):**
```bash
# Check AI service health via main backend
curl https://your-main-backend.up.railway.app/api/diagnosis/ai-health

# Test complete symptom check flow
curl -X POST "https://your-main-backend.up.railway.app/api/diagnosis/symptom-check" \
  -H "Content-Type: application/json" \
  -d '{"symptoms": "fever, cough, headache"}'
```

Expected integrated response:
```json
{
  "symptoms": "fever, cough, headache",
  "possible_diseases": ["influenza", "common cold", "COVID-19", "pneumonia", "sinusitis"],
  "recommended_departments": ["Internal Medicine", "Infectious Disease", "Pulmonology", "Family Medicine", "ENT"]
}
```

### Estimated Costs (Railway)

- **Hobby Plan:** $5/month
- **Memory:** 600MB required
- **Storage:** 1GB (models + database)
- **CPU:** Minimal after startup

---

## Option 2: Docker Deployment

### Step 1: Create Dockerfile

Create `AI_service/Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Create directories for models and database
RUN mkdir -p models chroma_db

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD python -c "import requests; requests.get('http://localhost:8000/')"

# Run application
CMD ["uvicorn", "ai:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Step 2: Create .dockerignore

```
__pycache__/
*.pyc
*.pyo
*.pyd
.Python
*.so
*.egg
*.egg-info/
dist/
build/
.env
.venv/
chroma_db/
models/
*.log
.git/
.gitignore
README.md
```

### Step 3: Build Image

```bash
cd AI_service
docker build -t healthport-ai:latest .
```

### Step 4: Run Container

```bash
docker run -d \
  -p 8000:8000 \
  -e OLLAMA_API_KEY=your_api_key_here \
  -v $(pwd)/models:/app/models \
  -v $(pwd)/chroma_db:/app/chroma_db \
  --name healthport-ai \
  healthport-ai:latest
```

### Step 5: Deploy to Cloud

**Google Cloud Run:**
```bash
# Build and push to GCR
gcloud builds submit --tag gcr.io/PROJECT_ID/healthport-ai

# Deploy
gcloud run deploy healthport-ai \
  --image gcr.io/PROJECT_ID/healthport-ai \
  --platform managed \
  --region us-central1 \
  --memory 1Gi \
  --set-env-vars OLLAMA_API_KEY=your_key
```

**AWS ECS/Fargate:**
```bash
# Push to ECR
aws ecr get-login-password | docker login --username AWS --password-stdin
docker tag healthport-ai:latest ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com/healthport-ai
docker push ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com/healthport-ai

# Deploy via ECS console or CLI
```

---

## Option 3: HTTP-Based Integration (Recommended Architecture)

This option keeps the AI service separate but makes the main backend act as an API gateway.

**Benefits:**
- ✅ Services remain independent
- ✅ Easy to scale AI service separately
- ✅ Simpler deployment and updates
- ✅ Main backend has smaller memory footprint

### Step 1: Deploy AI Service (Already Done)

First, deploy the AI service to Railway using **Option 1** above.

Note your AI service URL: `https://healthport-ai-production.up.railway.app`

### Step 2: Configure Main Backend

Add environment variable to your main backend service in Railway:

```bash
AI_SERVICE_URL=https://healthport-ai-production.up.railway.app
```

### Step 3: Verify Integration

The diagnosis router is already created at `backend-fastapi/app/routers/diagnosis.py`.

It works by calling the AI service via HTTP:

```python
# Main backend calls AI service
async with httpx.AsyncClient(timeout=30.0) as client:
    # Step 1: Detect diseases
    disease_response = await client.post(
        f"{AI_SERVICE_URL}/detect_disease",
        params={"query": symptoms}
    )

    # Step 2: Get departments
    dept_response = await client.post(
        f"{AI_SERVICE_URL}/detect_dept",
        json=diseases
    )
```

### Step 4: Test Integration

Test the integrated endpoint:

```bash
curl -X POST "https://your-main-backend.up.railway.app/api/diagnosis/symptom-check" \
  -H "Content-Type: application/json" \
  -d '{"symptoms": "fever, headache, cough"}'
```

Expected response:
```json
{
  "symptoms": "fever, headache, cough",
  "possible_diseases": ["influenza", "common cold", "COVID-19", "pneumonia"],
  "recommended_departments": ["Internal Medicine", "Infectious Disease", "Pulmonology"]
}
```

---

## Integration with Frontend

### Add to Frontend API Service

Create `HealthPort/src/services/diagnosisService.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export interface DiagnosisResult {
  symptoms: string;
  possible_diseases: string[];
  recommended_departments: string[];
}

export const diagnosisService = {
  async checkSymptoms(symptoms: string): Promise<DiagnosisResult> {
    const response = await fetch(`${API_BASE_URL}/diagnosis/symptom-check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ symptoms }),
    });

    if (!response.ok) {
      throw new Error('Diagnosis failed');
    }

    return response.json();
  }
};
```

### Add Diagnosis Page

Create `HealthPort/src/pages/patient/SymptomChecker.tsx`:

```typescript
import { useState } from 'react';
import { diagnosisService } from '../../services/diagnosisService';

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDiagnose = async () => {
    setLoading(true);
    try {
      const diagnosis = await diagnosisService.checkSymptoms(symptoms);
      setResult(diagnosis);
    } catch (error) {
      alert('Diagnosis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">AI Symptom Checker</h1>

      <textarea
        value={symptoms}
        onChange={(e) => setSymptoms(e.target.value)}
        placeholder="Enter your symptoms (e.g., fever, cough, headache)"
        className="w-full p-3 border rounded-lg mb-4"
        rows={4}
      />

      <button
        onClick={handleDiagnose}
        disabled={loading || !symptoms}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg"
      >
        {loading ? 'Analyzing...' : 'Diagnose'}
      </button>

      {result && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-3">Results:</h2>

          <div className="bg-yellow-50 p-4 rounded-lg mb-4">
            <h3 className="font-semibold mb-2">Possible Conditions:</h3>
            <ul className="list-disc pl-5">
              {result.possible_diseases.map((disease, i) => (
                <li key={i}>{disease}</li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Recommended Departments:</h3>
            <ul className="list-disc pl-5">
              {result.recommended_departments.map((dept, i) => (
                <li key={i}>{dept}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomChecker;
```

---

## Production Checklist

### Security
- [ ] Move API keys to environment variables
- [ ] Add authentication to AI endpoints
- [ ] Add rate limiting
- [ ] Enable HTTPS only

### Performance
- [ ] Optimize dataset size (currently 1000 rows)
- [ ] Enable model caching
- [ ] Add Redis for query caching
- [ ] Monitor memory usage

### Monitoring
- [ ] Set up health checks
- [ ] Add logging (Railway logs or CloudWatch)
- [ ] Monitor API response times
- [ ] Track error rates

### Data
- [ ] Backup ChromaDB database
- [ ] Version control dataset updates
- [ ] Add data validation

---

## Troubleshooting

### High Memory Usage
```bash
# Reduce dataset size in ai.py
df=df[:500]  # Use fewer rows
```

### Slow Response Times
- First request is always slow (model loading)
- Add warming endpoint to preload models
- Use persistent storage for models

### Model Download Failures
```bash
# Pre-download models locally
python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2').save('models/all-MiniLM-L6-v2')"
```

### ChromaDB Errors
```bash
# Reset database
rm -rf chroma_db/
# Restart service
```

---

## Cost Estimation

### Railway (Separate Service)
- **Hobby Plan:** $5/month
- **Resources:** 1 GB RAM, 1 GB storage
- **Bandwidth:** Included

### Google Cloud Run
- **Free Tier:** 2M requests/month
- **Beyond Free:** $0.40/million requests
- **Memory:** $0.0000025/GB-second

### AWS Lambda (Alternative)
- Not recommended due to cold start times
- Models too large for Lambda layers

---

## Performance Metrics

### Response Times
- **Disease Detection:** 200-500ms (after warmup)
- **Department Recommendation:** 2-5 seconds (AI inference)
- **Total:** ~3-6 seconds per diagnosis

### Accuracy
- Depends on dataset quality
- Currently trained on 493K examples
- Consider fine-tuning for better results

---

## Next Steps

### For Separate Deployment:

1. **Deploy AI Service** (Option 1)
   - Create new Railway service
   - Set `AI_SERVICE_URL` in main backend
   - Test integration endpoint

2. **Update Frontend**
   - Create `diagnosisService.ts`
   - Add symptom checker page
   - Test end-to-end flow

3. **Monitor & Optimize**
   - Check response times
   - Monitor memory usage
   - Add caching if needed

### Quick Start:

```bash
# 1. Deploy AI service to Railway
# Configure: Root Directory = AI_service, Port = 8000

# 2. Add to main backend environment variables
AI_SERVICE_URL=https://your-ai-service.up.railway.app

# 3. Test the integration
curl -X POST "https://your-main-backend.up.railway.app/api/diagnosis/symptom-check" \
  -H "Content-Type: application/json" \
  -d '{"symptoms": "fever, cough"}'
```

---

**Communication Flow:**
1. Frontend → POST `/api/diagnosis/symptom-check` → Main Backend
2. Main Backend → POST `/detect_disease` → AI Service
3. Main Backend → POST `/detect_dept` → AI Service
4. Main Backend → Response → Frontend

**Key Files:**
- `AI_service/ai.py` - AI service endpoints
- `backend-fastapi/app/routers/diagnosis.py` - Integration router
- `backend-fastapi/main.py` - Router registration

---

**Last Updated:** November 2025
**Version:** 2.0.0
