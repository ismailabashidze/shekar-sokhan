import { ref, reactive, computed } from 'vue'
import type {
  FileUploadResponse,
  FileUploadProgress,
  ApiError,
} from '~/types/hammasir'

export interface UploadOptions {
  maxFileSize?: number
  allowedTypes?: string[]
  multiple?: boolean
  compress?: boolean
  quality?: number
}

export interface UploadState {
  files: Map<string, FileUploadProgress>
  isUploading: boolean
  error: string | null
}

export const useProfileUpload = (options: UploadOptions = {}) => {
  
  const defaultOptions = {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
    multiple: false,
    compress: true,
    quality: 0.8,
  }

  const config = { ...defaultOptions, ...options }

  // Upload state
  const state = reactive<UploadState>({
    files: new Map(),
    isUploading: false,
    error: null,
  })

  // Computed properties
  const uploadProgress = computed(() => {
    const files = Array.from(state.files.values())
    if (files.length === 0) return 0
    
    const totalProgress = files.reduce((sum, file) => sum + file.progress, 0)
    return Math.round(totalProgress / files.length)
  })

  const hasErrors = computed(() => {
    return Array.from(state.files.values()).some(file => file.status === 'error')
  })

  const completedFiles = computed(() => {
    return Array.from(state.files.values()).filter(file => file.status === 'completed')
  })

  // File validation
  const validateFile = (file: File): string | null => {
    if (file.size > config.maxFileSize) {
      const sizeMB = Math.round(config.maxFileSize / (1024 * 1024))
      return `حجم فایل نباید از ${sizeMB} مگابایت بیشتر باشد`
    }

    if (!config.allowedTypes.includes(file.type)) {
      return 'نوع فایل مجاز نیست'
    }

    return null
  }

  // Image compression
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/') || !config.compress) {
        resolve(file)
        return
      }

      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        // Calculate new dimensions
        const maxWidth = 1200
        const maxHeight = 1200
        let { width, height } = img

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = (height * maxWidth) / width
            width = maxWidth
          } else {
            width = (width * maxHeight) / height
            height = maxHeight
          }
        }

        canvas.width = width
        canvas.height = height

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height)
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              })
              resolve(compressedFile)
            } else {
              reject(new Error('Compression failed'))
            }
          },
          file.type,
          config.quality
        )
      }

      img.onerror = () => reject(new Error('Image loading failed'))
      img.src = URL.createObjectURL(file)
    })
  }

  // Generate upload token
  const generateUploadToken = async (fileName: string, fileType: string, fileSize: number) => {
    try {
      const response = await $fetch<{
        uploadUrl: string
        fileId: string
        expiresAt: string
      }>('/api/v1/files/upload-token', {
        method: 'POST',
        body: {
          fileName,
          fileType,
          fileSize,
        },
      })

      return response
    } catch (error: any) {
      throw new Error(error.data?.message || 'Failed to generate upload token')
    }
  }

  // Upload file to S3
  const uploadToS3 = async (
    file: File,
    uploadUrl: string,
    onProgress: (progress: number) => void
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100
          onProgress(progress)
        }
      })

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve()
        } else {
          reject(new Error(`Upload failed: ${xhr.status}`))
        }
      })

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'))
      })

      xhr.open('PUT', uploadUrl)
      xhr.setRequestHeader('Content-Type', file.type)
      xhr.send(file)
    })
  }

  // Upload single file
  const uploadFile = async (file: File): Promise<FileUploadResponse> => {
    // Validate file
    const validationError = validateFile(file)
    if (validationError) {
      throw new Error(validationError)
    }

    // Generate unique file ID
    const fileId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Add to state
    state.files.set(fileId, {
      fileId,
      progress: 0,
      status: 'uploading',
    })

    state.isUploading = true
    state.error = null

    try {
      // Compress image if needed
      const processedFile = await compressImage(file)

      // Generate upload token
      const { uploadUrl, fileId: serverFileId } = await generateUploadToken(
        processedFile.name,
        processedFile.type,
        processedFile.size
      )

      // Upload to S3
      await uploadToS3(processedFile, uploadUrl, (progress) => {
        const fileState = state.files.get(fileId)
        if (fileState) {
          fileState.progress = progress
        }
      })

      // Mark as completed
      const fileState = state.files.get(fileId)
      if (fileState) {
        fileState.status = 'completed'
        fileState.progress = 100
      }

      return {
        fileId: serverFileId,
        fileName: processedFile.name,
        fileSize: processedFile.size,
        mimeType: processedFile.type,
        url: uploadUrl.split('?')[0], // Remove query parameters
      }
    } catch (error: any) {
      // Mark as error
      const fileState = state.files.get(fileId)
      if (fileState) {
        fileState.status = 'error'
        fileState.error = error.message
      }

      state.error = error.message
      throw error
    } finally {
      state.isUploading = false
    }
  }

  // Upload multiple files
  const uploadFiles = async (files: FileList | File[]): Promise<FileUploadResponse[]> => {
    if (!config.multiple && files.length > 1) {
      throw new Error('Multiple files not allowed')
    }

    const results: FileUploadResponse[] = []
    const errors: string[] = []

    for (const file of files) {
      try {
        const result = await uploadFile(file)
        results.push(result)
      } catch (error: any) {
        errors.push(`${file.name}: ${error.message}`)
      }
    }

    if (errors.length > 0) {
      state.error = errors.join('\n')
    }

    return results
  }

  // Profile picture specific upload
  const uploadProfilePicture = async (file: File): Promise<string> => {
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files are allowed for profile picture')
    }

    const result = await uploadFile(file)
    return result.url
  }

  // Document upload
  const uploadDocument = async (file: File, documentType: string): Promise<FileUploadResponse> => {
    const result = await uploadFile(file)
    
    // Store document metadata (you might want to call an additional API here)
    // await $fetch('/api/v1/documents', {
    //   method: 'POST',
    //   body: {
    //     fileId: result.fileId,
    //     type: documentType,
    //     fileName: result.fileName,
    //   }
    // })

    return result
  }

  // Remove file from upload list
  const removeFile = (fileId: string) => {
    state.files.delete(fileId)
  }

  // Clear all files
  const clearFiles = () => {
    state.files.clear()
    state.error = null
  }

  // Reset state
  const reset = () => {
    clearFiles()
    state.isUploading = false
  }

  // Retry failed upload
  const retryUpload = async (fileId: string): Promise<void> => {
    const fileState = state.files.get(fileId)
    if (!fileState || fileState.status !== 'error') {
      return
    }

    fileState.status = 'uploading'
    fileState.progress = 0
    fileState.error = undefined

    // You would need to store the original file reference to retry
    // This is a simplified version
  }

  // Get file preview URL
  const getPreviewUrl = (file: File): string => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file)
    }
    return ''
  }

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return {
    // State
    state: readonly(state),
    config: readonly(config),

    // Computed
    uploadProgress,
    hasErrors,
    completedFiles,

    // Methods
    validateFile,
    uploadFile,
    uploadFiles,
    uploadProfilePicture,
    uploadDocument,
    removeFile,
    clearFiles,
    reset,
    retryUpload,
    getPreviewUrl,
    formatFileSize,
  }
}