export async function getMainPageData() {
  try {
    const res = await fetch('https://gateway.traineegramm.ru/api/v1/posts/public/stats')

    if (!res.ok) {
      const txt = await res.text()
      console.error('ERROR RESPONSE TEXT:', txt)
      throw new Error(`Failed to load main page data: ${res.status} ${res.statusText}`)
    }

    return res.json()
  } catch (e) {
    console.error('FETCH ERROR:', e)
    throw e
  }
}
