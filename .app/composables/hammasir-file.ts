/**
 * Hammasir File Management Composable
 * Based on OpenAPI File Service specification
 */

export type FileType = 
  | 'PROFILE_IMAGE'
  | 'DOCUMENT'
  | 'SESSION_RECORDING'
  | 'COURSE_MATERIAL'
  | 'ASSESSMENT_FILE'
  | 'MESSAGE_ATTACHMENT'
  | 'NOTIFICATION_ATTACHMENT'

export interface FileMetadata {
  id: string
  fileId: string
  userId: string
  fileName: string
  fileType: FileType
  fileSize: number
  mimeType: string
  uploadedAt: string
  tags?: string[]
  description?: string
  isPublic: boolean
}

export interface UploadTokenRequest {
  fileType: FileType
  fileName: string
  fileSize: number
  description?: string
  tags?: string[]
}

export interface UploadTokenResponse {
  uploadUrl: string
  fileId: string
  expiresAt: string
}

export interface DownloadTokenRequest {
  fileId: string
}

export interface DownloadTokenResponse {
  downloadUrl: string
  expiresAt: string
}

export interface FileAccessValidation {
  hasAccess: boolean
  permissions: string[]
}

export interface FileListParams {
  fileType?: FileType
  userId?: string
  page?: number
  size?: number
}

export interface FileUploadProgress {
  fileId: string
  progress: number
  status: 'uploading' | 'completed' | 'error'
  error?: string
}

/**
 * File management composable for Hammasir platform
 */
