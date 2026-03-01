// Вспомогательная функция для CSS фильтров
export const getFilterCSS = (filterId: string): string => {
  switch (filterId) {
    case 'grayscale':
      return 'grayscale(100%)'
    case 'sepia':
      return 'sepia(80%)'
    case 'vintage':
      return 'sepia(60%) contrast(1.1) brightness(1.1)'
    case 'colder':
      return 'brightness(1.1) hue-rotate(180deg) saturate(0.8)'
    case 'warmer':
      return 'brightness(1.1) sepia(30%) saturate(1.2)'
    default:
      return 'none'
  }
}
