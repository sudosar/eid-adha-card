/*
 * Shared audio context — any component can call tryPlayAudio() on first interaction.
 * Browsers block autoplay until a user gesture, so we hook every tap/click globally.
 */

// Eid Takbeer from Madinah — the traditional recitation chanted during Eid al-Adha.
// Source: Internet Archive (archive.org/details/EidTakbeerMadina) — public domain.
const AUDIO_URL =
  "https://archive.org/download/EidTakbeerMadina/eid%20takbeer%20madina.mp3";

let audio: HTMLAudioElement | null = null;
let hasPlayed = false;
let listeners: Array<(playing: boolean) => void> = [];

function getAudio(): HTMLAudioElement {
  if (!audio) {
    audio = new Audio(AUDIO_URL);
    audio.loop = true;
    audio.volume = 0.35;
    audio.preload = "auto";
  }
  return audio;
}

getAudio(); // preload immediately

export function tryPlayAudio(): void {
  if (hasPlayed) return;
  getAudio()
    .play()
    .then(() => {
      hasPlayed = true;
      notifyListeners(true);
    })
    .catch(() => {});
}

export function toggleAudio(): void {
  const a = getAudio();
  if (a.paused) {
    a.play()
      .then(() => {
        hasPlayed = true;
        notifyListeners(true);
      })
      .catch(() => {});
  } else {
    a.pause();
    notifyListeners(false);
  }
}

export function isAudioPlaying(): boolean {
  return audio ? !audio.paused : false;
}

export function onAudioStateChange(cb: (playing: boolean) => void): () => void {
  listeners.push(cb);
  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
}

function notifyListeners(playing: boolean): void {
  listeners.forEach((l) => l(playing));
}

// Auto-start on first user gesture anywhere on the page
if (typeof document !== "undefined") {
  const handler = () => {
    tryPlayAudio();
    if (hasPlayed) {
      document.removeEventListener("click", handler, true);
      document.removeEventListener("touchend", handler, true);
      document.removeEventListener("pointerup", handler, true);
    }
  };
  document.addEventListener("click", handler, true);
  document.addEventListener("touchend", handler, true);
  document.addEventListener("pointerup", handler, true);
}
