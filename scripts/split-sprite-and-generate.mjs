import fs from 'fs'
import path from 'path'
import { JSDOM } from 'jsdom'
import { transform } from '@svgr/core'

// ==== Настройки проекта ====
const RAW_DIR = path.resolve('src/shared/icons/raw')
const OUT_ROOT = path.resolve('src/shared/icons/svgComponents')

// ==== Утилиты ====
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)
const toComponentName = (id) => id.split(/[-_]/).map(capitalize).join('') + 'Icon'

const writeIndex = (dir) => {
  const exports = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.tsx'))
    .map((f) => `export { default as ${f.replace('.tsx', '')} } from './${f.replace('.tsx', '')}'`)
    .join('\n')
  fs.writeFileSync(path.join(dir, 'index.ts'), exports)
}

// ==== Общий шаблон SVGR ====
const template = (variables, { tpl }) => {
  const { componentName, jsx } = variables

  return tpl`
import * as React from 'react'
import clsx from 'clsx'

export type IconProps = {
  size?: number
  color?: string
  className?: string
} & React.SVGProps<SVGSVGElement>
const ${componentName} = ({
  size = 24,
  color,
  className,
  ...rest }: IconProps) => (
  ${jsx}
)
export default ${componentName}
`
}

// ==== Вспомогательные проверки ====
const needsPreserve = (html) => {
  // если есть растровые вставки, pattern/defs/xlink или иные сложные вещи — не трогаем их svgo/заменой fill
  const re = /<image\b|<use\b|<pattern\b|<defs\b|xlink:href|xmlns:xlink|filter=|mask=|fill="url\(/i
  return re.test(html)
}

const getSvgNamespaceAttrs = (svgElement) => {
  if (!svgElement) return ''
  // собираем атрибуты xmlns* (чтобы передать xmlns:xlink и т.д.)
  const attrs = Array.from(svgElement.attributes || [])
    .filter((a) => a.name.startsWith('xmlns') || a.name === 'xmlns:xlink' || a.name === 'xmlnsXlink')
    .map((a) => `${a.name}="${a.value}"`)
    .join(' ')
  return attrs
}

