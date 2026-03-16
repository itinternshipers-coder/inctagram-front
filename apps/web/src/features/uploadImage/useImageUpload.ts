import { useState, useCallback, useEffect, ChangeEvent, useRef } from 'react'

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
  accept: string
}

export const useImageUpload = (options: UseImageUploadProps = {}): UseImageUploadReturn => {
  const { maxSizeMB = 20, allowedTypes = ['image/png', 'image/jpeg'] } = options

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // ref на текущий objectURL, чтобы revoke при замене/анмаунте
  const currentObjectUrlRef = useRef<string | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const accept = allowedTypes.join(',')

  const formatAllowedTypes = (types: string[]) => {
    const exts = types.map((t) => t.split('/')[1])
    if (exts.length === 1) return exts[0]
    if (exts.length === 2) return `${exts[0]} and ${exts[1]}`
    return exts.slice(0, -1).join(', ') + ' and ' + exts[exts.length - 1]
  }

  const validateFile = useCallback(
    (file: File) => {
      if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
        return `Error! The format of the uploaded photo must be ${formatAllowedTypes(allowedTypes)}.`
      }

      if (file.size / 1024 / 1024 > maxSizeMB) {
        return `Error! Photo size must be less than ${maxSizeMB}MB!`
      }

      return null
    },
    [allowedTypes, maxSizeMB]
  )

  const revokeCurrentObjectUrl = useCallback(() => {
    if (currentObjectUrlRef.current) {
      try {
        URL.revokeObjectURL(currentObjectUrlRef.current)
      } catch {
        // ignore
      }
      currentObjectUrlRef.current = null
    }
  }, [])

  const onSelectFile = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0] ?? null

      // revoke предыдущего preview (если был)
      revokeCurrentObjectUrl()
      setPreview(null)

      if (!selected) {
        setFile(null)
        setError(null)
        return
      }

      const validationError = validateFile(selected)
      if (validationError) {
        setError(validationError)
        setFile(null)
        return
      }

      setError(null)
      setFile(selected)
      const objectUrl = URL.createObjectURL(selected)
      currentObjectUrlRef.current = objectUrl
      setPreview(objectUrl)
    },
    [validateFile, revokeCurrentObjectUrl]
  )

  useEffect(() => {
    return () => {
      revokeCurrentObjectUrl()
    }
  }, [revokeCurrentObjectUrl])

  const clear = useCallback(() => {
    revokeCurrentObjectUrl()
    setFile(null)
    setPreview(null)
    setError(null)
    if (inputRef.current) {
      try {
        inputRef.current.value = ''
      } catch {
        // ignore
      }
    }
  }, [revokeCurrentObjectUrl])

  return {
    file, // загруженный файл
    preview, // предпросмотр
    error,
    onSelectFile, // функция, которую закидываем в input
    clear,
    accept, // указываем в атрибуте инпута accept для отображения файлов с нужным форматом
  }
}
