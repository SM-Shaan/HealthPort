package com.shawonshagor0.healthport

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.LinearLayoutManager
import com.shawonshagor0.healthport.adapter.SymptomAdapter
import com.shawonshagor0.healthport.data.SymptomData
import com.shawonshagor0.healthport.databinding.FragmentDiagnosisBinding
import com.shawonshagor0.healthport.model.Symptom

class DiagnosisFragment : Fragment() {

    private var _binding: FragmentDiagnosisBinding? = null
    private val binding get() = _binding!!

    private lateinit var availableAdapter: SymptomAdapter
    private lateinit var selectedAdapter: SymptomAdapter

    private var selectedSymptoms = mutableListOf<Symptom>()

    private val allSymptoms = SymptomData.getEnabledSymptoms() // returns List<Symptom>
    private var currentIndex = 0
    private val pageSize = 5


    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentDiagnosisBinding.inflate(inflater, container, false)

        // Setup Adapters
        availableAdapter = SymptomAdapter(getEnabledSymptoms()) { onSymptomClick(it) }
        selectedAdapter = SymptomAdapter(selectedSymptoms) { onSelectedSymptomClick(it) }

        binding.btnArrowForward.setOnClickListener { showNextPage() }
        binding.btnArrowBack.setOnClickListener { showPrevPage() }



        binding.rvSelectSymptoms.layoutManager =
            LinearLayoutManager(requireContext(), LinearLayoutManager.VERTICAL, false)
        binding.rvSelectSymptoms.adapter = availableAdapter

        binding.rvSelectedSymptoms.layoutManager =
            LinearLayoutManager(requireContext(), LinearLayoutManager.VERTICAL, false)
        binding.rvSelectedSymptoms.adapter = selectedAdapter

        return binding.root
    }
    private fun getCurrentPage(): List<Symptom> {
        val start = currentIndex
        val end = (currentIndex + pageSize).coerceAtMost(allSymptoms.size)
        return allSymptoms.subList(start, end)
    }

    private fun showNextPage() {
        if (currentIndex + pageSize < allSymptoms.size) {
            currentIndex += pageSize
            availableAdapter.updateSymptoms(getCurrentPage())
        }
    }

    private fun showPrevPage() {
        if (currentIndex - pageSize >= 0) {
            currentIndex -= pageSize
            availableAdapter.updateSymptoms(getCurrentPage())
        }
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        binding.btnGetDiagnosis.setOnClickListener { findNavController().navigate(R.id.action_diagnosisFragment_to_diseaseFragment) }

    }

    private fun onSymptomClick(symptom: Symptom) {
        symptom.isSelected = true
        selectedSymptoms.add(symptom)
        updateLists()
    }

    private fun onSelectedSymptomClick(symptom: Symptom) {
        symptom.isSelected = false
        selectedSymptoms.remove(symptom)
        updateLists()
    }

    private fun updateLists() {
        availableAdapter.updateSymptoms(getEnabledSymptoms())
        selectedAdapter.updateSymptoms(selectedSymptoms)
    }

    private fun getEnabledSymptoms(): List<Symptom> {
        return allSymptoms.filter { it.isEnabled && !it.isSelected }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
