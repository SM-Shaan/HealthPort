package com.shawonshagor0.healthport.adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.RecyclerView
import com.shawonshagor0.healthport.R
import com.shawonshagor0.healthport.databinding.ItemSymptomBinding
import com.shawonshagor0.healthport.model.Symptom

class SymptomAdapter(
    private var symptoms: List<Symptom>,
    private val onSymptomClick: (Symptom) -> Unit
) : RecyclerView.Adapter<SymptomAdapter.SymptomViewHolder>() {

    inner class SymptomViewHolder(private val binding: ItemSymptomBinding) :
        RecyclerView.ViewHolder(binding.root) {
        fun bind(symptom: Symptom) {
            binding.btnSymptom.text = symptom.name
            val context = binding.root.context

            val bgColor = if (symptom.isSelected)
                ContextCompat.getColor(context, com.google.android.material.R.color.material_dynamic_secondary50)
            else
                ContextCompat.getColor(context, R.color.white)

            binding.btnSymptom.setBackgroundColor(bgColor)

            binding.btnSymptom.isEnabled = symptom.isEnabled
            binding.btnSymptom.setOnClickListener {
                if (symptom.isEnabled) onSymptomClick(symptom)
            }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): SymptomViewHolder {
        val binding = ItemSymptomBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return SymptomViewHolder(binding)
    }

    override fun onBindViewHolder(holder: SymptomViewHolder, position: Int) {
        holder.bind(symptoms[position])
    }

    override fun getItemCount(): Int = symptoms.size

    fun updateSymptoms(newSymptoms: List<Symptom>) {
        symptoms = newSymptoms
        notifyDataSetChanged()
    }
}
