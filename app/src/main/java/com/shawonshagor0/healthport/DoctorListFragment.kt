package com.shawonshagor0.healthport

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import com.shawonshagor0.healthport.adapter.DoctorAdapter
import com.shawonshagor0.healthport.data.DoctorData
import com.shawonshagor0.healthport.databinding.FragmentDoctorListBinding

class DoctorListFragment : Fragment() {

    private var _binding: FragmentDoctorListBinding? = null
    private val binding get() = _binding!!

    private lateinit var adapter: DoctorAdapter

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentDoctorListBinding.inflate(inflater, container, false)

        val sortedDoctors = DoctorData.getDoctors("Cardiology", 0.0, 0.0)

        // Set up RecyclerView
        adapter = DoctorAdapter(sortedDoctors)
        binding.rvDoctorList.layoutManager =
            LinearLayoutManager(requireContext(), LinearLayoutManager.VERTICAL, false)
        binding.rvDoctorList.adapter = adapter

        return binding.root
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
