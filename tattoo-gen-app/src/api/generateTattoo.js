export async function generateTattooImage(prompt) {
  const res = await fetch('http://localhost:3001/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  })
  const result = await res.json()
  return result.image
}
