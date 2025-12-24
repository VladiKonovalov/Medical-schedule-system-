import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { appointmentsAPI } from '../services/api';
import { formatDateTime, formatDate, getMinDate, validateDate, isPastDate, formatLocalDateTimeToISO } from '../utils/dateUtils';
import DateInput from '../components/DateInput';
import TimeInput from '../components/TimeInput';
import './Appointments.css';

const Appointments = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'past'
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [rescheduleLoading, setRescheduleLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const rescheduleId = searchParams.get('reschedule');
    if (rescheduleId && appointments.length > 0 && !showRescheduleModal) {
      const appointment = appointments.find(a => a.id === parseInt(rescheduleId));
      if (appointment) {
        setSelectedAppointment(appointment);
        const currentDate = new Date(appointment.appointmentDate);
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        
        const dateStr = `${year}-${month}-${day}`; // YYYY-MM-DD
        const timeStr = `${hours}:${minutes}`; // HH:mm
        setNewDate(dateStr);
        setNewTime(timeStr);
        setShowRescheduleModal(true);
      }
    }
  }, [searchParams, appointments, showRescheduleModal]);

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    try {
      let response;
      if (filter === 'upcoming') {
        response = await appointmentsAPI.getUpcoming();
      } else if (filter === 'past') {
        response = await appointmentsAPI.getPast();
      } else {
        response = await appointmentsAPI.getAll();
      }
      setAppointments(response.data);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await appointmentsAPI.cancel(id);
        loadAppointments();
      } catch (error) {
        alert(error.response?.data?.error || 'Failed to cancel appointment');
      }
    }
  };

  const handleReschedule = async () => {
    if (!newDate || !newTime) {
      setError('Please select both date and time');
      return;
    }

    // Validate date is not in the past
    if (isPastDate(newDate)) {
      setError('Cannot select a past date. Please choose a future date.');
      return;
    }

    if (!validateDate(newDate)) {
      setError('Please select a valid future date');
      return;
    }

    // Validate the combined date and time is not in the past
    const appointmentDateTime = new Date(`${newDate}T${newTime}`);
    if (appointmentDateTime < new Date()) {
      setError('Cannot reschedule to a past date and time. Please choose a future date and time.');
      return;
    }

    setRescheduleLoading(true);
    setError('');

    try {
      const isoDate = formatLocalDateTimeToISO(newDate, newTime);
      
      if (!isoDate) {
        setError('Invalid date or time format');
        setRescheduleLoading(false);
        return;
      }
      
      await appointmentsAPI.reschedule(selectedAppointment.id, isoDate);
      
      setShowRescheduleModal(false);
      setSelectedAppointment(null);
      setNewDate('');
      setNewTime('');
      setError('');
      setRescheduleLoading(false);
      
      if (searchParams.get('reschedule')) {
        setSearchParams({});
      }
      setTimeout(() => {
        loadAppointments().catch(err => {
          console.error('Error reloading appointments:', err);
        });
      }, 100);
      
    } catch (error) {
      console.error('Reschedule error:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to reschedule appointment';
      setError(errorMessage);
      setRescheduleLoading(false);
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="appointments-page">
      <header className="dashboard-header">
        <h1>My Appointments</h1>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => navigate('/booking')}>
            Book New Appointment
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
            Dashboard
          </button>
          <button className="btn btn-secondary" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <div className="container">
        <div className="filter-tabs">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
            onClick={() => setFilter('upcoming')}
          >
            Upcoming
          </button>
          <button
            className={`filter-btn ${filter === 'past' ? 'active' : ''}`}
            onClick={() => setFilter('past')}
          >
            Past
          </button>
        </div>

        {appointments.length === 0 ? (
          <div className="card">
            <p>No appointments found</p>
          </div>
        ) : (
          <div className="appointments-list">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="card appointment-card">
                <div className="appointment-info">
                  <h3>{appointment.doctorName}</h3>
                  <p className="field">{appointment.medicalFieldName}</p>
                  <p className="date">
                    {formatDateTime(appointment.appointmentDate)}
                  </p>
                  <p className={`status status-${appointment.status.toLowerCase()}`}>
                    {appointment.status}
                  </p>
                  {appointment.notes && (
                    <p className="notes">Notes: {appointment.notes}</p>
                  )}
                </div>
                {(appointment.status === 'SCHEDULED' || appointment.status === 'RESCHEDULED') && 
                 new Date(appointment.appointmentDate) > new Date() && (
                  <div className="appointment-actions">
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setSelectedAppointment(appointment);
                        const currentDate = new Date(appointment.appointmentDate);
                        const year = currentDate.getFullYear();
                        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
                        const day = String(currentDate.getDate()).padStart(2, '0');
                        const hours = String(currentDate.getHours()).padStart(2, '0');
                        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
                        
                        const dateStr = `${year}-${month}-${day}`; // YYYY-MM-DD
                        const timeStr = `${hours}:${minutes}`; // HH:mm
                        setNewDate(dateStr);
                        setNewTime(timeStr);
                        setError('');
                        setShowRescheduleModal(true);
                      }}
                    >
                      Reschedule
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleCancel(appointment.id)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showRescheduleModal && selectedAppointment && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Reschedule Appointment</h2>
              <button className="close-btn" onClick={() => {
                setShowRescheduleModal(false);
                setSelectedAppointment(null);
                setNewDate('');
                setNewTime('');
                setError('');
              }}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                <p style={{ margin: '5px 0' }}><strong>Doctor:</strong> {selectedAppointment.doctorName}</p>
                <p style={{ margin: '5px 0' }}><strong>Current Date & Time:</strong> {formatDateTime(selectedAppointment.appointmentDate)}</p>
              </div>
              
              <div className="form-group">
                <DateInput
                  id="reschedule-date"
                  label="New Date (dd/mm/yyyy)"
                  value={newDate}
                  onChange={(e) => {
                    const selected = e.target.value;
                    setError(''); // Clear error when date changes
                    if (selected && isPastDate(selected)) {
                      setError('Cannot select a past date. Please choose a future date.');
                      setNewDate('');
                    } else {
                      setNewDate(selected);
                      // Validate combined date+time if both are set
                      if (selected && newTime) {
                        const combined = new Date(`${selected}T${newTime}`);
                        if (combined < new Date()) {
                          setError('The selected date and time is in the past. Please choose a future date and time.');
                        }
                      }
                    }
                  }}
                  min={getMinDate()}
                  required
                />
              </div>
              
              <div className="form-group">
                <TimeInput
                  id="reschedule-time"
                  label="New Time (HH:mm - 24 hour format)"
                  value={newTime}
                  onChange={(e) => {
                    const selected = e.target.value;
                    setNewTime(selected);
                    setError(''); // Clear error when time changes
                    // Validate combined date+time if both are set
                    if (selected && newDate) {
                      const combined = new Date(`${newDate}T${selected}`);
                      if (combined < new Date()) {
                        setError('The selected date and time is in the past. Please choose a future date and time.');
                      }
                    }
                  }}
                  required
                />
              </div>

              {error && <div className="error" style={{ marginTop: '10px' }}>{error}</div>}

              <div className="modal-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowRescheduleModal(false);
                    setSelectedAppointment(null);
                    setNewDate('');
                    setNewTime('');
                    setError('');
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleReschedule}
                  disabled={rescheduleLoading}
                >
                  {rescheduleLoading ? 'Rescheduling...' : 'Confirm Reschedule'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;

