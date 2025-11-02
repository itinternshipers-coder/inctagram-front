import * as AllIcons from '@/shared/icons/svgComponents'
import { useState } from 'react'

export default {
  title: 'Icons/All Icons',
}

export const IconsGallery = () => {
  const [search, setSearch] = useState('')

  const filteredIcons = Object.entries(AllIcons).filter(([name]) => name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div
      style={{
        maxWidth: '100vw',
        overflowX: 'hidden',
        padding: 16,
      }}
    >
      <input
        type="text"
        placeholder="Search icons..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          marginBottom: 20,
          padding: 8,
          color: 'black',
          background: 'white',
          width: '100%',
          border: '1px solid #ccc',
          borderRadius: 4,
        }}
      />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: 16,
        }}
      >
        {filteredIcons.map(([name, IconComponent]) => (
          <div
            key={name}
            style={{
              textAlign: 'center',
              padding: 16,
              border: '1px solid #ccc',
              borderRadius: 8,
            }}
          >
            <IconComponent size={32} />
            <div style={{ fontSize: 12, marginTop: 8 }}>{name}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
