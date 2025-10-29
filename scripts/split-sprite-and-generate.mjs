/**
 * Разрезает sprite.svg на отдельные SVG-файлы, а отдельные svg берёт как есть
 * и превращает их в React-компоненты со стрелочным синтаксисом.
 */

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
  ...rest
}: IconProps) => (
  ${jsx}
)

export default ${componentName}
`
}

// ==== Обработка спрайта ====
async function processSprite(spritePath, spriteName) {
  const outDir = path.join(OUT_ROOT, spriteName)
  fs.mkdirSync(outDir, { recursive: true })

  const svgContent = fs.readFileSync(spritePath, 'utf8')
  const dom = new JSDOM(svgContent)
  const doc = dom.window.document

  const symbols = [...doc.querySelectorAll('symbol, g[id]')]
  if (symbols.length === 0) {
    console.warn(`⚠️  В спрайте ${spriteName} не найдено <symbol> или <g id="...">`)
    return
  }

  console.log(`⚙️  Обработка спрайта: ${spriteName} (${symbols.length} иконок)`)

  for (const symbol of symbols) {
    const id = symbol.getAttribute('id')
    if (!id) continue

    const inner = symbol.innerHTML
    const viewBox = symbol.getAttribute('viewBox') || doc.querySelector('svg')?.getAttribute('viewBox') || '0 0 24 24'

    const svgWrapped = `<svg viewBox="${viewBox}" fill="currentColor" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`
    const componentName = toComponentName(id)

    const componentCode = await transform(
      svgWrapped,
      {
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
                  // Отключаем удаление атрибутов viewBox
                  removeViewBox: false,
                  // Отключаем слияние атрибутов
                  mergePaths: false,
                },
              },
            },
            // Удаляем атрибуты width и height, чтобы они не конфликтовали с нашими пропсами
            'removeDimensions',
          ],
        },
      },
      { componentName }
    )

    // Убираем дублирующиеся атрибуты и добавляем наши пропсы
    let enhancedCode = componentCode
      // Убираем автоматически добавленные width и height из SVG
      .replace(/width="[^"]*"/g, '')
      .replace(/height="[^"]*"/g, '')
      // Убираем лишние пробелы после удаления атрибутов
      .replace(/\s{2,}/g, ' ')
      // Добавляем наши атрибуты
      .replace(
        '<svg',
        '<svg width={size} height={size} className={clsx("icon", className)} style={{ color }} {...rest}'
      )
      // Убираем ошибочный {...props} если он есть
      .replace(/\{\s*\.\.\.props\s*\}/g, '')

    fs.writeFileSync(path.join(outDir, `${componentName}.tsx`), enhancedCode)
  }

  writeIndex(outDir)
}

// ==== Обработка одиночных SVG ====
async function processSingleSvg(filePath) {
  const fileName = path.basename(filePath, '.svg')
  const componentName = toComponentName(fileName)
  const outDir = path.join(OUT_ROOT, 'single')
  fs.mkdirSync(outDir, { recursive: true })

  const svgContent = fs.readFileSync(filePath, 'utf8')
  const svgWrapped = svgContent.replace(/fill="[^"]*"/g, 'fill="currentColor"')

  const componentCode = await transform(
    svgWrapped,
    {
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
              },
            },
          },
          'removeDimensions',
        ],
      },
    },
    { componentName }
  )

  // Убираем дублирующиеся атрибуты и добавляем наши пропсы
  let enhancedCode = componentCode
    .replace(/width="[^"]*"/g, '')
    .replace(/height="[^"]*"/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace('<svg', '<svg width={size} height={size} className={clsx("icon", className)} style={{ color }} {...rest}')
    .replace(/\{\s*\.\.\.props\s*\}/g, '')

  fs.writeFileSync(path.join(outDir, `${componentName}.tsx`), enhancedCode)
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
