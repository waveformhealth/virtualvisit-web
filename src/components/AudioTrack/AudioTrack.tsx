import React, { useEffect, useRef } from 'react';
import { AudioTrack as IAudioTrack, LocalAudioTrack } from 'twilio-video';

interface AudioTrackProps {
  track: IAudioTrack | LocalAudioTrack;
  muted?: boolean;
}

export default function AudioTrack({ track, muted }: AudioTrackProps) {
  const ref = useRef<HTMLAudioElement>(null!);

  useEffect(() => {
    const el = ref.current;
    track.attach(el);
    el.muted = Boolean(muted);
    return () => {
      track.detach(el);
    };
  }, [track]);

  return <audio ref={ref} />;
}