// ==== Обработка спрайта ====
async function processSprite(spritePath, spriteName) {
  const outDir = path.join(OUT_ROOT, spriteName)
  fs.mkdirSync(outDir, { recursive: true })

  const svgContent = fs.readFileSync(spritePath, 'utf8')
  const dom = new JSDOM(svgContent)
  const doc = dom.window.document

  const rootSvg = doc.querySelector('svg')
  const svgNamespaceAttrs = getSvgNamespaceAttrs(rootSvg)

  // Ищем <symbol> и <g id="..."> (как было)
  const symbols = [...doc.querySelectorAll('symbol, g[id]')]
  if (symbols.length === 0) {
    console.warn(`⚠️  В спрайте ${spriteName} не найдено <symbol> или <g id="...">`)
    return
  }

  console.log(`⚙️  Обработка спрайта: ${spriteName} (${symbols.length} иконок)`)

  for (const symbol of symbols) {
    const id = symbol.getAttribute('id')
    if (!id) continue

    let inner = symbol.innerHTML

    // ==== ИСПРАВЛЕНИЕ: Zаменяем белые fill и stroke на currentColor ====
    // Было: только fill -> currentColor. Теперь также обрабатываем stroke (например stroke="#fff")
    inner = inner.replace(/fill="white"/gi, 'fill="currentColor"')
    inner = inner.replace(/fill="#ffffff"/gi, 'fill="currentColor"')
    inner = inner.replace(/fill="#fff"/gi, 'fill="currentColor"')

    inner = inner.replace(/stroke="white"/gi, 'stroke="currentColor"')
    inner = inner.replace(/stroke="#ffffff"/gi, 'stroke="currentColor"')
    inner = inner.replace(/stroke="#fff"/gi, 'stroke="currentColor"')

    // Получаем viewBox: сначала у самого символа, иначе у корня
    const viewBox = symbol.getAttribute('viewBox') || rootSvg?.getAttribute('viewBox') || '0 0 24 24'

    const componentName = toComponentName(id)

    // Решаем, нужно ли "лезть" svgo и ставить fill="currentColor"
    const preserve = needsPreserve(inner)

    // ==== ИСПРАВЛЕНИЕ: если внутри есть stroke — у корневого SVG ставим fill="none", иначе fill="currentColor" ====
    const hasStroke = /stroke=/.test(inner)
    const fillAttr = hasStroke ? ' fill="none"' : ' fill="currentColor"'

    const xmlnsAttrs = svgNamespaceAttrs ? svgNamespaceAttrs : 'xmlns="http://www.w3.org/2000/svg"'

    const svgWrapped = `<svg viewBox="${viewBox}" ${xmlnsAttrs}${fillAttr}>${inner}</svg>`

    const transformOptions = {
      typescript: true,
      jsxRuntime: 'automatic',
      prettier: true,
      icon: true,
      plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
      template,
      // svgo по умолчанию включён — но для preserve случаев его отключим ниже
      svgoConfig: {
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                // Отключаем удаление атрибутов viewBox
                removeViewBox: false,
                // Отключаем слияние атрибутов, чтобы не ломать пути/толщину
                mergePaths: false,
                // Включим явный запрет на удаление полезных fill/stroke
                removeUselessStrokeAndFill: false,
                removeUnknownsAndDefaults: false,
                // ==== ИСПРАВЛЕНИЕ: Отключаем удаление атрибутов fill ====
                removeAttrs: false,
              },
            },
          },
          // Удаляем атрибуты width и height, чтобы они не конфликтовали с нашими пропсами
          'removeDimensions',
        ],
      },
    }

    // Если нужно сохранять (флаги, defs, image и т.д.) — отключаем svgo (чтобы ничего не вырезалось)
    if (preserve) {
      transformOptions.plugins = ['@svgr/plugin-jsx'] // не прогоняем через svgo
      transformOptions.svgo = false
    }

    const componentCode = await transform(svgWrapped, transformOptions, { componentName })

    // Убираем дублирующиеся атрибуты и добавляем наши пропсы
    let enhancedCode = componentCode
      // Убираем автоматически добавленные width и height из SVG (svgr иногда добавляет)
      .replace(/width="[^"]*"/g, '')
      .replace(/height="[^"]*"/g, '')
      // Убираем лишние пробелы после удаления атрибутов
      .replace(/\s{2,}/g, ' ')
      // Добавляем наши атрибуты в корень svg
      .replace(
        '<svg',
        '<svg width={size} height={size} className={clsx("icon", className)} style={{ color }} {...rest}'
      )
      // Убираем ошибочный {...props} если он есть
      .replace(/\{\s*\.\.\.props\s*\}/g, '')

    // ==== ИСПРАВЛЕНИЕ: Убедимся, что не осталось fill="white" или stroke="#fff" ====
    enhancedCode = enhancedCode.replace(/fill="white"/gi, 'fill="currentColor"')
    enhancedCode = enhancedCode.replace(/fill="#ffffff"/gi, 'fill="currentColor"')
    enhancedCode = enhancedCode.replace(/fill="#fff"/gi, 'fill="currentColor"')

    enhancedCode = enhancedCode.replace(/stroke="white"/gi, 'stroke="currentColor"')
    enhancedCode = enhancedCode.replace(/stroke="#ffffff"/gi, 'stroke="currentColor"')
    enhancedCode = enhancedCode.replace(/stroke="#fff"/gi, 'stroke="currentColor"')

    fs.writeFileSync(path.join(outDir, `${componentName}.tsx`), enhancedCode)
    console.log(`  ✅ Создан компонент: ${componentName}`)
  }

  writeIndex(outDir)
}

