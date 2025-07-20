export {
  ALLOWED_IMAGE_TYPES,
  MAX_FILE_SIZE,
  validateImageFile,
  validateMultipleFiles,
  generateUniqueFileName,
} from './fileValidation';
export type { FileValidationResult } from './fileValidation';

export {
  uploadFileToS3,
  uploadMultipleFilesToS3,
} from './s3Upload';
export type { UploadResult } from './s3Upload'; 