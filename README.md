# ChaiTube — full-stack video platform starter

This bundle includes your original Chai Aur Code backend with deployment fixes, plus a responsive React/Vite frontend.

## What's included
- Dark, responsive video discovery UI with search, video detail/player, sign-in, registration, and upload screens.
- API integration for listing/searching videos, fetching a video, login/register, and publishing videos.
- Backend health check at `GET /api/v1/healthcheck`.
- Public video list/detail endpoints; authenticated video create/update/delete/publish endpoints.
- Safer unique temporary upload filenames, production `start` script, CORS origin configuration.

## Important status
The supplied backend repository contains unfinished TODO controllers for comments, likes, subscriptions, playlists, tweets, and dashboard statistics. Those features are not fully implemented by this bundle. The UI marks comments as not yet available. Video browse/detail/publish endpoints and health check were implemented here, but deployment still requires your own MongoDB Atlas and Cloudinary credentials.

## 1. Configure MongoDB Atlas
1. Create a MongoDB Atlas cluster and database user.
2. Add your deployment provider's outbound IPs to Atlas Network Access (for quick testing, `0.0.0.0/0` works but is less restrictive).
3. Copy the Atlas connection string into `backend/.env` as `MONGODB_URI`. Keep the URI in the format `mongodb+srv://user:password@cluster.mongodb.net` — the app appends `/videotube`.

## 2. Configure Cloudinary
Create a Cloudinary account and copy Cloud Name, API Key, and API Secret into `backend/.env`. Registration requires an avatar image; video publishing requires a video and thumbnail. Do not commit `.env` or publish credentials.

## 3. Run locally
Terminal 1:
```bash
cd backend
cp .env.sample .env
# Edit .env with your credentials
npm install
npm run dev
```
Terminal 2:
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Frontend defaults to `http://localhost:8000` for the API and runs at `http://localhost:5173`.

## 4. Deploy backend to Render
1. Push this folder to a GitHub repository.
2. In Render, create **New + → Web Service**, connect the repository, and set **Root Directory** to `backend`.
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables from `backend/.env.sample`: `MONGODB_URI`, `CORS_ORIGIN`, both token secrets/expiries, and all three Cloudinary values. `PORT` is usually supplied by Render; don't hard-code it there.
6. After deploy, test `https://YOUR-BACKEND.onrender.com/api/v1/healthcheck`.

## 5. Deploy frontend to Vercel
1. Import the same GitHub repository in Vercel.
2. Set **Root Directory** to `frontend`.
3. Framework preset: Vite. Build command `npm run build`; output directory `dist`.
4. Add environment variable `VITE_API_URL=https://YOUR-BACKEND.onrender.com`.
5. Deploy, then copy the Vercel URL and update backend `CORS_ORIGIN` to that URL (and `http://localhost:5173` if needed). Redeploy/restart the backend after changing env vars.

## Notes
- Set `CORS_ORIGIN` to the exact frontend origin(s), comma-separated, no trailing slash. Avoid `*` with credentialed CORS.
- Access tokens are sent as Bearer tokens by this frontend. Use HTTPS for production.
- Demo cards are shown when the API is unreachable or no videos are present, so the design can be previewed before deployment. They are sample content, not database records.
