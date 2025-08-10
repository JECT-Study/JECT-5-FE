import { PresignedUrlItem } from "../model"

export interface S3UploadResult {
  success: boolean
  error?: string
}

export const uploadFileToS3 = async (
  file: File,
  presignedUrl: string,
): Promise<S3UploadResult> => {
  try {
    const response = await fetch(presignedUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    })

    if (!response.ok) {
      return {
        success: false,
        error: `Failed to upload file: ${response.statusText}`,
      }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export const uploadMultipleFilesToS3 = async (
  files: File[],
  presignedUrls: PresignedUrlItem[],
): Promise<S3UploadResult> => {
  try {
    const uploadPromises = files.map((file, index) => {
      const presignedUrl = presignedUrls[index]
      if (!presignedUrl) {
        return Promise.resolve({
          success: false,
          error: `No presigned URL for file ${index}`,
        })
      }

      return uploadFileToS3(file, presignedUrl.url)
    })

    const results = await Promise.all(uploadPromises)
    const failedUploads = results.filter((result) => !result.success)

    if (failedUploads.length > 0) {
      return {
        success: false,
        error: `Failed to upload ${failedUploads.length} files`,
      }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
