package com.shawonshagor0.healthport.model

data class Symptom(
    val name: String,
    var isSelected: Boolean = false,
    var isEnabled: Boolean = false
)