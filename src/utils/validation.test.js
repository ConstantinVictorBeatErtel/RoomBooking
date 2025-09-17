import { validateBerkeleyEmail, getBerkeleyEmailError } from './validation';

describe('validateBerkeleyEmail', () => {
  test('returns true for valid Berkeley email addresses', () => {
    expect(validateBerkeleyEmail('student@berkeley.edu')).toBe(true);
    expect(validateBerkeleyEmail('john.doe@berkeley.edu')).toBe(true);
    expect(validateBerkeleyEmail('test123@berkeley.edu')).toBe(true);
    expect(validateBerkeleyEmail('STUDENT@BERKELEY.EDU')).toBe(true); // Case insensitive
    expect(validateBerkeleyEmail('  student@berkeley.edu  ')).toBe(true); // Whitespace trimming
  });

  test('returns false for non-Berkeley email addresses', () => {
    expect(validateBerkeleyEmail('student@gmail.com')).toBe(false);
    expect(validateBerkeleyEmail('student@stanford.edu')).toBe(false);
    expect(validateBerkeleyEmail('student@berkeley.com')).toBe(false);
    expect(validateBerkeleyEmail('student@berkeley.org')).toBe(false);
    expect(validateBerkeleyEmail('student@berkeley.net')).toBe(false);
    expect(validateBerkeleyEmail('student@cal.berkeley.edu')).toBe(false); // Subdomain
    expect(validateBerkeleyEmail('hello@pkgx.dev')).toBe(false); // Subdomain
  });

  test('returns false for invalid email formats', () => {
    expect(validateBerkeleyEmail('invalid-email')).toBe(false);
    expect(validateBerkeleyEmail('student@')).toBe(false);
    expect(validateBerkeleyEmail('@berkeley.edu')).toBe(false);
    expect(validateBerkeleyEmail('student@berkeley')).toBe(false);
    expect(validateBerkeleyEmail('student..double@berkeley.edu')).toBe(false);
    expect(validateBerkeleyEmail('student @berkeley.edu')).toBe(false); // Space in local part
  });

  test('returns false for null, undefined, or empty values', () => {
    expect(validateBerkeleyEmail(null)).toBe(false);
    expect(validateBerkeleyEmail(undefined)).toBe(false);
    expect(validateBerkeleyEmail('')).toBe(false);
    expect(validateBerkeleyEmail('   ')).toBe(false); // Only whitespace
  });

  test('returns false for non-string values', () => {
    expect(validateBerkeleyEmail(123)).toBe(false);
    expect(validateBerkeleyEmail({})).toBe(false);
    expect(validateBerkeleyEmail([])).toBe(false);
    expect(validateBerkeleyEmail(true)).toBe(false);
  });
});

describe('getBerkeleyEmailError', () => {
  test('returns null for valid Berkeley email addresses', () => {
    expect(getBerkeleyEmailError('student@berkeley.edu')).toBe(null);
    expect(getBerkeleyEmailError('john.doe@berkeley.edu')).toBe(null);
    expect(getBerkeleyEmailError('TEST@BERKELEY.EDU')).toBe(null);
  });

  test('returns error message for empty or missing emails', () => {
    expect(getBerkeleyEmailError('')).toBe('Email is required');
    expect(getBerkeleyEmailError(null)).toBe('Email is required');
    expect(getBerkeleyEmailError(undefined)).toBe('Email is required');
    expect(getBerkeleyEmailError('   ')).toBe('Email is required');
  });

  test('returns error message for non-Berkeley emails', () => {
    const expectedMessage = 'Please use a Berkeley email address (someone@berkeley.edu)';
    expect(getBerkeleyEmailError('student@gmail.com')).toBe(expectedMessage);
    expect(getBerkeleyEmailError('student@stanford.edu')).toBe(expectedMessage);
    expect(getBerkeleyEmailError('invalid-email')).toBe(expectedMessage);
    expect(getBerkeleyEmailError('student@berkeley.com')).toBe(expectedMessage);
  });
});
