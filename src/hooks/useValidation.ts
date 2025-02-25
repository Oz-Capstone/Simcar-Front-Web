import { useState } from 'react';

interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  validate?: (value: string) => boolean | string;
}

interface ValidationErrors {
  [key: string]: string;
}

export const useValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setErrors((prev) => ({ ...prev, email: '이메일은 필수입니다.' }));
      return false;
    }
    if (!emailRegex.test(email)) {
      setErrors((prev) => ({ ...prev, email: '유효한 이메일 형식이 아닙니다.' }));
      return false;
    }
    setErrors((prev) => ({ ...prev, email: '' }));
    return true;
  };

  const validatePassword = (password: string, isSignup: boolean = false): boolean => {
    if (!password) {
      setErrors((prev) => ({ ...prev, password: '비밀번호는 필수입니다.' }));
      return false;
    }
    if (isSignup) {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      if (!passwordRegex.test(password)) {
        setErrors((prev) => ({
          ...prev,
          password: '비밀번호는 8자 이상이며, 영문자와 숫자를 포함해야 합니다.',
        }));
        return false;
      }
    }
    setErrors((prev) => ({ ...prev, password: '' }));
    return true;
  };

  const validateConfirmPassword = (password: string, confirmPassword: string): boolean => {
    if (password !== confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: '비밀번호가 일치하지 않습니다.' }));
      return false;
    }
    setErrors((prev) => ({ ...prev, confirmPassword: '' }));
    return true;
  };

  const validateName = (name: string): boolean => {
    if (!name.trim()) {
      setErrors((prev) => ({ ...prev, name: '이름은 필수입니다.' }));
      return false;
    }
    if (name.length < 2) {
      setErrors((prev) => ({ ...prev, name: '이름은 2자 이상이어야 합니다.' }));
      return false;
    }
    setErrors((prev) => ({ ...prev, name: '' }));
    return true;
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\d{2,3}-\d{3,4}-\d{4}$/;
    if (!phone) {
      setErrors((prev) => ({ ...prev, phone: '전화번호는 필수입니다.' }));
      return false;
    }
    if (!phoneRegex.test(phone)) {
      setErrors((prev) => ({
        ...prev,
        phone: '올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)',
      }));
      return false;
    }
    setErrors((prev) => ({ ...prev, phone: '' }));
    return true;
  };

  const validateForm = (values: { [key: string]: string }, isSignup: boolean = false): boolean => {
    let isValid = true;

    if (values.email) {
      isValid = validateEmail(values.email) && isValid;
    }

    if (values.password) {
      isValid = validatePassword(values.password, isSignup) && isValid;
    }

    if (isSignup) {
      if (values.confirmPassword) {
        isValid = validateConfirmPassword(values.password, values.confirmPassword) && isValid;
      }
      if (values.name) {
        isValid = validateName(values.name) && isValid;
      }
      if (values.phone) {
        isValid = validatePhone(values.phone) && isValid;
      }
    }

    return isValid;
  };

  const clearErrors = () => {
    setErrors({});
  };

  return {
    errors,
    validateEmail,
    validatePassword,
    validateConfirmPassword,
    validateName,
    validatePhone,
    validateForm,
    clearErrors,
  };
};

export type ValidationHook = ReturnType<typeof useValidation>;
