import React, { useRef, useEffect } from 'react';

const TOPOLOGY_VIDEOS = {
  school:             '/videos/topology-school.mp4',
  hospital:           '/videos/topology-hospital.mp4',
  bank:               '/videos/topology-bank.mp4',
  'industrial-park':  '/videos/topology-industrial.mp4',
  community:          '/videos/topology-community.mp4',
  'commercial-complex': '/videos/topology-commercial.mp4',
  'commercial-building': '/videos/topology-commercial.mp4',
  'chain-store':      '/videos/topology-chainstore.mp4',
};

export default function SolutionFlowChart({ solutionId = 'school' }) {
  const videoRef = useRef(null);
  const videoSrc = TOPOLOGY_VIDEOS[solutionId] || TOPOLOGY_VIDEOS.school;

  // Reload and autoplay whenever the solution tab changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [solutionId, videoSrc]);

  return (
    <div className="relative rounded-2xl overflow-hidden aspect-video w-full bg-transparent">
      <video
        ref={videoRef}
        key={`${solutionId}-${videoSrc}`}
        autoPlay
        loop
        muted
        playsInline
        controls
        preload="auto"
        className="w-full h-full object-contain"
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
