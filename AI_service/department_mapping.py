"""
Static disease-to-department mapping for faster responses
Avoids slow LLM API calls for common diseases
"""

DISEASE_DEPARTMENT_MAP = {
    # Mental Health
    "depression": "Psychiatry",
    "anxiety": "Psychiatry",
    "panic disorder": "Psychiatry",
    "bipolar disorder": "Psychiatry",
    "schizophrenia": "Psychiatry",
    "ptsd": "Psychiatry",
    "ocd": "Psychiatry",

    # Neurology
    "migraine": "Neurology",
    "epilepsy": "Neurology",
    "parkinson's disease": "Neurology",
    "alzheimer's disease": "Neurology",
    "stroke": "Neurology",
    "multiple sclerosis": "Neurology",
    "neuropathy": "Neurology",

    # Cardiology
    "heart attack": "Cardiology",
    "hypertension": "Cardiology",
    "arrhythmia": "Cardiology",
    "heart failure": "Cardiology",
    "coronary artery disease": "Cardiology",
    "angina": "Cardiology",

    # Respiratory
    "asthma": "Respiratory Medicine",
    "copd": "Respiratory Medicine",
    "pneumonia": "Respiratory Medicine",
    "bronchitis": "Respiratory Medicine",
    "tuberculosis": "Respiratory Medicine",

    # Gastroenterology
    "gastritis": "Gastroenterology",
    "ulcer": "Gastroenterology",
    "ibs": "Gastroenterology",
    "crohn's disease": "Gastroenterology",
    "hepatitis": "Gastroenterology",
    "cirrhosis": "Gastroenterology",

    # Endocrinology
    "diabetes": "Endocrinology",
    "thyroid disorder": "Endocrinology",
    "hyperthyroidism": "Endocrinology",
    "hypothyroidism": "Endocrinology",

    # Orthopedics
    "fracture": "Orthopaedics",
    "arthritis": "Orthopaedics",
    "osteoporosis": "Orthopaedics",
    "back pain": "Orthopaedics",

    # Dermatology
    "eczema": "Dermatology",
    "psoriasis": "Dermatology",
    "acne": "Dermatology",
    "skin infection": "Dermatology",

    # General Practice (fallback)
    "fever": "General Practice",
    "cold": "General Practice",
    "flu": "General Practice",
    "cough": "General Practice",
}

def get_department_for_disease(disease: str) -> str:
    """
    Get department for a disease using static mapping
    Falls back to General Practice if disease not found
    """
    disease_lower = disease.lower().strip()

    # Direct lookup
    if disease_lower in DISEASE_DEPARTMENT_MAP:
        return DISEASE_DEPARTMENT_MAP[disease_lower]

    # Partial match
    for disease_key, dept in DISEASE_DEPARTMENT_MAP.items():
        if disease_key in disease_lower or disease_lower in disease_key:
            return dept

    # Default fallback
    return "General Practice"
