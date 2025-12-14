import React, { useEffect, useRef, useState } from 'react';
import { Camera } from '@mediapipe/camera_utils';
import { Hands } from '@mediapipe/hands';
import { FaceMesh } from '@mediapipe/face_mesh';
import { Pose } from '@mediapipe/pose';

interface MediaPipeSensorsProps {
  className?: string;
  onMetrics?: (metrics: { hands: number; faces: number; poses: number }) => void;
}

const MediaPipeSensors: React.FC<MediaPipeSensorsProps> = ({ className, onMetrics }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [status, setStatus] = useState('Initializing');
  const [counts, setCounts] = useState({ hands: 0, faces: 0, poses: 0 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let camera: Camera | null = null;
    let hands: Hands | null = null;
    let faceMesh: FaceMesh | null = null;
    let pose: Pose | null = null;
    let running = true;

    const init = async () => {
      try {
        const video = document.createElement('video');
        videoRef.current = video;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        hands = new Hands({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}` });
        hands.setOptions({ maxHands: 2, modelComplexity: 1, selfieMode: true });
        hands.onResults((results: any) => {
          if (!running || !ctx || !canvas) return;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const handCount = results.multiHandLandmarks ? results.multiHandLandmarks.length : 0;
          setCounts((prev) => ({ ...prev, hands: handCount }));
          onMetrics?.({ hands: handCount, faces: counts.faces, poses: counts.poses });
        });

        faceMesh = new FaceMesh({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}` });
        faceMesh.setOptions({ refineLandmarks: true });
        faceMesh.onResults((results: any) => {
          if (!running || !ctx || !canvas) return;
          const faceCount = results.multiFaceLandmarks ? results.multiFaceLandmarks.length : 0;
          setCounts((prev) => ({ ...prev, faces: faceCount }));
          onMetrics?.({ hands: counts.hands, faces: faceCount, poses: counts.poses });
        });

        pose = new Pose({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}` });
        pose.setOptions({ modelComplexity: 1 });
        pose.onResults((results: any) => {
          if (!running || !ctx || !canvas) return;
          const hasPose = results.poseLandmarks && results.poseLandmarks.length > 0 ? 1 : 0;
          setCounts((prev) => ({ ...prev, poses: hasPose }));
          onMetrics?.({ hands: counts.hands, faces: counts.faces, poses: hasPose });
        });

        camera = new Camera(video, {
          onFrame: async () => {
            if (!video) return;
            await hands!.send({ image: video });
            await faceMesh!.send({ image: video });
            await pose!.send({ image: video });
          },
          width: 640,
          height: 480,
        });
        await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
        setReady(true);
        setStatus('Running');
        camera.start();
      } catch (e) {
        setStatus('Error');
      }
    };

    init();

    return () => {
      running = false;
      try {
        camera?.stop();
      } catch {}
    };
  }, []);

  return (
    <div className={`bg-gray-800 rounded-lg p-4 border border-gray-700 ${className || ''}`}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-white font-semibold">MediaPipe Sensors</h3>
        <div className="text-xs text-gray-400">{status}</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-900 rounded p-2">
          <canvas ref={canvasRef} width={640} height={480} className="w-full rounded" />
        </div>
        <div className="bg-gray-900 rounded p-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-gray-400 text-xs">Hands</div>
              <div className="text-purple-400 text-xl font-mono">{counts.hands}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-400 text-xs">Faces</div>
              <div className="text-blue-400 text-xl font-mono">{counts.faces}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-400 text-xs">Pose</div>
              <div className="text-green-400 text-xl font-mono">{counts.poses}</div>
            </div>
          </div>
          <div className="mt-4 text-xs text-gray-500">
            {ready ? 'Camera active' : 'Awaiting camera permission'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaPipeSensors;
