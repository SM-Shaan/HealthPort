//package com.shawonshagor0.healthport
//
//import android.view.LayoutInflater
//import android.view.ViewGroup
//import android.widget.Toast
//import androidx.recyclerview.widget.RecyclerView
//import com.shawonshagor0.healthport.databinding.ItemSymptomBinding
//
//class SymptomAdapter(
//    private val symptoms: List<String>
//) : RecyclerView.Adapter<SymptomAdapter.SymptomViewHolder>() {
//
//    inner class SymptomViewHolder(val binding: ItemSymptomBinding) :
//        RecyclerView.ViewHolder(binding.root)
//
//    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): SymptomViewHolder {
//        val binding = ItemSymptomBinding.inflate(LayoutInflater.from(parent.context), parent, false)
//        return SymptomViewHolder(binding)
//    }
//
//    override fun onBindViewHolder(holder: SymptomViewHolder, position: Int) {
//        val symptom = symptoms[position]
//        holder.binding.symptomButton.text = symptom
//
//        holder.binding.symptomButton.setOnClickListener {
//            Toast.makeText(holder.itemView.context, "Clicked: $symptom", Toast.LENGTH_SHORT).show()
//        }
//    }
//
//    override fun getItemCount() = symptoms.size
//}
//
//

package com.shawonshagor0.healthport

import android.graphics.Color
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.shawonshagor0.healthport.databinding.ItemSymptomBinding
import com.shawonshagor0.healthport.model.Symptom

class SymptomAdapter(
    private val symptoms: MutableList<Symptom>,
    private val onSymptomClick: (Symptom) -> Unit
) : RecyclerView.Adapter<SymptomAdapter.SymptomViewHolder>() {

    inner class SymptomViewHolder(val binding: ItemSymptomBinding) :
        RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): SymptomViewHolder {
        val binding = ItemSymptomBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return SymptomViewHolder(binding)
    }

    override fun onBindViewHolder(holder: SymptomViewHolder, position: Int) {
        val symptom = symptoms[position]
        holder.binding.symptomButton.text = symptom.name

        // Change button color based on selection
        if (symptom.isSelected) {
            holder.binding.symptomButton.setBackgroundColor(Color.parseColor("#81D4FA")) // light blue
        } else {
            holder.binding.symptomButton.setBackgroundColor(Color.parseColor("#E0E0E0")) // gray
        }

        holder.binding.symptomButton.setOnClickListener {
            symptom.isSelected = !symptom.isSelected
            notifyItemChanged(position)
            onSymptomClick(symptom)
        }
    }

    override fun getItemCount() = symptoms.size
}