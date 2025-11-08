import { useState, useEffect } from 'react';
import { DoctorInHospital } from '../services/hospitalService';
import { scheduleService, Schedule } from '../services/scheduleService';
import Button from './Button';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: DoctorInHospital | null;
  hospitalName: string;
  patientName: string;
  patientEmail: string;
  onSubmit: (scheduleId: number, date: string, time: string) => void;
}

const BookingModal = ({
  isOpen,
  onClose,
  doctor,
  hospitalName,
  patientName,
  patientEmail,
  onSubmit,
}: BookingModalProps) => {
  const [availableSchedules, setAvailableSchedules] = useState<Schedule[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [isLoadingSchedules, setIsLoadingSchedules] = useState(false);
  const [schedulesError, setSchedulesError] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  // Fetch available schedules when modal opens
  useEffect(() => {
    const fetchSchedules = async () => {
      if (isOpen && doctor) {
        setIsLoadingSchedules(true);
        setSchedulesError(null);
        setSelectedSchedule(null);
        setNotes('');
        setCurrentStep(1);

        try {
          const schedules = await scheduleService.getDoctorAvailableSchedules(doctor.docid);
          setAvailableSchedules(schedules);

          if (schedules.length === 0) {
            setSchedulesError('No available time slots found for this doctor.');
          }
        } catch (error) {
          console.error('Error fetching schedules:', error);
          setSchedulesError('Failed to load available time slots. Please try again.');
        } finally {
          setIsLoadingSchedules(false);
        }
      }
    };

    fetchSchedules();
  }, [isOpen, doctor]);

  if (!isOpen || !doctor) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSchedule) {
      onSubmit(selectedSchedule.scheduleid, selectedSchedule.scheduledate, selectedSchedule.scheduletime);
    }
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format time for display
  const formatTime = (timeStr: string) => {
    return timeStr;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary via-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">Book Your Appointment</h2>
              <p className="text-blue-100 text-sm mt-1">Complete the booking in 3 easy steps</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-between relative">
            {[1, 2, 3].map((step, index) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex items-center w-full">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                      currentStep >= step
                        ? 'bg-white text-primary'
                        : 'bg-white/20 text-white/60'
                    }`}
                  >
                    {step}
                  </div>
                  {index < 2 && (
                    <div
                      className={`flex-1 h-1 mx-2 rounded transition-all ${
                        currentStep > step ? 'bg-white' : 'bg-white/20'
                      }`}
                    ></div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs">
            <span className={currentStep >= 1 ? 'text-white font-semibold' : 'text-white/60'}>
              Review Details
            </span>
            <span className={currentStep >= 2 ? 'text-white font-semibold' : 'text-white/60'}>
              Select Time
            </span>
            <span className={currentStep >= 3 ? 'text-white font-semibold' : 'text-white/60'}>
              Confirm
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Review Details */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-fadeIn">
                {/* Doctor Information Card */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-2 border-blue-200 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 3H5c-1.1 0-1.99.9-1.99 2L3 19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.20.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Doctor Information</h3>
                      <p className="text-sm text-gray-600">Your healthcare provider</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Doctor Name</p>
                      <p className="font-semibold text-gray-900">{doctor.docname}</p>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Specialty</p>
                      <p className="font-semibold text-gray-900">{doctor.specialty_name}</p>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Hospital</p>
                      <p className="font-semibold text-gray-900">{hospitalName}</p>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Contact</p>
                      <p className="font-semibold text-gray-900">{doctor.doctel}</p>
                    </div>
                  </div>
                </div>

                {/* Patient Information Card */}
                <div className="bg-gradient-to-br from-green-50 to-green-100/50 border-2 border-green-200 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                      <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Patient Information</h3>
                      <p className="text-sm text-gray-600">Your details</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Full Name</p>
                      <p className="font-semibold text-gray-900">{patientName}</p>
                    </div>
                    <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Email Address</p>
                      <p className="font-semibold text-gray-900">{patientEmail}</p>
                    </div>
                  </div>
                </div>

                {/* Info Alert */}
                <div className="bg-blue-50 border-l-4 border-primary rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Review your information</p>
                      <p className="text-sm text-gray-600 mt-1">Please verify that all the details above are correct before proceeding to select your preferred time slot.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Select Time Slot */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Available Time Slots</h3>
                      <p className="text-sm text-gray-600">Choose your preferred appointment time</p>
                    </div>
                  </div>

                  {isLoadingSchedules && (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-primary mb-4"></div>
                      <p className="text-gray-600 font-medium">Loading available slots...</p>
                    </div>
                  )}

                  {schedulesError && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <svg className="w-6 h-6 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                        </svg>
                        <p className="text-red-700 font-medium">{schedulesError}</p>
                      </div>
                    </div>
                  )}

                  {!isLoadingSchedules && !schedulesError && availableSchedules.length > 0 && (
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                      {availableSchedules.map((schedule) => (
                        <button
                          key={schedule.scheduleid}
                          type="button"
                          onClick={() => setSelectedSchedule(schedule)}
                          className={`w-full p-5 rounded-xl border-2 transition-all text-left group ${
                            selectedSchedule?.scheduleid === schedule.scheduleid
                              ? 'border-primary bg-blue-50 shadow-md scale-[1.02]'
                              : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-sm'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center gap-4 flex-wrap">
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                                  selectedSchedule?.scheduleid === schedule.scheduleid
                                    ? 'bg-primary/10'
                                    : 'bg-gray-100 group-hover:bg-blue-100'
                                }`}>
                                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                  </svg>
                                  <span className="font-semibold text-gray-900 text-sm">
                                    {formatDate(schedule.scheduledate)}
                                  </span>
                                </div>
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                                  selectedSchedule?.scheduleid === schedule.scheduleid
                                    ? 'bg-primary/10'
                                    : 'bg-gray-100 group-hover:bg-blue-100'
                                }`}>
                                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                  </svg>
                                  <span className="font-semibold text-gray-900 text-sm">
                                    {formatTime(schedule.scheduletime)}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-600">Session:</span>
                                <span className="text-sm font-semibold text-gray-900">{schedule.title}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className={`px-4 py-2 rounded-lg text-sm font-bold ${
                                (schedule.available_slots ?? 0) > 5
                                  ? 'bg-green-100 text-green-800'
                                  : (schedule.available_slots ?? 0) > 2
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-orange-100 text-orange-800'
                              }`}>
                                <div className="text-center">
                                  <div className="text-2xl">{schedule.available_slots ?? 0}</div>
                                  <div className="text-xs opacity-75">of {schedule.nop} slots</div>
                                </div>
                              </div>
                              {selectedSchedule?.scheduleid === schedule.scheduleid && (
                                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                  </svg>
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Any specific concerns or requirements for your appointment..."
                  />
                </div>
              </div>
            )}

            {/* Step 3: Confirm Booking */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Review Your Appointment</h3>
                  <p className="text-gray-600">Please confirm all details are correct before submitting</p>
                </div>

                {/* Summary Card */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-2 border-blue-200 rounded-xl p-6 shadow-lg">
                  <h4 className="font-bold text-gray-900 mb-4 text-lg">Appointment Summary</h4>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between py-3 border-b border-blue-200/50">
                      <span className="text-gray-600 font-medium">Doctor</span>
                      <span className="text-gray-900 font-semibold text-right">{doctor.docname}</span>
                    </div>
                    <div className="flex items-start justify-between py-3 border-b border-blue-200/50">
                      <span className="text-gray-600 font-medium">Specialty</span>
                      <span className="text-gray-900 font-semibold text-right">{doctor.specialty_name}</span>
                    </div>
                    <div className="flex items-start justify-between py-3 border-b border-blue-200/50">
                      <span className="text-gray-600 font-medium">Hospital</span>
                      <span className="text-gray-900 font-semibold text-right">{hospitalName}</span>
                    </div>
                    {selectedSchedule && (
                      <>
                        <div className="flex items-start justify-between py-3 border-b border-blue-200/50">
                          <span className="text-gray-600 font-medium">Date</span>
                          <span className="text-gray-900 font-semibold text-right">{formatDate(selectedSchedule.scheduledate)}</span>
                        </div>
                        <div className="flex items-start justify-between py-3 border-b border-blue-200/50">
                          <span className="text-gray-600 font-medium">Time</span>
                          <span className="text-gray-900 font-semibold text-right">{formatTime(selectedSchedule.scheduletime)}</span>
                        </div>
                        <div className="flex items-start justify-between py-3 border-b border-blue-200/50">
                          <span className="text-gray-600 font-medium">Session</span>
                          <span className="text-gray-900 font-semibold text-right">{selectedSchedule.title}</span>
                        </div>
                      </>
                    )}
                    <div className="flex items-start justify-between py-3 border-b border-blue-200/50">
                      <span className="text-gray-600 font-medium">Patient</span>
                      <span className="text-gray-900 font-semibold text-right">{patientName}</span>
                    </div>
                    {notes && (
                      <div className="pt-3">
                        <span className="text-gray-600 font-medium block mb-2">Notes</span>
                        <p className="text-gray-900 bg-white/70 rounded-lg p-3 text-sm">{notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Important Notice */}
                <div className="bg-amber-50 border-l-4 border-amber-400 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-amber-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                    <div>
                      <p className="text-sm font-semibold text-amber-900 mb-1">Important Notice</p>
                      <p className="text-sm text-amber-800">This is a booking request. The hospital will contact you to confirm the final appointment details based on doctor availability.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer with Action Buttons */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex gap-3">
            {currentStep > 1 && (
              <Button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                variant="secondary"
                className="flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
                </svg>
                Back
              </Button>
            )}

            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              fullWidth={currentStep === 1}
            >
              Cancel
            </Button>

            {currentStep < 3 && (
              <Button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                variant="primary"
                fullWidth
                disabled={currentStep === 2 && !selectedSchedule}
                className="flex items-center justify-center gap-2"
              >
                {currentStep === 1 ? 'Continue to Time Selection' : 'Review Booking'}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                </svg>
              </Button>
            )}

            {currentStep === 3 && (
              <Button
                type="submit"
                onClick={handleSubmit}
                variant="primary"
                fullWidth
                disabled={!selectedSchedule || isLoadingSchedules}
                className="flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Confirm & Submit Booking
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
