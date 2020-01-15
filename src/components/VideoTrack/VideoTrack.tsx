import classes from './VideoTrack.module.scss';
import clsx from 'clsx';
import React, { useRef, useEffect } from 'react';
import { IVideoTrack } from '../../types';
import { Track } from 'twilio-video';

interface VideoTrackProps {
  track: IVideoTrack;
  isLocal?: boolean;
  priority?: Track.Priority;
  videoEl?: HTMLVideoElement;
}

function updateStream(stream: MediaStream, track: MediaStreamTrack) {
  const tracks = stream.getTracks();
  if (tracks.includes(track)) {
    return;
  }
  tracks.forEach(track => stream.removeTrack(track));
  stream.addTrack(track);
}

export default function VideoTrack({
  track,
  isLocal,
  priority,
  videoEl = document.createElement('video'),
}: VideoTrackProps) {
  const containerRef = useRef<HTMLDivElement>(null!);
  const streamRef = useRef(new MediaStream());

  useEffect(() => {
    containerRef.current.appendChild(videoEl);
    // When a value is assigned to the srcObject property, it causes a brief flicker in video elements that are already
    // displaying video. To prevent this, we assign a value to srcObject only once. If this component is rendered
    // with a new video track, we update the video element by replacing the MediaStreamTrack in the MediaStream.
    // This allows us to display a new participant without a flicker in the video. See 'updateStream' function.
    videoEl.srcObject = streamRef.current;
    videoEl.muted = true;
    videoEl.autoplay = true;
    return () => {
      containerRef.current.removeChild(videoEl);
    };
  }, [videoEl]);

  useEffect(() => {
    if (track.setPriority && priority) {
      track.setPriority(priority);
    }
    updateStream(streamRef.current, track.mediaStreamTrack);
    return () => {
      if (track.setPriority && priority) {
        // Passing `null` to setPriority will set the track's priority to that which it was published with.
        track.setPriority(null);
      }
    };
  }, [track, priority]);

  return <div ref={containerRef} className={clsx(classes.container, { [classes.isLocal]: isLocal })} />;
}
