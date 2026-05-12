# Frontier AI — OpenClaw Course

This repository is the official GitHub home for the **Frontier AI OpenClaw Course**. It ships everything you need to follow along with the curriculum and experiment with the same tooling demonstrated in the lessons.

## Voice app preview

Inside this repo you will find a **Next.js voice application** — the same Voice App previewed in the course. Run it locally to hear OpenClaw-style interactions powered by [Hume AI](https://hume.ai)’s expressive voice stack.

**Voice API:** [https://hume.ai](https://hume.ai)

## Repository layout

| Path | What it is |
|------|------------|
| `next-app/` | Voice sample app (Next.js). Configure environment variables here. |

## Quick start

1. **Clone** this repository and open the app folder:

   ```bash
   cd next-app
   ```

2. **Environment variables** — create a `.env` file **in the `next-app` folder** (alongside `package.json`). Copy the template below and fill in your keys from the Frontier AI / OpenClaw course materials and your [Hume](https://hume.ai) dashboard.

   ```env
   HUME_API_KEY=
   HUME_SECRET_KEY=
   NEXT_PUBLIC_HUME_VOICE_HOSTNAME="api.hume.ai"
   NEXT_PUBLIC_HUME_VOICE_WEATHER_CONFIG_ID=
   NEXT_PUBLIC_GEOCODE_API_KEY=
   HUME_CONFIG_ID=
   ```

3. **Install and run** the development server:

   ```bash
   npm install
   npm run dev
   ```

4. Open **[http://localhost:3004](http://localhost:3004)** in your browser (the dev script pins the app to port `3004`).

---

Built for learners exploring OpenClaw with Frontier AI. Questions about the course belong with course support; issues about this repo are welcome here.
