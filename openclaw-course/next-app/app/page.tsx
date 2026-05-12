import { fetchAccessToken } from 'hume';

import { Voice } from '@/components/Voice';

export default async function Home() {
  if (!process.env.HUME_API_KEY || !process.env.HUME_SECRET_KEY) {
    return (
      <div className="min-h-screen px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <header className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
              Hume EVI
            </h1>
            <p className="mt-1 text-sm text-zinc-500">
              React example · Empathic Voice Interface
            </p>
          </header>
          <div className="rounded-2xl border border-amber-500/25 bg-amber-950/35 px-5 py-4 text-sm text-amber-100/95 shadow-card backdrop-blur-md">
            Set <code className="rounded bg-black/30 px-1.5 py-0.5 font-mono text-xs">HUME_API_KEY</code>{' '}
            and{' '}
            <code className="rounded bg-black/30 px-1.5 py-0.5 font-mono text-xs">
              HUME_SECRET_KEY
            </code>{' '}
            in your environment to run this demo.
          </div>
        </div>
      </div>
    );
  }
  const accessToken = await fetchAccessToken({
    apiKey: process.env.HUME_API_KEY,
    secretKey: process.env.HUME_SECRET_KEY,
  });

  const configId = process.env.HUME_CONFIG_ID;

  return (
    <div className="min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
            Hume EVI
          </h1>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-zinc-500">
            Voice conversation with the Empathic Voice Interface · React SDK example
          </p>
        </header>
        <Voice accessToken={accessToken} configId={configId} />
      </div>
    </div>
  );
}
