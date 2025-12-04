import { useState, useCallback, useEffect, ChangeEvent } from 'react'

type UseImageUploadProps = {
  maxSizeMB?: number
  allowedTypes?: string[]
}

type UseImageUploadReturn = {
  file: File | null
  preview: string | null
  error: string | null
  onSelectFile: (e: ChangeEvent<HTMLInputElement>) => void
  clear: () => void
}

export const useImageUpload = (options: UseImageUploadProps = {}): UseImageUploadReturn => {
  const { maxSizeMB = 20, allowedTypes = ['image/png', 'image/jpeg'] } = options

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const validateFile = useCallback(
    (file: File) => {
      if (!allowedTypes.includes(file.type)) {
        const formats = allowedTypes.map((type) => type.split('/')[1])
        return `Error! The format of the uploaded photo must be ${formats[0]} and ${formats[1]}.`
      }

      if (file.size / 1024 / 1024 > maxSizeMB) {
        return `Error! Photo size must be less than ${maxSizeMB}MB!`
      }

      return null
    },

    [allowedTypes, maxSizeMB]
  )

  const onSelectFile = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]

      if (!file) {
        return
      }

      const validationError = validateFile(file)

      if (validationError) {
        setError(validationError)
        setFile(null)
        setPreview(null)
        return
      }

      setError(null)
      setFile(file)
      setPreview(URL.createObjectURL(file))
    },
    [validateFile]
  )

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  const clear = () => {
    setFile(null)
    setPreview(null)
    setError(null)
  }

  return {
    file, // загруженный файл
    preview, // предпросмотр
    error,
    onSelectFile, // функция, которую закидываем в input
    clear,
  }
}
