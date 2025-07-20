import { v4 as uuidv4 } from 'uuid';

export const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg'] as const;
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateImageFile = (file: File): FileValidationResult => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as any)) {
    return {
      isValid: false,
      error: `지원하지 않는 파일 형식입니다. 지원 형식: ${ALLOWED_IMAGE_TYPES.join(', ')}`
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `파일 크기가 너무 큽니다. 최대 크기: ${MAX_FILE_SIZE / (1024 * 1024)}MB`
    };
  }

  return { isValid: true };
};

export const generateUniqueFileName = (originalName: string): string => {
  const extension = originalName.split('.').pop();
  const uniqueId = uuidv4();
  return `${uniqueId}.${extension}`;
};

export const validateMultipleFiles = (files: File[]): FileValidationResult => {
  for (const file of files) {
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      return validation;
    }
  }
  return { isValid: true };
}; 