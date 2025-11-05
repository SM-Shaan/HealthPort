package com.shawonshagor0.healthport.data

import android.location.Location
import com.shawonshagor0.healthport.model.Doctor

object DoctorData {
    val initialDoctors = listOf(
        Doctor(
            "John",
            "Cardiology",
            "Apollo Hospital",
            "john.mckinley@examplepetstore.com",
            "123-456-7890",
            40.7128,
            -74.0060,
            "Monday-Thursday, 7:00pm-10:00pm"
        ),
        Doctor(
            "Jane",
            "Cardiology",
            "Square Hospital",
            "james.francis.byrnes@example-pet-store.com",
            "987-654-3210",
            34.0522,
            -118.243,
            "Monday-Thursday, 7:00pm-10:00pm"

        ),
        Doctor(
            "Bob",
            "Cardiology",
            "Labaid Hospital",
            "james.moore.wayne@example-pet-store.com",
            "555-555-5555",
            51.5074,
            -0.1278,
            "Monday-Thursday, 7:00pm-10:00pm"

        ),
        Doctor(
            "Alice",
            "Pediatrics",
            "Apollo Hospital",
            "john.mclean@examplepetstore.com",
            "111-222-3333",
            37.7749,
            -122.41,
            "Monday-Thursday, 7:00pm-10:00pm"

        )
    )

    fun getDoctors(dept:String, lat:Double, long:Double): List<Doctor> {
        var doctors:List<Doctor> =  initialDoctors.filter { it.department == dept }
        //sort via distance
        doctors = doctors.sortedBy {
            val doctorLocation = Location("doctor").apply {
                latitude = it.lat
                longitude = it.long
            }
            val userLocation = Location("user").apply {
                latitude = lat
                longitude = long
            }
            doctorLocation.distanceTo(userLocation)
        }
        return doctors
    }
}