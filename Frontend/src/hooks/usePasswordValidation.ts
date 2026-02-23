import { useState, useCallback } from 'react';
import { PasswordValidation } from '@/types/auth';

export function usePasswordValidation() {
  const [validation, setValidation] = useState<PasswordValidation>({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const validatePassword = useCallback((password: string): PasswordValidation => {
    const newValidation: PasswordValidation = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    };
    
    setValidation(newValidation);
    return newValidation;
  }, []);

  const isPasswordValid = useCallback((v: PasswordValidation = validation): boolean => {
    return v.minLength && v.hasUppercase && v.hasLowercase && v.hasNumber && v.hasSpecialChar;
  }, [validation]);

  const getValidationMessages = useCallback((): string[] => {
    const messages: string[] = [];
    
    if (!validation.minLength) {
      messages.push('Your password should be at least 8 characters long');
    }
    if (!validation.hasUppercase) {
      messages.push('Add at least one capital letter (A-Z)');
    }
    if (!validation.hasLowercase) {
      messages.push('Add at least one lowercase letter (a-z)');
    }
    if (!validation.hasNumber) {
      messages.push('Add a single number from 0-9');
    }
    if (!validation.hasSpecialChar) {
      messages.push('Add a special character eg ! @ # $ % ^ & * ( ) +');
    }
    
    return messages;
  }, [validation]);

  return {
    validation,
    validatePassword,
    isPasswordValid,
    getValidationMessages,
  };
}
