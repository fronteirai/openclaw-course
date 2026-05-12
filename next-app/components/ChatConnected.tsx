'use client';

import { useVoice } from '@humeai/voice-react';
import { SelectItem } from '@radix-ui/react-select';
import { ChevronRight, MicIcon, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useCallback, useState, type ReactNode } from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from '@/components/Select';
import { Waveform } from '@/components/Waveform';

function formatEmotionLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

function topEmotionEntries(
  scores: Record<string, number> | undefined,
  n = 4,
): [string, number][] {
  if (!scores) {
    return [];
  }
  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n);
}

function StatPill({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-zinc-950/35 px-3 py-2.5 shadow-card backdrop-blur-sm">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
        {label}
      </div>
      <div className="mt-1 truncate font-medium tabular-nums text-zinc-100">
        {children}
      </div>
    </div>
  );
}

function IdBlock({ label, value }: { label: string; value?: string }) {
  if (!value) {
    return null;
  }
  return (
    <div className="rounded-xl border border-white/[0.08] bg-zinc-950/35 px-3 py-2.5 backdrop-blur-sm">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
        {label}
      </div>
      <div
        className="mt-1 truncate font-mono text-[11px] text-zinc-400"
        title={value}
      >
        {value}
      </div>
    </div>
  );
}

function DebugPayload({ title, data }: { title: string; data: unknown }) {
  const str = JSON.stringify(data, null, 2);
  return (
    <details className="group overflow-hidden rounded-xl border border-white/[0.08] bg-zinc-950/50 backdrop-blur-sm">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2.5 text-xs font-medium text-zinc-400 transition hover:bg-white/[0.04] [&::-webkit-details-marker]:hidden">
        <ChevronRight className="size-3.5 shrink-0 transition-transform group-open:rotate-90" />
        {title}
      </summary>
      <pre className="max-h-52 overflow-auto border-t border-white/[0.06] p-3 font-mono text-[11px] leading-relaxed text-zinc-400">
        {str}
      </pre>
    </details>
  );
}