export function useHammasirFile() {
  const { $fetch } = useNuxtApp()

  /**
   * Generate upload token for direct file upload to S3
   * @param request Upload token request parameters
   * @returns Upload token response with pre-signed URL
   */
  const generateUploadToken = async (request: UploadTokenRequest): Promise<UploadTokenResponse> => {
    return await $fetch('/api/v1/files/upload-token', {
      method: 'POST',
      body: request
    })
  }

  /**
   * Generate download token for file download from S3
   * @param request Download token request parameters
   * @returns Download token response with pre-signed URL
   */
  const generateDownloadToken = async (request: DownloadTokenRequest): Promise<DownloadTokenResponse> => {
    return await $fetch('/api/v1/files/download-token', {
      method: 'POST',
      body: request
    })
  }

  /**
   * Get file metadata by file ID
   * @param fileId File identifier
   * @returns File metadata
   */
  const getFileMetadata = async (fileId: string): Promise<FileMetadata> => {
    return await $fetch(`/api/v1/files/${fileId}`)
  }

  /**
   * Delete a file and its metadata (Admin only)
   * @param fileId File identifier
   */
  const deleteFile = async (fileId: string): Promise<void> => {
    await $fetch(`/api/v1/files/${fileId}`, {
      method: 'DELETE'
    })
  }

  /**
   * Validate user access to a specific file
   * @param fileId File identifier
   * @returns Access validation result
   */
  const validateFileAccess = async (fileId: string): Promise<FileAccessValidation> => {
    return await $fetch(`/api/v1/files/${fileId}/access`)
  }

  /**
   * List files with filtering (Admin only)
   * @param params Filter parameters
   * @returns Array of file metadata
   */
  const listFiles = async (params?: FileListParams): Promise<FileMetadata[]> => {
    const query = new URLSearchParams()
    
    if (params?.fileType) query.set('fileType', params.fileType)
    if (params?.userId) query.set('userId', params.userId)
    if (params?.page !== undefined) query.set('page', params.page.toString())
    if (params?.size !== undefined) query.set('size', params.size.toString())

    const url = `/api/v1/admin/files${query.toString() ? '?' + query.toString() : ''}`
    return await $fetch(url)
  }

  /**
   * Upload file with progress tracking
   * @param file File to upload
   * @param fileType Type of file being uploaded
   * @param onProgress Progress callback function
   * @returns File metadata after successful upload
   */
  const uploadFile = async (
    file: File,
    fileType: FileType,
    onProgress?: (progress: FileUploadProgress) => void
  ): Promise<FileMetadata> => {
    try {
      // Step 1: Generate upload token
      const uploadToken = await generateUploadToken({
        fileType,
        fileName: file.name,
        fileSize: file.size,
      })

      const fileId = uploadToken.fileId

      // Step 2: Upload file to S3 with progress tracking
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        // Track upload progress
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable && onProgress) {
            const progress = Math.round((event.loaded / event.total) * 100)
            onProgress({
              fileId,
              progress,
              status: 'uploading'
            })
          }
        })

        xhr.addEventListener('load', async () => {
          try {
            if (xhr.status >= 200 && xhr.status < 300) {
              onProgress?.({
                fileId,
                progress: 100,
                status: 'completed'
              })

              // Step 3: Get file metadata after successful upload
              const metadata = await getFileMetadata(fileId)
              resolve(metadata)
            } else {
              throw new Error(`Upload failed with status: ${xhr.status}`)
            }
          } catch (error) {
            onProgress?.({
              fileId,
              progress: 0,
              status: 'error',
              error: error instanceof Error ? error.message : 'Upload failed'
            })
            reject(error)
          }
        })

        xhr.addEventListener('error', () => {
          const error = 'Network error during upload'
          onProgress?.({
            fileId,
            progress: 0,
            status: 'error',
            error
          })
          reject(new Error(error))
        })

        // Start upload
        xhr.open('PUT', uploadToken.uploadUrl)
        xhr.setRequestHeader('Content-Type', file.type)
        xhr.send(file)
      })
    } catch (error) {
      throw error
    }
  }

  /**
   * Download file using download token
   * @param fileId File identifier
   * @param fileName Optional filename for download
   * @returns Promise that resolves when download starts
   */
  const downloadFile = async (fileId: string, fileName?: string): Promise<void> => {
    try {
      const downloadToken = await generateDownloadToken({ fileId })
      
      // Create temporary link and trigger download
      const link = document.createElement('a')
      link.href = downloadToken.downloadUrl
      if (fileName) {
        link.download = fileName
      }
      link.target = '_blank'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      throw error
    }
  }

  /**
   * Get file type label in Persian
   * @param fileType File type enum
   * @returns Persian label for file type
   */
  const getFileTypeLabel = (fileType: FileType): string => {
    const labels: Record<FileType, string> = {
      'PROFILE_IMAGE': 'تصویر پروفایل',
      'DOCUMENT': 'سند',
      'SESSION_RECORDING': 'ضبط جلسه',
      'COURSE_MATERIAL': 'مواد آموزشی',
      'ASSESSMENT_FILE': 'فایل ارزیابی',
      'MESSAGE_ATTACHMENT': 'پیوست پیام',
      'NOTIFICATION_ATTACHMENT': 'پیوست اعلان'
    }
    return labels[fileType] || fileType
  }

  /**
   * Format file size for display
   * @param bytes File size in bytes
   * @returns Formatted file size string
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 بایت'
    
    const k = 1024
    const sizes = ['بایت', 'کیلوبایت', 'مگابایت', 'گیگابایت']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  /**
   * Validate file type and size before upload
   * @param file File to validate
   * @param allowedTypes Allowed MIME types
   * @param maxSize Maximum file size in bytes
   * @returns Validation result
   */
  const validateFile = (
    file: File,
    allowedTypes?: string[],
    maxSize?: number
  ): { isValid: boolean; error?: string } => {
    // Check file size
    if (maxSize && file.size > maxSize) {
      return {
        isValid: false,
        error: `حجم فایل نباید بیش از ${formatFileSize(maxSize)} باشد`
      }
    }

    // Check file type
    if (allowedTypes && !allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'نوع فایل مجاز نیست'
      }
    }

    return { isValid: true }
  }

  /**
   * Get file icon based on MIME type
   * @param mimeType MIME type of the file
   * @returns Icon name for the file type
   */
  const getFileIcon = (mimeType: string): string => {
    if (mimeType.startsWith('image/')) return 'ph:image'
    if (mimeType.startsWith('video/')) return 'ph:video'
    if (mimeType.startsWith('audio/')) return 'ph:music-note'
    if (mimeType.includes('pdf')) return 'ph:file-pdf'
    if (mimeType.includes('word')) return 'ph:file-doc'
    if (mimeType.includes('sheet') || mimeType.includes('excel')) return 'ph:file-xls'
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'ph:file-ppt'
    if (mimeType.includes('zip') || mimeType.includes('rar')) return 'ph:file-zip'
    if (mimeType.startsWith('text/')) return 'ph:file-text'
    
    return 'ph:file'
  }

  return {
    // Core API methods
    generateUploadToken,
    generateDownloadToken,
    getFileMetadata,
    deleteFile,
    validateFileAccess,
    listFiles,
    
    // Enhanced functionality
    uploadFile,
    downloadFile,
    
    // Utility functions
    getFileTypeLabel,
    formatFileSize,
    validateFile,
    getFileIcon
  }
}