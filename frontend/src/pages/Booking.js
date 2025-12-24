import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { medicalFieldsAPI, doctorsAPI, timeSlotsAPI, appointmentsAPI } from '../services/api';
import { formatDate, getMinDate, validateDate, isPastDate, formatLocalDateTimeToISO } from '../utils/dateUtils';
import DateInput from '../components/DateInput';
import TimeInput from '../components/TimeInput';
import './Booking.css';

const Booking = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form data
  const [medicalFields, setMedicalFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [notes, setNotes] = useState('');

  const loadMedicalFields = useCallback(async () => {
    try {
      const response = await medicalFieldsAPI.getAll();
      setMedicalFields(response.data);
    } catch (error) {
      setError('Failed to load medical fields');
    }
  }, []);

  const loadDoctors = useCallback(async () => {
    if (!selectedField) return;
    try {
      const response = await doctorsAPI.getByField(selectedField);
      setDoctors(response.data);
    } catch (error) {
      setError('Failed to load doctors');
    }
  }, [selectedField]);

  const loadTimeSlots = useCallback(async () => {
    if (!selectedDoctor || !selectedDate) return;
    try {
      const response = await timeSlotsAPI.getAvailable(selectedDoctor, selectedDate);
      setAvailableSlots(response.data);
    } catch (error) {
      setError('Failed to load time slots');
    }
  }, [selectedDoctor, selectedDate]);

  useEffect(() => {
    loadMedicalFields();
  }, [loadMedicalFields]);

  useEffect(() => {
    if (selectedField) {
      loadDoctors();
    }
  }, [selectedField, loadDoctors]);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      loadTimeSlots();
    }
  }, [selectedDoctor, selectedDate, loadTimeSlots]);

  const handleNext = () => {
    setError('');
    if (step === 1 && !selectedField) {
      setError('Please select a medical field');
      return;
    }
    if (step === 2 && !selectedDoctor) {
      setError('Please select a doctor');
      return;
    }
    if (step === 3) {
      if (!selectedDate || !selectedSlot) {
        setError('Please select a date and time slot');
        return;
      }
      // Validate date is not in the past
      if (isPastDate(selectedDate)) {
        setError('Cannot select a past date. Please choose a future date.');
        setSelectedDate('');
        setSelectedSlot('');
        setAvailableSlots([]);
        return;
      }
      if (!validateDate(selectedDate)) {
        setError('Please select a valid future date');
        setSelectedDate('');
        setSelectedSlot('');
        setAvailableSlots([]);
        return;
      }
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setError('');
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const isoDate = formatLocalDateTimeToISO(selectedDate, selectedSlot);
      
      if (!isoDate) {
        setError('Invalid date or time format');
        setLoading(false);
        return;
      }
      
      await appointmentsAPI.create({
        doctorId: selectedDoctor,
        appointmentDate: isoDate,
        notes: notes,
      });

      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to book appointment');
      setLoading(false);
    }
  };


  return (
    <div className="booking-container">
      <div className="container">
        <div className="booking-header">
          <h1>Book Appointment</h1>
          <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
            Cancel
          </button>
        </div>

        <div className="step-indicator">
          <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            {step > 1 ? '✓' : '1'}
          </div>
          <div className={`step-line ${step > 1 ? 'completed' : ''}`}></div>
          <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            {step > 2 ? '✓' : '2'}
          </div>
          <div className={`step-line ${step > 2 ? 'completed' : ''}`}></div>
          <div className={`step ${step >= 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>
            {step > 3 ? '✓' : '3'}
          </div>
          <div className={`step-line ${step > 3 ? 'completed' : ''}`}></div>
          <div className={`step ${step >= 4 ? 'active' : ''}`}>4</div>
        </div>

        <div className="card">
          {error && <div className="error">{error}</div>}

          {step === 1 && (
            <div className="booking-step">
              <h2>Select Medical Field</h2>
              <div className="fields-grid">
                {medicalFields.map((field) => (
                  <div
                    key={field.id}
                    className={`field-card ${selectedField === field.id ? 'selected' : ''}`}
                    onClick={() => setSelectedField(field.id)}
                  >
                    <h3>{field.name}</h3>
                    <p>{field.description}</p>
                  </div>
                ))}
              </div>
              <div className="step-actions">
                <button className="btn btn-primary" onClick={handleNext}>
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="booking-step">
              <h2>Select Doctor</h2>
              <div className="doctors-list">
                {doctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className={`doctor-card ${selectedDoctor === doctor.id ? 'selected' : ''}`}
                    onClick={() => setSelectedDoctor(doctor.id)}
                  >
                    <h3>{doctor.name}</h3>
                    <p>{doctor.experienceYears} years of experience</p>
                  </div>
                ))}
              </div>
              <div className="step-actions">
                <button className="btn btn-secondary" onClick={handleBack}>
                  Back
                </button>
                <button className="btn btn-primary" onClick={handleNext}>
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="booking-step">
              <h2>Select Date and Time</h2>
              <div className="form-group">
                <DateInput
                  id="date"
                  label="Select Date"
                  value={selectedDate}
                  onChange={(e) => {
                    const selected = e.target.value;
                    if (selected && isPastDate(selected)) {
                      setError('Cannot select a past date. Please choose a future date.');
                      setSelectedDate('');
                      setSelectedSlot('');
                      setAvailableSlots([]);
                    } else {
                      setError('');
                      setSelectedDate(selected);
                      setSelectedSlot(''); // Reset slot when date changes
                    }
                  }}
                  min={getMinDate()}
                  required
                  error={selectedDate && isPastDate(selectedDate) ? 'Cannot select a past date' : ''}
                />
              </div>
              {selectedDate && (
                <div className="form-group">
                  <label>Available Time Slots</label>
                  <div className="slots-grid">
                    {availableSlots.length === 0 ? (
                      <p>No available slots for this date</p>
                    ) : (
                      availableSlots.map((slot, index) => (
                        <button
                          key={index}
                          className={`slot-btn ${selectedSlot === slot ? 'selected' : ''}`}
                          onClick={() => setSelectedSlot(slot)}
                        >
                          {slot}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
              <div className="step-actions">
                <button className="btn btn-secondary" onClick={handleBack}>
                  Back
                </button>
                <button className="btn btn-primary" onClick={handleNext}>
                  Next
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="booking-step">
              <h2>Confirm Appointment</h2>
              <div className="confirmation-details">
                <div className="detail-row">
                  <strong>Medical Field:</strong>
                  <span>{medicalFields.find(f => f.id === selectedField)?.name}</span>
                </div>
                <div className="detail-row">
                  <strong>Doctor:</strong>
                  <span>{doctors.find(d => d.id === selectedDoctor)?.name}</span>
                </div>
                <div className="detail-row">
                  <strong>Date:</strong>
                  <span>{formatDate(selectedDate)}</span>
                </div>
                <div className="detail-row">
                  <strong>Time:</strong>
                  <span>{selectedSlot}</span>
                </div>
                <div className="form-group">
                  <label htmlFor="notes">Additional Notes (Optional)</label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows="4"
                    placeholder="Any additional information..."
                  />
                </div>
              </div>
              <div className="step-actions">
                <button className="btn btn-secondary" onClick={handleBack}>
                  Back
                </button>
                <button 
                  className="btn btn-primary" 
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? 'Booking...' : 'Confirm Appointment'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Booking;

