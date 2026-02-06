export const API_URL = "http://127.0.0.1:3333"

export async function getHealth() {
  const res = await fetch(`${API_URL}/health`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json() as Promise<{ ok: boolean }>
}

export type Resource = {
  id: string
  name: string
  type: "ROOM" | "EQUIPMENT" | "COURT"
  createdAt: string
  updatedAt: string
}

export async function listResources(): Promise<any> {
  const res = await fetch(`${API_URL}/resources`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}


export async function createResource(input: { name: string; type: Resource["type"] }) {
  const res = await fetch(`${API_URL}/resources`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input)
  })

  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json() as Promise<Resource>
}
