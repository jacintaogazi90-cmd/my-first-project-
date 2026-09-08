# Multicam prompt

Turns one real talking-head take into a virtual multi-camera edit with hard
cuts. Upload the source video to Google Omni, select it as the source footage,
and paste `talking-head-multicam-prompt.txt` as the prompt.

The prompt freezes identity, room, lighting, audio and lip sync, and changes
only the virtual camera. It does not describe or regenerate the scene — the
source video carries that. The prompt is always in English regardless of the
video's spoken language, because it instructs the camera, not the speech.

## Source clip

- Duration 15.17s, 464x832 vertical, 30fps
- Single speaker, plain light wall, seated

## Cut sheet

| Cut | Time | Angle | Placement |
|-----|------|-------|-----------|
| 1 | 1.0s | left profile | opening window (0.8-1.3s) |
| 2 | 4.5s | extreme high, glance up | inside the 0.49s breath, the clip's cleanest break |
| 3 | 7.8s | close-up on face | start of the 0.28s breath |
| 4 | 14.0s | back to original framing | start of the 0.29s breath, before the closing phrase |

## How the timings were derived

Whisper was unavailable — its model hosts (`openaipublic.azureedge.net`,
`huggingface.co`) are blocked by the session's egress policy. Breath positions
came from `ffmpeg` silence detection instead, stable across -22/-25/-28dB
thresholds:

    ffmpeg -i source.mp4 -af silencedetect=noise=-25dB:d=0.15 -f null -

That is reliable for locating silences but has no word-level resolution. One
consequence: an automated check flags cut 1 as landing mid-word, because the
first speech run is a single undifferentiated 2.19s block, so any cut inside it
trips that test. 1.0s is where the opening cut belongs and it is most likely
sitting in a normal inter-word gap, but this was not confirmed. If the render
clips a syllable there, nudge cut 1 to 0.9s or 1.1s.

An earlier draft of the shot list placed cut 4 at 20.8s, past the end of a
15.17s clip. It was moved to 7.8s, which also breaks up what would otherwise
have been a 9.5s hold on a single angle.
