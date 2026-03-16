/**
 * Список стран мира (ISO 3166-1) на английском языке.
 * Источник: https://github.com/umpirsky/country-list
 */

export const COUNTRIES = [
  'United States',
  'Russia',
  'Germany',
  'France',
  'United Kingdom',
  'Canada',
  'Italy',
  'Spain',
  'Ukraine',
  'Belarus',
] as const

export type Country = (typeof COUNTRIES)[number]
