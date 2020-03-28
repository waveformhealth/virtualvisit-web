import React, { useEffect, useRef } from 'react';
import { AudioTrack as IAudioTrack, LocalAudioTrack } from 'twilio-video';

interface AudioTrackProps {
  track: IAudioTrack | LocalAudioTrack;
}

export default function AudioTrack({ track }: AudioTrackProps) {
  const ref = useRef<HTMLAudioElement>(null!);

  useEffect(() => {
    const el = ref.current;
    track.attach(el);
    return () => {
      track.detach(el);
    };
  }, [track]);

  return <audio ref={ref} />;
}
