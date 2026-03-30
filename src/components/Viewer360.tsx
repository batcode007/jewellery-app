"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function Viewer360({ frames }: { frames: string[] }) {
  const [frameIndex, setFrameIndex] = useState(0);
  const [loadedCount, setLoadedCount] = useState(0);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startFrame = useRef(0);
  const SENSITIVITY = 4; // px per frame change

  const loaded = loadedCount >= frames.length;

  useEffect(() => {
    if (!frames.length) return;
    setFrameIndex(0);
    setLoadedCount(0);
    let count = 0;
    frames.forEach((url) => {
      const img = new window.Image();
      img.onload = img.onerror = () => {
        count++;
        setLoadedCount(count);
      };
      img.src = url;
    });
  }, [frames]);

  function onDragStart(clientX: number) {
    isDragging.current = true;
    startX.current = clientX;
    startFrame.current = frameIndex;
  }

  function onDragMove(clientX: number) {
    if (!isDragging.current) return;
    const delta = clientX - startX.current;
    const shift = Math.floor(delta / SENSITIVITY);
    const newIdx =
      ((startFrame.current - shift) % frames.length + frames.length) %
      frames.length;
    setFrameIndex(newIdx);
  }

  function onDragEnd() {
    isDragging.current = false;
  }

  if (!frames.length) return null;

  const progress = Math.round((loadedCount / frames.length) * 100);

  return (
    <div
      className="relative w-full h-full select-none cursor-grab active:cursor-grabbing"
      onMouseDown={(e) => onDragStart(e.clientX)}
      onMouseMove={(e) => onDragMove(e.clientX)}
      onMouseUp={onDragEnd}
      onMouseLeave={onDragEnd}
      onTouchStart={(e) => onDragStart(e.touches[0].clientX)}
      onTouchMove={(e) => {
        e.preventDefault();
        onDragMove(e.touches[0].clientX);
      }}
      onTouchEnd={onDragEnd}
    >
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gold-light/20 to-rose/30 z-10">
          <div className="w-12 h-12 rounded-full border-4 border-gold/20 border-t-gold animate-spin mb-3" />
          <p className="text-sm text-gray-500">Loading 360° view… {progress}%</p>
        </div>
      )}

      <Image
        src={frames[frameIndex]}
        alt={`360° frame ${frameIndex + 1}`}
        fill
        className="object-contain pointer-events-none"
        draggable={false}
        priority={frameIndex === 0}
        sizes="600px"
      />

      {loaded && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/40 backdrop-blur-sm rounded-full px-4 py-1.5 pointer-events-none">
          <span className="text-white text-xs font-medium">↔ Drag to rotate</span>
          <span className="text-white/40 text-xs">·</span>
          <span className="text-white/60 text-xs">{frames.length} frames</span>
        </div>
      )}
    </div>
  );
}
