import React from 'react';
import { render } from '@testing-library/react';
import VideoTrack from './VideoTrack';

const mockMediaStream = {
  getTracks: jest.fn(() => ['existingTrack']),
  addTrack: jest.fn(),
  removeTrack: jest.fn(),
};

// @ts-ignore - Property 'MediaStream' does not exist on type 'Global'.
global.MediaStream = function() {
  return mockMediaStream;
};

describe('the VideoTrack component', () => {
  const mockTrack = { setPriority: jest.fn(), mediaStreamTrack: 'newTrack' } as any;

  afterEach(jest.clearAllMocks);

  it('should remove existing MediaStreamTracks and attach the new MediaStreamTrack to the MediaStream', () => {
    render(<VideoTrack track={mockTrack} />);
    expect(mockMediaStream.getTracks).toHaveBeenCalled();
    expect(mockMediaStream.removeTrack).toHaveBeenCalledWith('existingTrack');
    expect(mockMediaStream.addTrack).toHaveBeenCalledWith('newTrack');
  });

  it('should not do anything when the MediaStreamTrack already exists in the MediaStream', () => {
    render(<VideoTrack track={{ setPriority: jest.fn(), mediaStreamTrack: 'existingTrack' } as any} />);
    expect(mockMediaStream.getTracks).toHaveBeenCalled();
    expect(mockMediaStream.removeTrack).not.toHaveBeenCalledWith('existingTrack');
    expect(mockMediaStream.addTrack).not.toHaveBeenCalledWith('existingTrack');
  });

  it('should flip the video horizontally if the track is local', () => {
    const { container } = render(<VideoTrack track={mockTrack} isLocal />);
    expect(container.querySelector('div')!.classList.toString()).toMatch('isLocal');
  });

  it('should not flip the video horizontally if the track is not local', () => {
    const { container } = render(<VideoTrack track={mockTrack} />);
    expect(container.querySelector('div')!.classList.toString()).not.toMatch('isLocal');
  });

  it('should set the track priority when it is attached', () => {
    render(<VideoTrack track={mockTrack} priority="high" />);
    expect(mockTrack.setPriority).toHaveBeenCalledWith('high');
  });

  it('should set the track priority to "null" when it is detached and set the priority of the new track', () => {
    const mockTrack2 = { setPriority: jest.fn() } as any;
    const { rerender } = render(<VideoTrack track={mockTrack} priority="high" />);
    expect(mockTrack.setPriority).toHaveBeenCalledWith('high');
    rerender(<VideoTrack track={mockTrack2} priority="high" />);
    expect(mockTrack.setPriority).toHaveBeenCalledWith(null);
    expect(mockTrack2.setPriority).toHaveBeenCalledWith('high');
  });

  it('should set the track priority to "null" when it is unmounted', () => {
    const { unmount } = render(<VideoTrack track={mockTrack} priority="high" />);
    expect(mockTrack.setPriority).toHaveBeenCalledWith('high');
    unmount();
    expect(mockTrack.setPriority).toHaveBeenCalledWith(null);
  });

  it('should not set the track priority on mount or unmount when no priority is specified', () => {
    const { unmount } = render(<VideoTrack track={mockTrack} />);
    unmount();
    expect(mockTrack.setPriority).not.toHaveBeenCalled();
  });

  it('should attach a MediaSteam to a video element that is passed as a prop', () => {
    const videoEl = document.createElement('video');
    const { container } = render(<VideoTrack track={mockTrack} videoEl={videoEl} />);
    expect(container.querySelector('video')!.srcObject).toBe(mockMediaStream);
  });

  it('should always return the same video element when it receives one as a prop', () => {
    const videoEl = document.createElement('video');
    const mockTrack2 = { setPriority: jest.fn() } as any;
    const { container, rerender } = render(<VideoTrack track={mockTrack} videoEl={videoEl} />);
    expect(container.querySelector('video')).toBe(videoEl);
    rerender(<VideoTrack track={mockTrack2} videoEl={videoEl} />);
    expect(container.querySelector('video')).toBe(videoEl);
  });
});
