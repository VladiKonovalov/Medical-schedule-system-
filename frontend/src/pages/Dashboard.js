import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { appointmentsAPI, medicalFieldsAPI } from '../services/api';
import { formatDateTime } from '../utils/dateUtils';
import SearchBar from '../components/SearchBar';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [medicalFields, setMedicalFields] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [upcomingRes, pastRes, fieldsRes] = await Promise.all([
        appointmentsAPI.getUpcoming(),
        appointmentsAPI.getPast(),
        medicalFieldsAPI.getAll(),
      ]);
      
      setUpcomingAppointments(Array.isArray(upcomingRes.data) ? upcomingRes.data : []);
      setPastAppointments(Array.isArray(pastRes.data) ? pastRes.data : []);
      setMedicalFields(Array.isArray(fieldsRes.data) ? fieldsRes.data : []);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setUpcomingAppointments([]);
      setPastAppointments([]);
      setMedicalFields([]);
    } finally {
      setLoading(false);
    }
  };

  const isNewUser = upcomingAppointments.length === 0 && pastAppointments.length === 0;

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Medical Scheduling System</h1>
        <div className="header-actions">
          <button 
            className="btn btn-primary" 
            onClick={() => navigate('/appointments')}
          >
            My Appointments
          </button>
          <span>Welcome, {user?.phone || 'User'}</span>
          <button className="btn btn-secondary" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <div className="container">
        <SearchBar />
        {isNewUser ? (
          <div className="new-user-welcome">
            <div className="card">
              <h2>Welcome to Medical Scheduling System!</h2>
              <p>We're here to help you manage your healthcare appointments easily.</p>
              <button 
                className="btn btn-primary" 
                onClick={() => navigate('/booking')}
                style={{ marginTop: '20px' }}
              >
                Book Your First Appointment
              </button>
            </div>

            <div className="card">
              <h3>Available Medical Services</h3>
              <div className="services-grid">
                {medicalFields.map((field) => (
                  <div key={field.id} className="service-card">
                    <h4>{field.name}</h4>
                    <p>{field.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="returning-user-dashboard">
            <div className="dashboard-actions">
              <button 
                className="btn btn-primary" 
                onClick={() => navigate('/booking')}
              >
                Book New Appointment
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => navigate('/appointments')}
              >
                View All Appointments
              </button>
            </div>

            <div className="card">
              <h2>Upcoming Appointments</h2>
              {upcomingAppointments.length === 0 ? (
                <p>No upcoming appointments</p>
              ) : (
                <div className="appointments-list">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="appointment-item">
                      <div>
                        <h4>{appointment.doctorName}</h4>
                        <p>{appointment.medicalFieldName}</p>
                        <p>{formatDateTime(appointment.appointmentDate)}</p>
                      </div>
                      <div className="appointment-actions">
                        <button 
                          className="btn btn-secondary"
                          onClick={() => navigate(`/appointments?reschedule=${appointment.id}`)}
                        >
                          Reschedule
                        </button>
                        <button 
                          className="btn btn-danger"
                          onClick={async () => {
                            if (window.confirm('Cancel this appointment?')) {
                              await appointmentsAPI.cancel(appointment.id);
                              loadDashboardData();
                            }
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card">
              <h2>Past Appointments</h2>
              {pastAppointments.length === 0 ? (
                <p>No past appointments</p>
              ) : (
                <div className="appointments-list">
                  {pastAppointments.slice(0, 5).map((appointment) => (
                    <div key={appointment.id} className="appointment-item past">
                      <div>
                        <h4>{appointment.doctorName}</h4>
                        <p>{appointment.medicalFieldName}</p>
                        <p>{formatDateTime(appointment.appointmentDate)}</p>
                        <p className="status">{appointment.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

