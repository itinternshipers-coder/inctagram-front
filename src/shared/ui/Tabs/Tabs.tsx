'use client'

import { useState } from 'react'
import s from './Tabs.module.scss'

type Tab = {
  label: string
  content: React.ReactNode
  disabled?: boolean
}

type TabsProps = {
  tabs: Tab[]
  defaultActiveIndex?: number
}

export default function Tabs({ tabs, defaultActiveIndex = 0 }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex)

  return (
    <div className={s.tabs}>
      <div className={s.tabsHeader} role="tablist">
        {tabs.map((tab, index) => (
          <button
            id={`tab-${index}`}
            key={index}
            className={`${s.tabButton} ${index === activeIndex ? s.active : ''} ${tab.disabled ? s.disabled : ''}`}
            onClick={() => !tab.disabled && setActiveIndex(index)}
            disabled={tab.disabled}
            role="tab"
            aria-selected={index === activeIndex}
            aria-controls={`tabpanel-${index}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        className={s.tabContent}
        id={`tabpanel-${activeIndex}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeIndex}`}
      >
        {tabs[activeIndex].content}
      </div>
    </div>
  )
}
