type Page = "users" | "resources" | "bookings"

export function Nav({
  active,
  onChange,
}: {
  active: Page
  onChange: (page: Page) => void
}) {
  return (
    <nav className="nav">
      <button className={active === "users" ? "tab active" : "tab"} onClick={() => onChange("users")}>
        Users
      </button>
      <button className={active === "resources" ? "tab active" : "tab"} onClick={() => onChange("resources")}>
        Resources
      </button>
      <button className={active === "bookings" ? "tab active" : "tab"} onClick={() => onChange("bookings")}>
        Bookings
      </button>
    </nav>
  )
}
