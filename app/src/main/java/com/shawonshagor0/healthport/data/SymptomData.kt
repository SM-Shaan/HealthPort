package com.shawonshagor0.healthport.data

import android.content.Context
import com.shawonshagor0.healthport.R
import com.shawonshagor0.healthport.model.Symptom

object SymptomData {

    fun getInitialSymptoms(context: Context): List<Symptom> {
        return listOf(
            Symptom(context.getString(R.string.joint_pain), false, true),
            Symptom(context.getString(R.string.fever), false, true),
            Symptom(context.getString(R.string.cough), false, true),
            Symptom(context.getString(R.string.muscle_pain), false, true),
            Symptom(context.getString(R.string.headache), false, true),
            Symptom(context.getString(R.string.diarrhea), false, true),
            Symptom(context.getString(R.string.nausea), false, true),
            Symptom(context.getString(R.string.fatigue), false, true),
            Symptom(context.getString(R.string.body_ache), false, true)
        )
    }

    fun getEnabledSymptoms(context: Context): List<Symptom> {
        return getInitialSymptoms(context).filter { it.isEnabled }
    }
    fun getSelectedSymptoms(context: Context): List<Symptom> {
        return getInitialSymptoms(context).filter { it.isSelected }
    }

}