import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import React, { useRef, useEffect } from 'react';
import { IVideoTrack } from '../../types';
import { Track } from 'twilio-video';

const useStyles = makeStyles({
  container: {
    display: 'contents',
    '& video': {
      width: '100%',
      maxHeight: '100%',
      objectFit: 'contain',
    },
  },
  isLocal: {
    '& video': {
      transform: 'rotateY(180deg)',
    },
  },
});

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

export default function VideoTrack({ track, isLocal, priority, videoEl }: VideoTrackProps) {
  const classes = useStyles();
  const containerRef = useRef<HTMLDivElement>(null!);
  const videoElRef = useRef(videoEl);

  useEffect(() => {
    if (!videoElRef.current) {
      // Create a video element if it wasn't passed as a prop
      videoElRef.current = document.createElement('video');
    }
    const el = videoElRef.current;
    containerRef.current.appendChild(el);
    if (!el.srcObject) {
      // When a value is assigned to the srcObject property, it causes a brief flicker in video elements that are already
      // displaying video. To prevent this, we assign a value to srcObject only once. If this component is rendered
      // with a new video track, we update the video element by replacing the MediaStreamTrack in the MediaStream.
      // This allows us to display a new participant without a flicker in the video.
      el.srcObject = new MediaStream();
    }
    el.muted = true;
    el.autoplay = true;
  }, []);

  useEffect(() => {
    if (track.setPriority && priority) {
      track.setPriority(priority);
    }
    const el = videoElRef.current;
    track.attach(el);

    return () => {
      if (track.setPriority && priority) {
        // Passing `null` to setPriority will set the track's priority to that which it was published with.
        track.setPriority(null);
      }
    };
  }, [track, priority]);

  return <div ref={containerRef} className={clsx(classes.container, { [classes.isLocal]: isLocal })} />;
}
