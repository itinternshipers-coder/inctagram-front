type SettingsPageProps = {
  params: { part: string }
}

export default function SettingsPage({ params }: SettingsPageProps) {
  const { part } = params

  return (
    <div>
      <h1>Настройки - {part}</h1>
      {/* Контент вкладки */}
    </div>
  )
}
