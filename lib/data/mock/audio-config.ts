// TODO(audio): no real Listening recordings exist yet. Every clip currently
// resolves to a silent placeholder file so the audio player UI is fully wired
// end-to-end. Replace with real recorded audio (or ERPNext-hosted file URLs)
// once the question bank's audio assets are available.
const PLACEHOLDER_AUDIO_URL = "/audio/placeholder-silence.wav"

export function getAudioUrl(audioClipId: string | undefined): string | null {
  if (!audioClipId) return null
  return PLACEHOLDER_AUDIO_URL
}
