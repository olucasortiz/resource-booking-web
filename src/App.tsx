import { useEffect, useState } from "react"
import { UsersPage } from "./pages/UsersPage"
import { ResourcesPage } from "./pages/ResourcesPage"
import { BookingsPage } from "./pages/BookingsPage"
import { getHealth } from "./lib/api"

type Page = "users" | "resources" | "bookings"

export default function App() {
  const [page, setPage] = useState<Page>("resources")
  const [apiStatus, setApiStatus] = useState<"loading" | "online" | "offline">("loading")

  useEffect(() => {
    getHealth()
      .then(() => setApiStatus("online"))
      .catch(() => setApiStatus("offline"))
  }, [])

  return (
    <div style={{ fontFamily: "system-ui", padding: 24, maxWidth: 980, margin: "0 auto" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16 }}>
        <div>
          <h1 style={{ margin: 0 }}>Resource Booking</h1>
          <div style={{ opacity: 0.7 }}>
            API:{" "}
            {apiStatus === "loading"
              ? "Loading..."
              : apiStatus === "online"
              ? "Online "
              : "Offline "}
          </div>
        </div>

          <nav className="nav">
            <button className={page === "users" ? "tab active" : "tab"} onClick={() => setPage("users")}>
              Users
            </button>
            <button className={page === "resources" ? "tab active" : "tab"} onClick={() => setPage("resources")}>
              Resources
            </button>
            <button className={page === "bookings" ? "tab active" : "tab"} onClick={() => setPage("bookings")}>
              Bookings
            </button>
          </nav>
      </header>

      <main style={{ marginTop: 20 }}>
        {page === "users" && <UsersPage />}
        {page === "resources" && <ResourcesPage />}
        {page === "bookings" && <BookingsPage />}
      </main>
    </div>
  )
}
