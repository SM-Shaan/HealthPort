package com.shawonshagor0.healthport.data

import android.content.Context
import android.location.Location
import com.shawonshagor0.healthport.R
import com.shawonshagor0.healthport.model.Doctor

object DoctorData {

    fun getInitialDoctors(context: Context): List<Doctor>{
        return listOf(
            Doctor(
                "অধ্যাপক শামসুল আরেফিন",
                context.getString(R.string.orthopedics),
                context.getString(R.string.apollo),
                "john.mckinley@examplepetstore.com",
                "123-456-7890",
                40.7128,
                -74.0060,
                "সোম–বৃহঃ, সন্ধ্যা ৭টা–রাত ১০টা",
                ""
            ),
            Doctor(
                "সহকারি অধ্যাপক খন্দকার মোস্তাক",
                context.getString(R.string.orthopedics),
                context.getString(R.string.square),
                "james.francis.byrnes@example-pet-store.com",
                "987-654-3210",
                34.0522,
                -118.243,
                "সোম–বৃহঃ, সন্ধ্যা ৭টা–রাত ১০টা",
                ""

            ),
            Doctor(
                "সহকারি অধ্যাপক আহসান হাবিব",
                context.getString(R.string.orthopedics),
                context.getString(R.string.labaid),
                "james.moore.wayne@example-pet-store.com",
                "555-555-5555",
                51.5074,
                -0.1278,
                "সোম–বৃহঃ, সন্ধ্যা ৭টা–রাত ১০টা",
                ""

            ),
            Doctor(
                "সহকারি অধ্যাপক মাহমুদ হোসাইন",
                context.getString(R.string.cardiology),
                context.getString(R.string.apollo),
                "john.mclean@examplepetstore.com",
                "111-222-3333",
                37.7749,
                -122.41,
                "সোম–বৃহঃ, সন্ধ্যা ৭টা–রাত ১০টা",
                ""

            )
        )
    }

    fun getDoctors(dept:String, lat:Double, long:Double, context: Context): List<Doctor> {
        var doctors:List<Doctor> =  getInitialDoctors(context).filter { it.department == dept }
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