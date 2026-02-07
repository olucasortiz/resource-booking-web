
export type BookingStatus = "CONFIRMED" | "CANCELED"
export type ResourceType = "ROOM" | "EQUIPMENT" | "COURT"

const API_URL = import.meta.env.VITE_API_URL as string
const API_KEY = import.meta.env.VITE_API_KEY as string

if (!API_URL) throw new Error("VITE_API_URL is missing")
if (!API_KEY) throw new Error("VITE_API_KEY is missing")

export async function getHealth() {
  return fetchJson<{ ok: boolean }>("/health", { method: "GET" })
}

export type Booking = {
  id: string,
  startAt: string,
  endAt: string,
  status: BookingStatus,
  user: {
    id:string,
    name:string
  }
  resource: {
        id: string,
        name: string,
        type: ResourceType
      }
}

export type Resource = {
  id: string
  name: string
  type: ResourceType
  createdAt: string
  updatedAt: string
}

export type CreateBookingInput = {
  userId: string
  resourceId: string
  startAt: string 
  endAt: string 
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      ...(init?.headers ?? {}),
    },
  })

  const data = (await res.json().catch(() => null)) as unknown

  if (!res.ok) {
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof (data as { message: unknown }).message === "string"
        ? (data as { message: string }).message
        : `HTTP ${res.status}`

    throw new Error(message)
  }

  return data as T
}

export async function createBooking(input: CreateBookingInput) {
  return fetchJson<Booking>("/bookings", {
    method: "POST",
    body: JSON.stringify(input),
  })
}



export async function listBookings() {
  return fetchJson<{ bookings: Booking[] }>("/bookings", { method: "GET" })
}


export async function listResources(){
  return fetchJson<{ resources: Resource[] }>("/resources", { method: "GET" })
}


export async function createResource(input: { name: string; type: ResourceType }) {
  return fetchJson<Resource>("/resources", {
    method: "POST",
    body: JSON.stringify(input),
  })
}


export type User = {
  id: string
  name: string
  email: string
  createdAt?: string
  updatedAt?: string
}

export type CreateUserInput = { name: string; email: string }

export async function createUser(input: CreateUserInput) {
  return fetchJson<User>("/users", {
    method: "POST",
    body: JSON.stringify(input),
  })
}

// ===== BOOKINGS: CANCEL =====
export async function cancelBooking(id: string) {
  return fetchJson<Booking>(`/bookings/${id}/cancel`, { method: "PATCH" })
}

export async function listUsers() {
  return fetchJson<{ users: User[] }>("/users", { method: "GET" })
}