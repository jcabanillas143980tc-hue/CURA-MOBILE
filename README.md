# CURA Patient App (React Native / Expo)

Patient-facing mobile frontend for the CURA healthcare coordination platform.
Built to match the approved HTML mockup (`cura-app-10.html`) screen-for-screen.

## Setup (development build, not Expo Go)
```
npm install
npm install -g eas-cli
eas login                              # free Expo account
eas build:configure                    # only needed once, links this project to your Expo account
eas build --profile development --platform android   # builds an installable .apk in the cloud
```
Install the resulting APK on your phone (EAS gives you a download link/QR
after the build finishes, usually 10–20 min). Then, every time you code:
```
npx expo start --dev-client
```
Scan the QR with your phone's camera — it opens in the dev-client build you
installed (not Expo Go), and hot-reloads as you edit code.

Do this once per platform, and again only when you add a native module
that needs new native code (e.g. a new native library) — plain JS/TSX
changes just hot-reload, no rebuild needed.

## Structure
- `src/screens/` — one folder per flow, one file per mockup screen (see comments
  at the top of each file mapping it to its `id="screen-..."` in the mockup).
- `src/navigation/` — Auth stack (not logged in) vs Main tabs + Booking flow
  stack (logged in), switched automatically by `AuthContext`.
- `src/api/` — one file per backend resource. All requests go through
  `client.ts`, which attaches the Laravel Sanctum bearer token automatically.
- `src/constants/colors.ts` — theme values copied 1:1 from the mockup's CSS
  variables so screens look the same.

## Connecting to the doctor-side backend
This app expects the same Laravel backend the doctor/staff web portal uses.
Set `API_BASE_URL` in `src/api/client.ts` (or wire up `.env` + `react-native-dotenv`
later) to your Laravel server's LAN IP + `/api`, e.g. `http://192.168.1.5:8000/api`.

Expected Laravel routes (adjust to match your actual route names):
`/login`, `/register`, `/logout`, `/user`, `/doctors`, `/doctors/{id}/availability`,
`/appointments`, `/appointments/{id}/cancel`, `/appointments/{id}/reschedule`,
`/queue/{appointmentId}`, `/records`, `/prescriptions`, `/notifications`,
`/symptoms/analyze` (this last one is what Laravel forwards to the Python AI service).
