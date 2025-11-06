package com.shawonshagor0.healthport

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.navigation.fragment.findNavController
import com.shawonshagor0.healthport.databinding.FragmentBookingConfirmationBinding


class BookingConfirmationFragment : Fragment() {
    private var _binding : FragmentBookingConfirmationBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        _binding = FragmentBookingConfirmationBinding.inflate(inflater, container, false)
        binding.btnBookAppointment.setOnClickListener { findNavController().navigate(R.id.action_bookingConfirmationFragment_to_homeFragment) }
        return binding.root

    }
}