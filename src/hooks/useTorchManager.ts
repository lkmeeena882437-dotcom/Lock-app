"use client";
import { useEffect, useRef } from "react";
import { useFlashlightStore } from "@/store/useFlashlightStore";

export const useTorchManager = () => {
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { exact: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });
        const track = stream.getVideoTracks()[0];
        useFlashlightStore.getState().setStream(stream, track);
      } catch (err) {
        console.warn("Camera init failed:", err);
        alert("Please allow camera access for the flashlight.");
      }
    };

    init();

    return () => {
      const state = useFlashlightStore.getState();
      if (state.videoTrack) state.videoTrack.stop();
      if (state.stream) state.stream.getTracks().forEach((t) => t.stop());
    };
  }, []);
};
