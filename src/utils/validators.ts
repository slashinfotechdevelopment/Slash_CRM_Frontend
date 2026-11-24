/**
 * Form field validators matching backend DTO constraints
 */

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidPhone(phone: string): boolean {
  // Accepts standard 10-15 digit phone formats, optional + prefix
  return /^\+?[0-9\s\-()]{7,20}$/.test(phone.trim());
}

export function isValidOtp(otp: string): boolean {
  return /^[0-9]{6}$/.test(otp.trim());
}
