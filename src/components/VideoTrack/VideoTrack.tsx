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

export function attach(videoTrack: any, videoEl: any) {
  const stream = videoEl.srcObject || new MediaStream();
  stream.getVideoTracks().forEach((track: any) => stream.removeTrack(track));
  stream.addTrack(videoTrack.mediaStreamTrack as any);
  console.log(videoEl.srcObject);
  if (!videoEl.srcObject) {
    videoEl.srcObject = stream;
  }
  videoEl.pause();
  videoEl.play();
}

export default function VideoTrack({
  track,
  isLocal,
  priority,
  videoEl = document.createElement('video'),
}: VideoTrackProps) {
  const ref = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    ref.current.appendChild(videoEl);
    videoEl.muted = true;
    videoEl.autoplay = true;
  }, []);

  useEffect(() => {
    const el = videoEl;
    if (track.setPriority && priority) {
      track.setPriority(priority);
    }
    attach(track, el);
    return () => {
      if (track.setPriority && priority) {
        // Passing `null` to setPriority will set the track's priority to that which it was published with.
        track.setPriority(null);
      }
    };
  }, [track, priority]);

  return <div ref={ref} className={clsx(classes.container, { [classes.isLocal]: isLocal })} />;
}