export const ChatConnected = () => {
  const {
    disconnect,
    isMuted,
    isAudioMuted,
    isPlaying,
    mute,
    muteAudio,
    readyState,
    unmute,
    unmuteAudio,
    messages,
    sendUserInput,
    sendAssistantInput,
    pauseAssistant,
    resumeAssistant,
    lastUserMessage,
    lastVoiceMessage,
    lastAssistantProsodyMessage,
    isPaused,
    volume,
    setVolume,
    playerQueueLength,
    fft,
    micFft,
    callDurationTimestamp,
    chatMetadata,
  } = useVoice();

  const [textValue, setTextValue] = useState('');
  const [textInputType, setTextInputType] = useState<'user' | 'assistant'>(
    'user',
  );

  const togglePaused = useCallback(() => {
    if (isPaused) {
      resumeAssistant();
    } else {
      pauseAssistant();
    }
  }, [isPaused, resumeAssistant, pauseAssistant]);
  const pausedText = isPaused ? 'Resume assistant' : 'Pause assistant';

  const handleVolumeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newVolume = parseFloat(event.target.value);
      setVolume(newVolume);
    },
    [setVolume],
  );

  const selectTriggerClass =
    'h-10 shrink-0 border-zinc-700 bg-zinc-800/90 text-zinc-100 shadow-none hover:bg-zinc-800';

  return (
    <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-8">
      <div className="flex flex-col gap-5">
        <section className="rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-4 shadow-card backdrop-blur-md dark:bg-zinc-900/40">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Session
          </h2>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <StatPill label="Call duration">
              {callDurationTimestamp ?? '—'}
            </StatPill>
            <StatPill label="Playing">
              <span
                className={
                  isPlaying ? 'text-emerald-400' : 'text-zinc-500'
                }
              >
                {isPlaying ? 'Yes' : 'No'}
              </span>
            </StatPill>
            <StatPill label="Queue">{playerQueueLength}</StatPill>
            <StatPill label="Ready state">{readyState}</StatPill>
          </div>
          <div className="mt-3 grid gap-2">
            <IdBlock label="Request ID" value={chatMetadata?.requestId} />
            <IdBlock label="Chat group ID" value={chatMetadata?.chatGroupId} />
          </div>
        </section>

        <section className="rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-4 shadow-card backdrop-blur-md">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Audio controls
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="rounded-xl border border-white/[0.12] bg-white/[0.06] px-4 py-2.5 text-sm font-medium text-zinc-100 shadow-sm transition hover:bg-white/[0.12]"
              onClick={() => {
                void disconnect();
              }}
            >
              Disconnect
            </button>
            <button
              type="button"
              className="rounded-xl border border-white/[0.12] bg-white/[0.06] p-2.5 text-zinc-100 shadow-sm transition hover:bg-white/[0.12]"
              title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
              onClick={() => (isMuted ? unmute() : mute())}
            >
              {isMuted ? (
                <MicOff strokeWidth={1.75} className="size-5" />
              ) : (
                <MicIcon strokeWidth={1.75} className="size-5" />
              )}
            </button>
            <button
              type="button"
              className="rounded-xl border border-white/[0.12] bg-white/[0.06] p-2.5 text-zinc-100 shadow-sm transition hover:bg-white/[0.12]"
              title={isAudioMuted ? 'Unmute speaker' : 'Mute speaker'}
              onClick={() => (isAudioMuted ? unmuteAudio() : muteAudio())}
            >
              {isAudioMuted ? (
                <VolumeX strokeWidth={1.75} className="size-5" />
              ) : (
                <Volume2 strokeWidth={1.75} className="size-5" />
              )}
            </button>
          </div>

          <div className="mt-5">
            <label
              htmlFor="volumeSlider"
              className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-zinc-500"
            >
              Volume
              <span className="font-mono text-[11px] font-normal normal-case text-zinc-400">
                {Math.round(volume * 100)}%
              </span>
            </label>
            <input
              className="w-full"
              id="volumeSlider"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              disabled={isAudioMuted}
            />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-white/[0.06] bg-black/20 p-3">
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Playback
              </div>
              <Waveform fft={fft} accentClassName="fill-violet-400/85" />
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-black/20 p-3">
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                Microphone
              </div>
              <Waveform fft={micFft} accentClassName="fill-emerald-400/80" />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-white/[0.08] bg-zinc-900/40 p-4 shadow-card backdrop-blur-md">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Text message
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
            <SelectGroup className="shrink-0 sm:w-40">
              <Select
                value={textInputType}
                onValueChange={(value) => {
                  if (value === 'user' || value === 'assistant') {
                    setTextInputType(value);
                  }
                }}
              >
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue placeholder="Type" />
                  {textInputType === 'user' ? 'As user' : 'As assistant'}
                </SelectTrigger>
                <SelectContent className="border-zinc-700 bg-zinc-800 text-zinc-100">
                  <SelectItem value="user">As user</SelectItem>
                  <SelectItem value="assistant">As assistant</SelectItem>
                </SelectContent>
              </Select>
            </SelectGroup>
            <label className="flex min-h-[42px] grow flex-col gap-2">
              <span className="sr-only">Message text</span>
              <input
                className="h-full min-h-[42px] flex-1 rounded-xl border border-white/[0.12] bg-zinc-950/50 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none ring-accent/40 transition focus:border-violet-500/50 focus:ring-2"
                placeholder="Type a message…"
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
              />
            </label>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-zinc-950 shadow-lg shadow-violet-950/30 transition hover:bg-accent/90"
              onClick={() => {
                const method =
                  textInputType === 'user' ? sendUserInput : sendAssistantInput;
                method(textValue);
              }}
            >
              Send message
            </button>
            <button
              type="button"
              className="rounded-xl border border-white/[0.14] bg-white/[0.06] px-4 py-2.5 text-sm font-medium text-zinc-100 transition hover:bg-white/[0.11]"
              onClick={togglePaused}
            >
              {pausedText}
            </button>
          </div>
        </section>
      </div>

      <div className="flex min-h-0 flex-col gap-4">
        <section className="flex min-h-[320px] flex-1 flex-col rounded-2xl border border-white/[0.08] bg-zinc-900/40 shadow-card backdrop-blur-md dark:bg-zinc-900/40">
          <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
            <h2 className="text-sm font-semibold text-zinc-100">
              Conversation
            </h2>
            <span className="rounded-full bg-white/[0.06] px-2.5 py-0.5 font-mono text-[11px] text-zinc-400">
              {messages.length} msgs
            </span>
          </div>
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4 pb-5 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-track]:bg-transparent">
            {messages.length === 0 ? (
              <p className="py-8 text-center text-sm text-zinc-500">
                Messages appear here as you speak or send text.
              </p>
            ) : (
              messages.map((message) => {
                if (message.type === 'assistant_message') {
                  return (
                    <div key={message.id} className="flex justify-start">
                      <div className="max-w-[95%] rounded-2xl rounded-bl-md border border-violet-500/25 bg-violet-500/15 px-4 py-3 shadow-sm">
                        <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-violet-300/90">
                          Assistant
                        </div>
                        <p className="text-sm leading-relaxed text-zinc-100">
                          {message.message.content}
                        </p>
                      </div>
                    </div>
                  );
                }
                if (message.type === 'user_message') {
                  return (
                    <div
                      key={
                        message.receivedAt.toISOString() +
                        message.message.content +
                        JSON.stringify(message.time)
                      }
                      className="flex justify-end"
                    >
                      <div className="max-w-[95%] rounded-2xl rounded-br-md border border-zinc-600/60 bg-zinc-700/45 px-4 py-3 shadow-sm">
                        <div className="mb-1 text-right text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                          User
                          {message.interim ? (
                            <span className="text-zinc-500"> · interim</span>
                          ) : null}
                        </div>
                        <p className="text-right text-sm leading-relaxed text-zinc-100">
                          {message.message.content}
                        </p>
                      </div>
                    </div>
                  );
                }
                if (message.type === 'assistant_prosody') {
                  const scores = message.models?.prosody?.scores as
                    | Record<string, number>
                    | undefined;
                  const top = topEmotionEntries(scores, 5);
                  return (
                    <div
                      key={message.receivedAt.toISOString()}
                      className="flex justify-start"
                    >
                      <div className="max-w-[95%] rounded-2xl rounded-bl-md border border-fuchsia-500/25 bg-gradient-to-br from-fuchsia-950/40 to-zinc-900/40 px-4 py-3 shadow-sm">
                        <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-fuchsia-300/90">
                          Expression (prosody)
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {top.map(([key, value]) => (
                            <span
                              key={key}
                              className="inline-flex items-baseline gap-1.5 rounded-lg border border-white/[0.06] bg-black/25 px-2.5 py-1 font-mono text-[11px] text-zinc-200"
                            >
                              <span>{formatEmotionLabel(key)}</span>
                              <span className="text-fuchsia-300/95">
                                {(value as number).toFixed(2)}
                              </span>
                            </span>
                          ))}
                        </div>
                        <div className="mt-2">
                          <DebugPayload title="Full prosody payload" data={message} />
                        </div>
                      </div>
                    </div>
                  );
                }
                const typeLabel =
                  'type' in message && typeof message.type === 'string'
                    ? message.type
                    : 'Event';
                return (
                  <div
                    key={message.receivedAt.toISOString()}
                    className="flex justify-center px-1"
                  >
                    <div className="w-full max-w-lg">
                      <DebugPayload title={typeLabel} data={message} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-white/[0.06] border-dashed bg-zinc-950/30 p-4 backdrop-blur-sm">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Developer payloads
          </h2>
          <p className="mb-3 text-[11px] leading-relaxed text-zinc-500">
            Raw SDK payloads for debugging. Expand only when you need them.
          </p>
          <div className="flex flex-col gap-2">
            <DebugPayload
              title={
                lastVoiceMessage
                  ? `Last assistant voice · ${lastVoiceMessage.receivedAt.toLocaleTimeString()}`
                  : 'Last assistant voice (none)'
              }
              data={lastVoiceMessage ?? null}
            />
            <DebugPayload
              title={
                lastUserMessage
                  ? `Last user · ${lastUserMessage.receivedAt.toLocaleTimeString()}`
                  : 'Last user (none)'
              }
              data={lastUserMessage ?? null}
            />
            <DebugPayload
              title={
                lastAssistantProsodyMessage
                  ? `Last prosody · ${lastAssistantProsodyMessage.receivedAt.toLocaleTimeString()}`
                  : 'Last prosody (none)'
              }
              data={lastAssistantProsodyMessage ?? null}
            />
          </div>
        </section>
      </div>
    </div>
  );
};
