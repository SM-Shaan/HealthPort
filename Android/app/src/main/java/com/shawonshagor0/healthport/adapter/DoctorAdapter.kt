package com.shawonshagor0.healthport.adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.shawonshagor0.healthport.R
import com.shawonshagor0.healthport.databinding.ItemDoctorBinding
import com.shawonshagor0.healthport.model.Doctor
import com.bumptech.glide.Glide
class DoctorAdapter (
    private var doctors: List<Doctor>,
    private val onBookAppointmentClick: (Doctor) -> Unit
): RecyclerView.Adapter<DoctorAdapter.DoctorViewHolder>() {
    inner class DoctorViewHolder(internal val binding: ItemDoctorBinding) :
        RecyclerView.ViewHolder(binding.root) {
        fun bind(doctor: Doctor) {
            binding.doctorName.text = doctor.name
            binding.doctorHospital.text = doctor.hospital
            binding.doctorDept.text = doctor.department
            binding.doctorAppointmentTime.text = doctor.schedule
            Glide.with(binding.root.context)
                .load(doctor.img)
                .into(binding.doctorImage)
            val context = binding.root.context
        }

    }
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): DoctorViewHolder {
        val binding = ItemDoctorBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return DoctorViewHolder(binding)
    }

    override fun onBindViewHolder(holder: DoctorViewHolder, position: Int) {
        holder.bind(doctors[position])
        holder.binding.btnBookAppointment.setOnClickListener {
            onBookAppointmentClick(doctors[position])
        }
    }

    override fun getItemCount(): Int = doctors.size

    fun updateDoctors(newDoctors: List<Doctor>) {
        doctors = newDoctors
        notifyDataSetChanged()
    }
}