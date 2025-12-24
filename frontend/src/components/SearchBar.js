import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchAPI } from '../services/api';
import './SearchBar.css';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) {
      setResults(null);
      return;
    }

    setLoading(true);
    try {
      const response = await searchAPI.search(query);
      setResults(response.data);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorClick = (doctor) => {
    navigate(`/booking?doctorId=${doctor.id}&fieldId=${doctor.medicalField.id}`);
    setShowResults(false);
    setQuery('');
  };

  const handleFieldClick = (field) => {
    navigate(`/booking?fieldId=${field.id}`);
    setShowResults(false);
    setQuery('');
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search doctors or specialties..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!e.target.value.trim()) {
              setResults(null);
              setShowResults(false);
            }
          }}
          onFocus={() => {
            if (results) setShowResults(true);
          }}
          className="search-input"
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {showResults && results && (
        <div className="search-results">
          {results.doctors.length > 0 && (
            <div className="results-section">
              <h4>Doctors</h4>
              {results.doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="result-item"
                  onClick={() => handleDoctorClick(doctor)}
                >
                  <strong>{doctor.name}</strong>
                  <span>{doctor.medicalField.name}</span>
                  {doctor.experienceYears && (
                    <span className="experience">{doctor.experienceYears} years exp.</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {results.medicalFields.length > 0 && (
            <div className="results-section">
              <h4>Specialties</h4>
              {results.medicalFields.map((field) => (
                <div
                  key={field.id}
                  className="result-item"
                  onClick={() => handleFieldClick(field)}
                >
                  <strong>{field.name}</strong>
                  <span>{field.description}</span>
                </div>
              ))}
            </div>
          )}

          {results.doctors.length === 0 && results.medicalFields.length === 0 && (
            <div className="no-results">No results found</div>
          )}

          <button
            className="close-results"
            onClick={() => {
              setShowResults(false);
              setQuery('');
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;

