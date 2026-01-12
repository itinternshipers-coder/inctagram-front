export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })

export default async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number }
): Promise<Blob> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Canvas context not available')
  }

  // Устанавливаем размеры canvas равными размерам кадрированной области
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  // Рисуем только кадрированную часть изображения
  ctx.drawImage(
    image, // Исходное изображение
    pixelCrop.x, // X координата области кадрирования
    pixelCrop.y, // Y координата области кадрирования
    pixelCrop.width, // Ширина области кадрирования
    pixelCrop.height, // Высота области кадрирования
    0, // X координата на canvas
    0, // Y координата на canvas
    pixelCrop.width, // Ширина на canvas
    pixelCrop.height // Высота на canvas
  )

  // Возвращаем Blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Failed to create blob from canvas'))
        }
      },
      'image/jpeg',
      0.3
    )
  })
}
