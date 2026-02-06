import { useEffect, useState } from "react"
import { createResource, listResources, type Resource } from "./lib/api"

function parseResourceList(data: unknown): Resource[] {
  if (Array.isArray(data)) return data as Resource[]
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>
    if (Array.isArray(obj.resources)) return obj.resources as Resource[]
  }
  return []
}

export default function App() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState("")
  const [type, setType] = useState<Resource["type"]>("ROOM")

  async function loadResources() {
    setError(null)
    setLoading(true)
    try {
      const data = await listResources()
      console.log("resources response:", data)
      //const list = Array.isArray(data) ? data : data.resources
      setResources(parseResourceList(data))
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadResources()
  }, [])

  async function onCreate(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    try {
      await createResource({ name, type })
      setName("")
      await loadResources()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  return (
    <main style={{ fontFamily: "system-ui", padding: 24, maxWidth: 760 }}>
      <h1>Resource Booking</h1>

      <section style={{ marginTop: 24 }}>
        <h2>Create Resource</h2>

        <form onSubmit={onCreate} style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Resource name"
            style={{ padding: 8, flex: 1 }}
          />

          <select value={type} onChange={(e) => setType(e.target.value as Resource["type"])} style={{ padding: 8 }}>
            <option value="ROOM">ROOM</option>
            <option value="EQUIPMENT">EQUIPMENT</option>
            <option value="COURT">COURT</option>
          </select>

          <button type="submit" disabled={!name.trim()} style={{ padding: "8px 12px" }}>
            Create
          </button>
        </form>
      </section>

      <section style={{ marginTop: 24 }}>
        <h2>Resources</h2>

        {loading && <p>Loading...</p>}

        {error && (
          <pre style={{ background: "#f5f5f5", padding: 12, borderRadius: 8 }}>
            {error}
          </pre>
        )}

        {!loading && !error && (
          <ul>
            {resources.map((r) => (
              <li key={r.id}>
                <strong>{r.name}</strong> — {r.type} <span style={{ opacity: 0.6 }}>({r.id})</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
