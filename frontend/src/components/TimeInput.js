import React, { useState, useEffect } from 'react';

const TimeInput = ({ value, onChange, required, id, label, error }) => {
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    if (value) {
      setDisplayValue(value);
    } else {
      setDisplayValue('');
    }
  }, [value]);

  const formatTime = (input) => {
    // Remove all non-digits
    const digits = input.replace(/\D/g, '');
    
    if (digits.length === 0) return '';
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}:${digits.slice(2, 4)}`;
  };

  const handleChange = (e) => {
    const inputValue = e.target.value;
    const formatted = formatTime(inputValue);
    setDisplayValue(formatted);
    
    // Validate and convert to HH:mm format
    if (formatted.length === 5 && formatted.match(/^\d{2}:\d{2}$/)) {
      const [hours, minutes] = formatted.split(':');
      const hourNum = parseInt(hours, 10);
      const minNum = parseInt(minutes, 10);
      
      if (hourNum >= 0 && hourNum <= 23 && minNum >= 0 && minNum <= 59) {
        if (onChange) {
          onChange({ target: { value: formatted } });
        }
      }
    } else if (formatted === '') {
      if (onChange) {
        onChange({ target: { value: '' } });
      }
    }
  };

  const handleBlur = () => {
    // Validate on blur
    if (displayValue && displayValue.length < 5) {
      setDisplayValue('');
      if (onChange) {
        onChange({ target: { value: '' } });
      }
    } else if (displayValue && displayValue.length === 5) {
      const [hours, minutes] = displayValue.split(':');
      const hourNum = parseInt(hours, 10);
      const minNum = parseInt(minutes, 10);
      
      if (hourNum < 0 || hourNum > 23 || minNum < 0 || minNum > 59) {
        setDisplayValue('');
        if (onChange) {
          onChange({ target: { value: '' } });
        }
      }
    }
  };

  const handleKeyDown = (e) => {
    // Allow backspace, delete, tab, escape, enter, colon
    if ([8, 9, 27, 13, 46, 186].indexOf(e.keyCode) !== -1 ||
      // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (e.keyCode === 65 && e.ctrlKey === true) ||
      (e.keyCode === 67 && e.ctrlKey === true) ||
      (e.keyCode === 86 && e.ctrlKey === true) ||
      (e.keyCode === 88 && e.ctrlKey === true) ||
      // Allow home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)) {
      return;
    }
    // Ensure that it is a number
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  };

  return (
    <div>
      {label && <label htmlFor={id} style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>{label}</label>}
      <input
        type="text"
        id={id}
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder="HH:mm (e.g., 14:30)"
        maxLength={5}
        required={required}
        style={{
          width: '100%',
          padding: '10px',
          border: error ? '1px solid #dc3545' : '1px solid #ddd',
          borderRadius: '4px',
          fontSize: '16px',
          fontFamily: 'inherit'
        }}
      />
      {error && <div className="error" style={{ marginTop: '5px' }}>{error}</div>}
      {!displayValue && (
        <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '5px' }}>
          Enter time as: HH:mm (24-hour format, e.g., 14:30 for 2:30 PM)
        </small>
      )}
    </div>
  );
};

export default TimeInput;

