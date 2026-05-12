'use client';

import { useVoice } from '@humeai/voice-react';
import { useEffect, useMemo, useState } from 'react';
import { match } from 'ts-pattern';

import { ChatConnected } from '@/components/ChatConnected';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/Select';

export const ExampleComponent = ({
  accessToken,
  configId,
}: {
  accessToken: string;
  configId?: string;
}) => {
  const { connect, disconnect, status, callDurationTimestamp } = useVoice();

  const [audioInputDevices, setAudioInputDevices] = useState<MediaDeviceInfo[]>(
    [],
  );
  const [audioOutputDevices, setAudioOutputDevices] = useState<
    MediaDeviceInfo[]
  >([]);
  const [selectedMicrophoneId, setSelectedMicrophoneId] = useState<string>('');
  const [selectedSpeakerId, setSelectedSpeakerId] = useState<string>('');
  const [secureContext, setSecureContext] = useState(true);
  const [deviceSetupError, setDeviceSetupError] = useState<string | null>(null);

  useEffect(() => {
    setSecureContext(window.isSecureContext);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const getDevices = async () => {
      let stream: MediaStream | null = null;
      try {
        setDeviceSetupError(null);
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        const devices = await navigator.mediaDevices.enumerateDevices();
        if (cancelled) {
          return;
        }
        const audioInputs = devices.filter(
          (device) => device.kind === 'audioinput',
        );
        const audioOutputs = devices.filter(
          (device) => device.kind === 'audiooutput',
        );

        setAudioInputDevices(audioInputs);
        setAudioOutputDevices(audioOutputs);

        setSelectedMicrophoneId((prev) => prev || audioInputs[0]?.deviceId || '');
        setSelectedSpeakerId((prev) => prev || audioOutputs[0]?.deviceId || '');
      } catch (e) {
        const message =
          e instanceof Error ? e.message : 'Unable to access microphone';
        setDeviceSetupError(message);
      } finally {
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
        }
      }
    };

    void getDevices();
    return () => {
      cancelled = true;
    };
  }, []);

  const connectArgs = useMemo(
    () => ({
      auth: {
        type: 'accessToken' as const,
        value: accessToken,
      },
      hostname: process.env.NEXT_PUBLIC_HUME_VOICE_HOSTNAME || 'api.hume.ai',
      ...(configId
        ? {
            configId,
            sessionSettings: {
              type: 'session_settings' as const,
              builtinTools: [{ name: 'web_search' as const }],
            },
          }
        : {}),
      devices: {
        ...(selectedMicrophoneId.trim()
          ? { microphoneDeviceId: selectedMicrophoneId }
          : {}),
        ...(selectedSpeakerId.trim()
          ? { speakerDeviceId: selectedSpeakerId }
          : {}),
      },
    }),
    [
      accessToken,
      configId,
      selectedMicrophoneId,
      selectedSpeakerId,
    ],
  );

  const selectTriggerClass =
    'w-full border-zinc-700 bg-zinc-800/90 text-zinc-100 shadow-none hover:bg-zinc-800';

  const deviceSelectors = (
    <div className="flex max-w-2xl flex-col gap-5">
      <div className="flex flex-col gap-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Microphone
        </div>
        <Select
          value={selectedMicrophoneId}
          onValueChange={setSelectedMicrophoneId}
        >
          <SelectTrigger className={selectTriggerClass}>
            <SelectValue placeholder="Select microphone" />
          </SelectTrigger>
          <SelectContent className="max-h-60 overflow-y-auto rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-100 shadow-xl">
            {audioInputDevices.map((device) => (
              <SelectItem
                key={device.deviceId}
                value={device.deviceId}
                className="cursor-pointer px-8 py-2 focus:bg-zinc-700"
              >
                {device.label || `Microphone ${device.deviceId.slice(0, 8)}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Speaker
        </div>
        <Select value={selectedSpeakerId} onValueChange={setSelectedSpeakerId}>
          <SelectTrigger className={selectTriggerClass}>
            <SelectValue placeholder="Select speaker" />
          </SelectTrigger>
          <SelectContent className="max-h-60 overflow-y-auto rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-100 shadow-xl">
            {audioOutputDevices.map((device) => (
              <SelectItem
                key={device.deviceId}
                value={device.deviceId}
                className="cursor-pointer px-8 py-2 focus:bg-zinc-700"
              >
                {device.label || `Speaker ${device.deviceId.slice(0, 8)}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const canConnectAudio = secureContext && !deviceSetupError;

  const connectButton = (
    <button
      type="button"
      className="max-w-sm rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-zinc-950 shadow-lg shadow-violet-950/25 transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-45"
      disabled={!canConnectAudio}
      onClick={() => {
        void connect(connectArgs);
      }}
    >
      Connect to voice
    </button>
  );

  const callDuration = (
    <div className="rounded-xl border border-white/[0.08] bg-zinc-950/35 px-3 py-2.5">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
        Call duration
      </div>
      <div className="mt-1 font-mono text-sm text-zinc-100">
        {callDurationTimestamp ?? '—'}
      </div>
    </div>
  );

  const statusBadgeClass = match(status.value)
    .with('connected', () => 'border-emerald-500/35 bg-emerald-500/15 text-emerald-200')
    .with('connecting', () => 'border-amber-500/35 bg-amber-500/15 text-amber-100')
    .with('disconnected', () => 'border-zinc-600 bg-zinc-800/80 text-zinc-300')
    .with('error', () => 'border-red-500/40 bg-red-950/50 text-red-200')
    .exhaustive();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Connection
        </span>
        <span
          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize ${statusBadgeClass}`}
        >
          {status.value}
        </span>
      </div>
      {!secureContext && (
        <div className="rounded-2xl border border-red-500/30 bg-red-950/40 px-4 py-3 text-sm leading-relaxed text-red-100/95 shadow-card backdrop-blur-sm">
          Microphone and playback require a <strong>secure context</strong>. Open
          this app as{' '}
          <code className="rounded-md bg-black/40 px-1.5 py-0.5 font-mono text-xs">
            http://localhost:3003
          </code>{' '}
          or{' '}
          <code className="rounded-md bg-black/40 px-1.5 py-0.5 font-mono text-xs">
            http://127.0.0.1:3003
          </code>
          , or use HTTPS. Plain HTTP to a remote host (not localhost) blocks audio
          capture.
        </div>
      )}
      {deviceSetupError && (
        <div className="rounded-2xl border border-red-500/30 bg-red-950/40 px-4 py-3 text-sm text-red-100/95 shadow-card backdrop-blur-sm">
          Could not access the microphone: {deviceSetupError}. Check OS/browser
          permissions for this site.
        </div>
      )}
      <div className="flex flex-col gap-6">
        {match(status.value)
          .with('connected', () => <ChatConnected />)
          .with('disconnected', () => (
            <div className="flex flex-col gap-5 rounded-2xl border border-white/[0.08] bg-zinc-900/35 p-5 shadow-card backdrop-blur-md">
              {!configId && (
                <div className="rounded-xl border border-amber-500/25 bg-amber-950/40 px-4 py-3 text-sm text-amber-100/95">
                  Tool use is disabled. Set{' '}
                  <code className="rounded bg-black/35 px-1.5 py-0.5 font-mono text-xs">
                    HUME_CONFIG_ID
                  </code>{' '}
                  to enable tools.
                </div>
              )}
              {callDuration}
              {deviceSelectors}
              {connectButton}
            </div>
          ))
          .with('connecting', () => (
            <div className="flex max-w-md flex-col gap-4 rounded-2xl border border-white/[0.08] bg-zinc-900/35 p-5 shadow-card backdrop-blur-md">
              {callDuration}

              <button
                type="button"
                className="cursor-not-allowed rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-3 text-sm font-medium text-zinc-400"
                disabled
              >
                Connecting…
              </button>
              <button
                type="button"
                className="rounded-xl border border-red-500/40 bg-red-950/35 px-4 py-3 text-sm font-medium text-red-300 transition hover:bg-red-950/55"
                onClick={() => {
                  void disconnect();
                }}
              >
                Cancel
              </button>
            </div>
          ))
          .with('error', () => (
            <div className="flex flex-col gap-5 rounded-2xl border border-white/[0.08] bg-zinc-900/35 p-5 shadow-card backdrop-blur-md">
              {!configId && (
                <div className="rounded-xl border border-amber-500/25 bg-amber-950/40 px-4 py-3 text-sm text-amber-100/95">
                  Tool use is disabled. Set{' '}
                  <code className="rounded bg-black/35 px-1.5 py-0.5 font-mono text-xs">
                    HUME_CONFIG_ID
                  </code>{' '}
                  to enable tools.
                </div>
              )}
              {callDuration}
              {deviceSelectors}
              {connectButton}
              <div className="rounded-xl border border-red-500/30 bg-red-950/35 px-4 py-3 text-sm text-red-200">
                {status.reason}
              </div>
            </div>
          ))
          .exhaustive()}
      </div>
    </div>
  );
};
