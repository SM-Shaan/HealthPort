package com.shawonshagor0.healthport

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.navigation.fragment.findNavController
import com.shawonshagor0.healthport.databinding.FragmentAppointmentBinding
import java.util.Calendar


class AppointmentFragment : Fragment() {

    private var _binding: FragmentAppointmentBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentAppointmentBinding.inflate(inflater, container, false)

        binding.cvDatePicker.minDate = System.currentTimeMillis() //TODO: Now, it only works for today. But need to implement the min date from server by querying available date.
        binding.cvDatePicker.setOnDateChangeListener { view, year, month, dayOfMonth ->
            val calendar = Calendar.getInstance().apply {
                set(year, month, dayOfMonth)
            }
            val dayOfWeek = calendar.get(Calendar.DAY_OF_WEEK)

            if (dayOfWeek == Calendar.FRIDAY || dayOfWeek == Calendar.SATURDAY){
                Toast.makeText(requireContext(), "Appointment is not available on $dayOfWeek", Toast.LENGTH_SHORT).show()
                binding.cvDatePicker.date = System.currentTimeMillis()
            }
            else{
                binding.btnBookAppointment.visibility = View.VISIBLE
            }
        }

        binding.btnBookAppointment.setOnClickListener {
            Toast.makeText(requireContext(), "Appointment Booked", Toast.LENGTH_SHORT).show()
            binding.btnBookAppointment.setOnClickListener { findNavController().navigate(R.id.action_appointmentFragment_to_bookingConfirmationFragment) }


        }
        return binding.root
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}