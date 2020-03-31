import React, { useEffect, useRef } from 'react';
import { AudioTrack } from 'twilio-video';
import MicOff from '@material-ui/icons/MicOff';
import useIsTrackEnabled from '../../hooks/useIsTrackEnabled/useIsTrackEnabled';

// @ts-ignore
const AudioContext = window.AudioContext || window.webkitAudioContext;

export default function AudioLevelIndicator({
  size,
  audioTrack,
  background,
}: {
  size?: number;
  audioTrack?: AudioTrack;
  background?: string;
}) {
  const SIZE = size || 24;
  const ref = useRef<SVGRectElement>(null);
  const isTrackEnabled = useIsTrackEnabled(audioTrack as any);

  useEffect(() => {
    const SVGClipElement = ref.current;
    if (audioTrack && isTrackEnabled && SVGClipElement) {
      const stream = new MediaStream();
      stream.addTrack(audioTrack.mediaStreamTrack);
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const audioSource = audioContext.createMediaStreamSource(stream);
      const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

      analyser.smoothingTimeConstant = 0.6;
      analyser.fftSize = 1024;

      audioSource.connect(analyser);
      analyser.connect(javascriptNode);
      javascriptNode.connect(audioContext.destination);
      javascriptNode.onaudioprocess = function() {
        const array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        let values = 0;

        const length = array.length;
        for (let i = 0; i < length; i++) {
          values += array[i];
        }

        const volume = Math.min(21, Math.max(0, Math.log10(values / length / 3) * 14));

        window.requestAnimationFrame(() => {
          SVGClipElement.setAttribute('y', String(21 - volume));
        });
      };

      return () => {
        audioContext.close();
        javascriptNode.disconnect(audioContext.destination);
        SVGClipElement.setAttribute('y', '21');
      };
    }
  }, [audioTrack, isTrackEnabled]);

  return isTrackEnabled ? (
    <svg focusable="false" viewBox="0 0 24 24" aria-hidden="true" height={`${SIZE}px`} width={`${SIZE}px`}>
      <defs>
        <clipPath id="audio-level-clip">
          <rect ref={ref} x="0" y="21" width="24" height="24" />
        </clipPath>
      </defs>
      <path
        fill={background || 'rgba(255, 255, 255, 0.1)'}
        d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"
      ></path>
      <path
        fill="#0f0"
        clipPath="url(#audio-level-clip)"
        d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"
      ></path>
    </svg>
  ) : (
    <MicOff
      height={`${SIZE}px`}
      width={`${SIZE}px`}
      style={{ width: 'initial', height: 'initial' }}
      data-cy-audio-mute-icon
    />
  );
}