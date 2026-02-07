import { useEffect, useState } from "react"
import { createResource, listResources, type Resource, type ResourceType } from "../lib/api"
import { ErrorMessage } from "../components/ErrorMessage"
import { Loading } from "../components/Loading"

function normalizeResources(data: { resources: Resource[] } | Resource[]): Resource[] {
  return Array.isArray(data) ? data : data.resources
}

export function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [name, setName] = useState("")
  const [type, setType] = useState<ResourceType>("ROOM")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setError(null)
    setLoading(true)
    try {
      const data = await listResources()
      setResources(normalizeResources(data))
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      await createResource({ name: name.trim(), type })
      setName("")
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="card">
      <h2>Resources</h2>

      {error && <ErrorMessage message={error} />}

      <form onSubmit={onSubmit} className="grid">
        <label className="field">
          <span>Name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="ROOM 04" />
        </label>

        <label className="field">
          <span>Type</span>
          <select value={type} onChange={(e) => setType(e.target.value as ResourceType)}>
            <option value="ROOM">ROOM</option>
            <option value="EQUIPMENT">EQUIPMENT</option>
            <option value="COURT">COURT</option>
          </select>
        </label>

        <button className="btn" disabled={submitting || !name.trim()}>
          {submitting ? "Creating..." : "Create resource"}
        </button>
      </form>

      <div className="divider" />

      <h3>All resources</h3>

      {loading ? (
        <Loading text="Carregando resources..." />
      ) : resources.length === 0 ? (
        <p className="muted">No resources yet   </p>
      ) : (
        <ul className="list">
          {resources.map((r) => (
            <li key={r.id} className="row">
              <div>
                <strong>{r.name}</strong>
                <div className="muted">{r.type}</div>
              </div>
              <code className="code">{r.id}</code>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
