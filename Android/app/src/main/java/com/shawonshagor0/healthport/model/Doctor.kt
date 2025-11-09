package com.shawonshagor0.healthport.model

import android.graphics.Bitmap
import android.location.Location
import android.media.Image

data class Doctor(
    val name: String,
    val department: String,
    val hospital: String,
    val email: String,
    val phone: String,
    val lat: Double,
    val long: Double,
    val schedule: String,
    val img: Int
)
