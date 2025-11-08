package com.shawonshagor0.healthport.model

import android.location.Location

data class Doctor(
    val name: String,
    val department: String,
    val hospital: String,
    val email: String,
    val phone: String,
    val lat: Double,
    val long: Double,
    val schedule: String,
    val img: String
)
