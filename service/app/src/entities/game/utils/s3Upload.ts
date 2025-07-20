import { PresignedUrlItem } from "../model/game";

export interface UploadResult {
  success: boolean;
  error?: string;
  uploadedUrls?: string[];
}

export const uploadFileToS3 = async (
  file: File,
  presignedUrl: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

export const uploadMultipleFilesToS3 = async (
  files: File[],
  presignedUrls: PresignedUrlItem[]
): Promise<UploadResult> => {
  if (files.length !== presignedUrls.length) {
    return {
      success: false,
      error: 'Files and presigned URLs count mismatch',
    };
  }

  const uploadPromises = files.map((file, index) =>
    uploadFileToS3(file, presignedUrls[index].url)
  );

  try {
    const results = await Promise.all(uploadPromises);
    const failedUploads = results.filter(result => !result.success);

    if (failedUploads.length > 0) {
      return {
        success: false,
        error: `Failed to upload ${failedUploads.length} files`,
      };
    }

    return {
      success: true,
      uploadedUrls: presignedUrls.map(item => item.key),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}; 