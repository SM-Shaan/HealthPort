package com.shawonshagor0.healthport.data

import com.shawonshagor0.healthport.model.Symptom

object SymptomData {

    val initialSymptoms = listOf(
        Symptom("Fever", false, true),
        Symptom("Cough", false, true),
        Symptom("Headache", false, true),
        Symptom("Fatigue", false, true),
        Symptom("Sore Throat", false, true),
        Symptom("Nausea", false, true),
        Symptom("Dizziness", false, true),
        Symptom("Vomiting", false, false),
        Symptom("Body Ache", false, false),
        Symptom("Cold", false, false),
        Symptom("Shortness of Breath", false, false),
        Symptom("Blurred Vision", false, false),
        Symptom("Chest Pain", false, false),
        Symptom("Muscle Pain", false, false),
        Symptom("Joint Pain", false, false),
        Symptom("Back Pain", false, false),
    )
    fun getEnabledSymptoms(): List<Symptom> {
        return initialSymptoms.filter { it.isEnabled }
    }
    fun getSelectedSymptoms(): List<Symptom> {
        return initialSymptoms.filter { it.isSelected }
    }

}