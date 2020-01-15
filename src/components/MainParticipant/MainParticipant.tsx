import MainParticipantInfo from '../MainParticipantInfo/MainParticipantInfo';
import ParticipantTracks from '../ParticipantTracks/ParticipantTracks';
import React, { useRef } from 'react';
import useMainSpeaker from '../../hooks/useMainSpeaker/useMainSpeaker';

export default function MainParticipant() {
  const mainParticipant = useMainSpeaker();

  // The MainParticipant component may change which participant it displays.
  // When this happens, we don't want React to render a new <video> element. We want
  // React to use the same element as before, so we must create it here and pass it
  // down to the VideoTrack component.
  const videoEl = useRef(document.createElement('video'));

  return (
    /* audio is disabled for this participant component because this participant's audio 
       is already being rendered in the <ParticipantStrip /> component.  */
    <MainParticipantInfo participant={mainParticipant}>
      <ParticipantTracks
        participant={mainParticipant}
        disableAudio
        enableScreenShare
        videoPriority="high"
        videoEl={videoEl.current}
      />
    </MainParticipantInfo>
  );
}
