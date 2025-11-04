package com.shawonshagor0.healthport

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import com.shawonshagor0.healthport.databinding.FragmentDiagnosisBinding
import com.shawonshagor0.healthport.model.Symptom

class DiagnosisFragment : Fragment() {

    private var _binding: FragmentDiagnosisBinding? = null
    private val binding get() = _binding!!

    private lateinit var adapter: SymptomAdapter
    private val symptoms = mutableListOf(
        Symptom("Fever"),
        Symptom("Headache"),
        Symptom("Cough"),
        Symptom("Cold"),
        Symptom("Fatigue"),
        Symptom("Sore Throat"),
        Symptom("Nausea"),
        Symptom("Body Ache"),
        Symptom("Dizziness"),
        Symptom("Vomiting")
    )

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?
    ): View {
        _binding = FragmentDiagnosisBinding.inflate(inflater, container, false)

        setupRecyclerView()
        return binding.root
    }

    private fun setupRecyclerView() {
        adapter = SymptomAdapter(symptoms) { symptom ->
            Toast.makeText(requireContext(), "${symptom.name} ${if (symptom.isSelected) "selected" else "deselected"}", Toast.LENGTH_SHORT).show()
        }

        binding.symptomRecyclerView.apply {
            layoutManager = LinearLayoutManager(requireContext(), LinearLayoutManager.HORIZONTAL, false)
            adapter = this@DiagnosisFragment.adapter
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}