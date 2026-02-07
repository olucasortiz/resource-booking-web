Simple frontend UI built to consume the **Resource Booking API**.
The focus of this project is the backend — this web app exists to provide a clean
demo interface for portfolio presentation.

---

## ✅ Live
- **Backend API:** https://resource-booking-api-r1cp.onrender.com
- **Swagger Docs:** https://resource-booking-api-r1cp.onrender.com/docs
- **Frontend (deploy):** <PUT_YOUR_FRONTEND_URL_HERE>

---

## ✨ Features
- Check API health (`/health`)
- Create and list:
  - Users
  - Resources
  - Bookings
- Cancel bookings
- Friendly error display (conflict, validation, etc)

---

## 🛠️ Tech Stack
- Vite
- React
- TypeScript

---

## 🔐 API Key
This frontend calls protected endpoints using:

**Header**
x-api-key: <VITE_API_KEY>


---

## 🚀 Running Locally

### Prerequisites
- Node.js >= 18

### Setup
```bash
npm install
npm run dev
The app will run at:

http://localhost:5173

⚙️ Environment Variables
Create a .env file in the project root:

### Environment Variables

```env
VITE_API_URL=https://your-backend-url
VITE_API_KEY=your_api_key_here
Restart the dev server after changing .env.

🔧 Build
npm run build
npm run preview
☁️ Deploy (recommended)
Deploy on Netlify / Vercel.

Netlify
Build command: npm run build

Publish directory: dist

Add environment variables:

VITE_API_URL

VITE_API_KEY

Vercel
Build command: npm run build

Output: dist

Add environment variables:

VITE_API_URL

VITE_API_KEY

📌 Notes
If the API Key is missing or incorrect, endpoints will return 401 Unauthorized.

If you run the frontend locally and the backend is deployed, CORS must be enabled
on the API for http://localhost:5173.