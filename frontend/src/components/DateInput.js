import React, { useState, useEffect, useRef } from 'react';
import { isPastDate, validateDate, getMinDate } from '../utils/dateUtils';

const DateInput = ({ value, onChange, min, required, id, label, error }) => {
  const [displayValue, setDisplayValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  // Convert YYYY-MM-DD to DD/MM/YYYY for display
  const formatForDisplay = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    if (year && month && day) {
      return `${day}/${month}/${year}`;
    }
    return '';
  };

  // Convert DD/MM/YYYY to YYYY-MM-DD for input
  const parseFromDisplay = (displayString) => {
    if (!displayString) return '';
    // Remove any non-digit characters except /
    const cleaned = displayString.replace(/[^\d/]/g, '');
    const parts = cleaned.split('/').filter(p => p);
    
    if (parts.length >= 3) {
      const [day, month, year] = parts;
      // Validate and format
      if (day && month && year) {
        const dayNum = parseInt(day, 10);
        const monthNum = parseInt(month, 10);
        const yearNum = parseInt(year, 10);
        
        if (dayNum >= 1 && dayNum <= 31 && monthNum >= 1 && monthNum <= 12 && yearNum >= 1000 && yearNum <= 9999) {
          const formattedDay = String(dayNum).padStart(2, '0');
          const formattedMonth = String(monthNum).padStart(2, '0');
          return `${yearNum}-${formattedMonth}-${formattedDay}`;
        }
      }
    }
    return '';
  };

  // Auto-format as user types
  const formatInput = (input) => {
    // Remove all non-digits
    const digits = input.replace(/\D/g, '');
    
    if (digits.length === 0) return '';
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
  };

  useEffect(() => {
    if (value) {
      setDisplayValue(formatForDisplay(value));
    } else {
      setDisplayValue('');
    }
  }, [value]);

  const handleChange = (e) => {
    const inputValue = e.target.value;
    const formatted = formatInput(inputValue);
    setDisplayValue(formatted);
    
    // Try to parse when we have complete date (dd/mm/yyyy)
    if (formatted.length === 10 && formatted.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      const parsed = parseFromDisplay(formatted);
      if (parsed) {
        // Validate it's not a past date
        if (isPastDate(parsed)) {
          if (onChange) {
            onChange({ target: { value: '' } });
          }
          return;
        }
        if (validateDate(parsed)) {
          if (onChange) {
            onChange({ target: { value: parsed } });
          }
        }
      }
    } else if (formatted === '') {
      if (onChange) {
        onChange({ target: { value: '' } });
      }
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Format on blur if we have a valid value
    if (value) {
      setDisplayValue(formatForDisplay(value));
    } else if (displayValue && displayValue.length < 10) {
      // Clear incomplete dates
      setDisplayValue('');
      if (onChange) {
        onChange({ target: { value: '' } });
      }
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleKeyDown = (e) => {
    // Allow backspace, delete, tab, escape, enter
    if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
      // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (e.keyCode === 65 && e.ctrlKey === true) ||
      (e.keyCode === 67 && e.ctrlKey === true) ||
      (e.keyCode === 86 && e.ctrlKey === true) ||
      (e.keyCode === 88 && e.ctrlKey === true) ||
      // Allow home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)) {
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  };

  const placeholder = 'dd/mm/yyyy';

  return (
    <div>
      {label && <label htmlFor={id} style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>{label}</label>}
      <input
        ref={inputRef}
        type="text"
        id={id}
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        maxLength={10}
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
      {!isFocused && !displayValue && (
        <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '5px' }}>
          Enter date as: {placeholder} (e.g., 25/12/2024)
        </small>
      )}
    </div>
  );
};

export default DateInput;