// ==== Обработка одиночных SVG ====
async function processSingleSvg(filePath) {
  const fileName = path.basename(filePath, '.svg')
  const componentName = toComponentName(fileName)
  const outDir = path.join(OUT_ROOT, 'single')
  fs.mkdirSync(outDir, { recursive: true })

  let svgContent = fs.readFileSync(filePath, 'utf8')

  // ==== ИСПРАВЛЕНИЕ: Заменяем белые fill и stroke на currentColor ====
  svgContent = svgContent.replace(/fill="white"/gi, 'fill="currentColor"')
  svgContent = svgContent.replace(/fill="#ffffff"/gi, 'fill="currentColor"')
  svgContent = svgContent.replace(/fill="#fff"/gi, 'fill="currentColor"')

  svgContent = svgContent.replace(/stroke="white"/gi, 'stroke="currentColor"')
  svgContent = svgContent.replace(/stroke="#ffffff"/gi, 'stroke="currentColor"')
  svgContent = svgContent.replace(/stroke="#fff"/gi, 'stroke="currentColor"')

  // Если SVG содержит <image>, pattern, defs, xlink или подобное — не заменяем fill на currentColor
  const preserve = needsPreserve(svgContent)

  // Если не preserve — делаем общую замену fill (оставляем stroke-замены уже сделанными выше)
  const svgWrapped = preserve
    ? svgContent // не трогаем
    : svgContent.replace(/fill="[^"]*"/g, 'fill="currentColor"')

  const transformOptions = {
    typescript: true,
    jsxRuntime: 'automatic',
    prettier: true,
    icon: true,
    plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
    template,
    svgoConfig: {
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              removeViewBox: false,
              mergePaths: false,
              // ==== ИСПРАВЛЕНИЕ: Отключаем удаление атрибутов fill ====
              removeAttrs: false,
            },
          },
        },
        'removeDimensions',
      ],
    },
  }

  // Если нужно сохранить (цветной / raster), отключаем svgo
  if (preserve) {
    transformOptions.plugins = ['@svgr/plugin-jsx']
    transformOptions.svgo = false
  }

  const componentCode = await transform(svgWrapped, transformOptions, { componentName })

  // Убираем дублирующиеся атрибуты и добавляем наши пропсы
  let enhancedCode = componentCode
    .replace(/width="[^"]*"/g, '')
    .replace(/height="[^"]*"/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace('<svg', '<svg width={size} height={size} className={clsx("icon", className)} style={{ color }} {...rest}')
    .replace(/\{\s*\.\.\.props\s*\}/g, '')
    // ==== ИСПРАВЛЕНИЕ: Убедимся, что не осталось fill="white" или stroke="#fff" ====
    .replace(/fill="white"/gi, 'fill="currentColor"')
    .replace(/fill="#ffffff"/gi, 'fill="currentColor"')
    .replace(/fill="#fff"/gi, 'fill="currentColor"')
    .replace(/stroke="white"/gi, 'stroke="currentColor"')
    .replace(/stroke="#ffffff"/gi, 'stroke="currentColor"')
    .replace(/stroke="#fff"/gi, 'stroke="currentColor"')

  fs.writeFileSync(path.join(outDir, `${componentName}.tsx`), enhancedCode)
  console.log(`  ✅ Создан компонент: ${componentName}`)
}

// ==== Главный процесс ====
fs.mkdirSync(OUT_ROOT, { recursive: true })

const allSvgFiles = fs.readdirSync(RAW_DIR).filter((f) => f.endsWith('.svg'))
const spriteFiles = allSvgFiles.filter((f) => f.startsWith('sprite-'))
const singleFiles = allSvgFiles.filter((f) => !f.startsWith('sprite-'))

// ---- Спрайты ----
if (spriteFiles.length === 0) {
  console.log('⚠️ Не найдено файлов вида sprite-*.svg в src/shared/icons/raw/')
} else {
  for (const spriteFile of spriteFiles) {
    const spriteName = spriteFile.replace(/^sprite-/, '').replace('.svg', '')
    await processSprite(path.join(RAW_DIR, spriteFile), spriteName)
  }
}

// ---- Одиночные иконки ----
if (singleFiles.length > 0) {
  console.log(`⚙️  Обработка одиночных SVG (${singleFiles.length})`)
  for (const file of singleFiles) {
    await processSingleSvg(path.join(RAW_DIR, file))
  }
  writeIndex(path.join(OUT_ROOT, 'single'))
}

// ==== Общий index.ts ====
const allDirs = fs.readdirSync(OUT_ROOT).filter((d) => fs.statSync(path.join(OUT_ROOT, d)).isDirectory())
const rootExports = allDirs.map((d) => `export * from './${d}'`).join('\n')
fs.writeFileSync(path.join(OUT_ROOT, 'index.ts'), rootExports)

console.log('\n✅ SVG компоненты успешно сгенерированы!')
