// Format date to dd/mm/yyyy
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
};

// Format date and time to dd/mm/yyyy HH:mm
export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

// Check if date is in the past
export const isPastDate = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return date < today;
};

// Get minimum date for date picker (tomorrow)
export const getMinDate = () => {
  const today = new Date();
  today.setDate(today.getDate() + 1);
  return today.toISOString().split('T')[0];
};

// Validate date is not in the past
export const validateDate = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return date >= today;
};

// Format date and time to ISO string without timezone conversion (local time)
// Returns format: YYYY-MM-DDTHH:mm:ss (without timezone)
export const formatLocalDateTimeToISO = (dateString, timeString) => {
  if (!dateString || !timeString) return null;
  
  // dateString is in YYYY-MM-DD format
  // timeString can be in HH:mm or HH:mm:ss format
  // Normalize to HH:mm:ss format
  let normalizedTime = timeString.trim();
  
  // Check if time already has seconds (HH:mm:ss format)
  if (normalizedTime.match(/^\d{2}:\d{2}:\d{2}$/)) {
    // Already in HH:mm:ss format, use as-is
    return `${dateString}T${normalizedTime}`;
  }
  
  // Check if time is in HH:mm format
  if (normalizedTime.match(/^\d{2}:\d{2}$/)) {
    // Add seconds
    normalizedTime = `${normalizedTime}:00`;
    return `${dateString}T${normalizedTime}`;
  }
  
  // Invalid format
  return null;
};

