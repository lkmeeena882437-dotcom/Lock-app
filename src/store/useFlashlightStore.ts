import { create } from 'zustand';

interface PremiumState {
  active: boolean;
  expiresAt: number | null;
  verifiedToken: string | null;
}

interface Store {
  isOn: boolean;
  stream: MediaStream | null;
  videoTrack: MediaStreamTrack | null;
  isFullscreen: boolean;
  paywallOpen: boolean;
  premium: PremiumState;
  loading: boolean;

  setStream: (s: MediaStream, t: MediaStreamTrack) => void;
  setFullscreen: (v: boolean) => void;
  turnOn: () => Promise<void>;
  attemptTurnOff: () => Promise<void>; // Gated by premium
  openPaywall: () => void;
  closePaywall: () => void;
  unlockPremium: (token: string, expiresAt: number) => void;
  checkPremiumValidity: () => boolean;
}

export const useFlashlightStore = create<Store>((set, get) => ({
  isOn: false,
  stream: null,
  videoTrack: null,
  isFullscreen: false,
  paywallOpen: false,
  premium: { active: false, expiresAt: null, verifiedToken: null },
  loading: false,

  setStream: (s, t) => set({ stream: s, videoTrack: t }),

  setFullscreen: (v) => set({ isFullscreen: v }),

  turnOn: async () => {
    const { videoTrack, isOn } = get();
    if (isOn) return;
    if (!videoTrack) {
      alert('Camera permission is required.');
      return;
    }
    try {
      if (videoTrack.getCapabilities && videoTrack.getCapabilities().torch) {
        await videoTrack.applyConstraints({ advanced: [{ torch: true }] as any });
      }
      set({ isOn: true, paywallOpen: false });
    } catch (e) {
      console.error('Torch error', e);
    }
  },

  attemptTurnOff: async () => {
    const { isOn, videoTrack } = get();
    if (!isOn) return;

    // SECURITY GATE: Must be server-verified premium
    if (!get().checkPremiumValidity()) {
      get().openPaywall();
      return;
    }

    try {
      if (videoTrack?.getCapabilities?.().torch) {
        await videoTrack.applyConstraints({ advanced: [{ torch: false }] as any });
      }
      set({ isOn: false });
    } catch (e) {
      console.error('Torch off error', e);
    }
  },

  openPaywall: () => set({ paywallOpen: true }),
  closePaywall: () => set({ paywallOpen: false }),

  unlockPremium: (token, expiresAt) => {
    // In production: replace with HttpOnly cookie set by server
    sessionStorage.setItem('lumina_token', token);
    sessionStorage.setItem('lumina_expiry', String(expiresAt));
    set({
      premium: { active: true, expiresAt, verifiedToken: token },
      paywallOpen: false,
      isOn: true,
    });
  },

  checkPremiumValidity: () => {
    const s = get();
    if (!s.premium.verifiedToken) return false;
    if (s.premium.expiresAt && Date.now() > s.premium.expiresAt) return false;
    return true;
  },
}));
