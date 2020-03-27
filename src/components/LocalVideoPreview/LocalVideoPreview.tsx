import React from 'react';
import { LocalAudioTrack, LocalVideoTrack } from 'twilio-video';
import AudioTrack from '../AudioTrack/AudioTrack';
import VideoTrack from '../VideoTrack/VideoTrack';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';

export default function LocalVideoPreview() {
  const { localTracks } = useVideoContext();

  const audioTrack = localTracks.find(track => track.kind === 'audio') as LocalAudioTrack;
  const videoTrack = localTracks.find(track => track.name === 'camera') as LocalVideoTrack;

  return (
    <>
      {videoTrack ? <VideoTrack track={videoTrack} isLocal /> : null}
      {audioTrack ? <AudioTrack track={audioTrack} muted /> : null}
    </>
  );
}
