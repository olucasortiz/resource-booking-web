import { useEffect, useMemo, useState } from "react"
import {
  cancelBooking,
  createBooking,
  listBookings,
  listResources,
  type Booking,
  type Resource,
} from "../lib/api"
import { ErrorMessage } from "../components/ErrorMessage"
import { Loading } from "../components/Loading"

function formatDate(iso: string) {
  return new Date(iso).toLocaleString()
}

function toISOFromLocal(value: string) {
  return new Date(value).toISOString()
}

export function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [resources, setResources] = useState<Resource[]>([])

  const [userId, setUserId] = useState("")
  const [resourceId, setResourceId] = useState("")
  const [startAtLocal, setStartAtLocal] = useState("")
  const [endAtLocal, setEndAtLocal] = useState("")

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setError(null)
    setLoading(true)
    try {
      const [b, r] = await Promise.all([listBookings(), listResources()])
      setBookings(b.bookings)
      const resList = Array.isArray(r) ? r : r.resources
      setResources(resList)
      if (!resourceId && resList.length > 0) setResourceId(resList[0].id)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const canSubmit = useMemo(() => {
    return !!userId.trim() && !!resourceId && !!startAtLocal && !!endAtLocal
  }, [userId, resourceId, startAtLocal, endAtLocal])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      if (new Date(endAtLocal).getTime() <= new Date(startAtLocal).getTime()) {
        throw new Error("The end date must be later than the start date.")
      }

      await createBooking({
        userId: userId.trim(),
        resourceId,
        startAt: toISOFromLocal(startAtLocal),
        endAt: toISOFromLocal(endAtLocal),
      })

      setStartAtLocal("")
      setEndAtLocal("")
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setSubmitting(false)
    }
  }

  async function onCancel(id: string) {
    setError(null)
    setSubmitting(true)
    try {
      await cancelBooking(id)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="card">
      <h2>Bookings</h2>
      <p className="muted">
        Create bookings and view conflicts/validations returned from the backend (409).
      </p>

      {error && <ErrorMessage message={error} />}

      <form onSubmit={onSubmit} className="grid">
        <label className="field">
          <span>User ID</span>
          <input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="paste a user cuid" />
        </label>

        <label className="field">
          <span>Resource</span>
          <select value={resourceId} onChange={(e) => setResourceId(e.target.value)} disabled={resources.length === 0}>
            {resources.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.type})
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>Start</span>
          <input type="datetime-local" value={startAtLocal} onChange={(e) => setStartAtLocal(e.target.value)} />
        </label>

        <label className="field">
          <span>End</span>
          <input type="datetime-local" value={endAtLocal} onChange={(e) => setEndAtLocal(e.target.value)} />
        </label>

        <button className="btn" disabled={!canSubmit || submitting}>
          {submitting ? "Submitting..." : "Create booking"}
        </button>
      </form>

      <div className="divider" />

      <h3>All bookings</h3>

      {loading ? (
        <Loading text="Loading bookings..." />
      ) : bookings.length === 0 ? (
        <p className="muted">No booking yet.</p>
      ) : (
        <ul className="list">
          {bookings.map((b) => (
            <li key={b.id} className="row">
              <div>
                <div className="pill">{b.status}</div>
                <div>
                  <strong>{b.resource.name}</strong> — {b.user.name}
                </div>
                <div className="muted">
                  {formatDate(b.startAt)} → {formatDate(b.endAt)}
                </div>
                <div className="muted">
                  <code className="code">{b.id}</code>
                </div>
              </div>

              <div className="actions">
                <button
                  className="btn btn-ghost"
                  onClick={() => onCancel(b.id)}
                  disabled={submitting || b.status === "CANCELED"}
                  title={b.status === "CANCELED" ? "Já cancelado" : "Cancelar booking"}
                >
                  Cancel
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
