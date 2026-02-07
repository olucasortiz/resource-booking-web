import { useEffect, useState } from "react"
import { createUser, listUsers, type User } from "../lib/api"

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

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
    try {
      await createUser({ name: name.trim(), email: email.trim() })
      setName("")
      setEmail("")
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }

  return (
    <section className="card">
      <h2>Users</h2>

      {error && <pre>{error}</pre>}

      <form onSubmit={onSubmit} className="grid">
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button disabled={!name.trim() || !email.trim()}>Create user</button>
      </form>

      <h3>All users</h3>

      {loading ? (
        <p>Loading...</p>
      ) : users.length === 0 ? (
        <p>No users yet</p>
      ) : (
        <ul>
          {users.map((u) => (
            <li key={u.id}>
              <strong>{u.name}</strong> — {u.email} <span style={{ opacity: 0.6 }}>({u.id})</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
