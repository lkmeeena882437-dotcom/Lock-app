"use client";
import { useEffect } from "react";
import { useFlashlightStore } from "@/store/useFlashlightStore";

export default function FullscreenController() {
  const { setFullscreen } = useFlashlightStore();
  useEffect(() => {
    const tryFS = async () => {
      const el = document.documentElement;
      if (el.requestFullscreen) {
        try {
          await el.requestFullscreen();
          setFullscreen(true);
        } catch {
          setFullscreen(false);
        }
      }
    };
    tryFS();
    const onChange = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, [setFullscreen]);
  return null;
}
