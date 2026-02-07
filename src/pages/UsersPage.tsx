import { useEffect, useState } from "react"
import { createUser, listUsers, type User } from "../lib/api"
import { ErrorMessage } from "../components/ErrorMessage"
import { Loading } from "../components/Loading"

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setError(null)
    setLoading(true)
    try {
      const data = await listUsers()
      setUsers(data.users)
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
      await createUser({ name: name.trim(), email: email.trim() })
      setName("")
      setEmail("")
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="card">
      <h2>Users</h2>

      {error && <ErrorMessage message={error} />}

      <form onSubmit={onSubmit} className="grid">
        <label className="field">
          <span>Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Lucas Ortiz"
          />
        </label>

        <label className="field">
          <span>Email</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="lucas@email.com"
          />
        </label>

        <button className="btn" disabled={submitting || !name.trim() || !email.trim()}>
          {submitting ? "Creating..." : "Create user"}
        </button>
      </form>

      <div className="divider" />

      <h3>All users</h3>

      {loading ? (
        <Loading text="Carregando users..." />
      ) : users.length === 0 ? (
        <p className="muted">No users yet</p>
      ) : (
        <ul className="list">
          {users.map((u) => (
            <li key={u.id} className="row">
              <div>
                <strong>{u.name}</strong>
                <div className="muted">{u.email}</div>
              </div>
              <code className="code">{u.id}</code>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
