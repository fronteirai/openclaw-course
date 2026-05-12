import { motion } from 'framer-motion';
import type { FC } from 'react';

type WaveformProps = {
  fft: readonly number[];
  /** Tailwind fill class for bars, e.g. fill-violet-400/85 */
  accentClassName?: string;
};

export const Waveform: FC<WaveformProps> = (props) => {
  const { fft, accentClassName = 'fill-zinc-400/90' } = props;

  return (
    <motion.svg
      className="h-[120px] w-full max-w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
    >
      {Array.from({ length: 24 }).map((_, index) => {
        const value = (fft[index] ?? 0) / 4;
        const height = Math.min(Math.max(value * 80, 2), 70);
        const yOffset = 50 - height * 0.5;

        return (
          <motion.rect
            className={`transition-colors ${accentClassName}`}
            key={index}
            height={height}
            width={2}
            x={2 + (index * 100 - 4) / 24}
            y={yOffset}
          />
        );
      })}
    </motion.svg>
  );
};
