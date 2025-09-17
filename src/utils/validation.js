/**
 * Validates that an email address is a Berkeley email (ends with @berkeley.edu)
 * @param {string} email - The email address to validate
 * @returns {boolean} - True if valid Berkeley email, false otherwise
 */
export const validateBerkeleyEmail = email => {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  const trimmedEmail = email.trim().toLowerCase();
  
  // More strict email format validation
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmedEmail)) {
    return false;
  }
  
  // Additional validation for consecutive dots
  if (trimmedEmail.includes('..')) {
    return false;
  }
  
  // Check if it ends with @berkeley.edu
  return trimmedEmail.endsWith('@berkeley.edu');
};

/**
 * Gets the error message for email validation
 * @param {string} email - The email address to validate
 * @returns {string|null} - Error message if invalid, null if valid
 */
export const getBerkeleyEmailError = email => {
  if (!email || !email.trim()) {
    return 'Email is required';
  }
  
  if (!validateBerkeleyEmail(email)) {
    return 'Please use a Berkeley email address (someone@berkeley.edu)';
  }
  
  return null;
};
