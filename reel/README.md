# Reel edit

Vertical (1080x1920) Reel/TikTok/Short edit of `public/source.mp4`, built with
Remotion. Composition: `src/Reel.tsx` (registered as `Reel` in
`src/Composition.tsx`).

## What this edit does

- **Trims dead air.** Silence-detected pauses (>0.3s) are cut out of the
  9 talking segments defined in `src/constants.ts`, tightening ~31.4s of
  source footage to ~29.8s (895 frames @ 30fps).
- **Motion graphics.** A slow continuous Ken Burns push-in over the whole
  video, a quick punch/flash at every jump cut, a top/bottom gradient for
  text legibility, and a bottom progress bar.
- **Hook & CTA text.** `src/components/HookText.tsx` (first 60 frames) and
  `src/components/CTAText.tsx` (last 95 frames) are driven by the
  `hookText` / `ctaText` props on `<Reel>`, currently set to placeholders
  in `src/Composition.tsx` — swap those for real copy before rendering.
- **No spoken captions.** Automatic transcription wasn't available in the
  sandbox this was built in (no network access to Whisper/OpenAI/
  HuggingFace); word-level captions can be added later via
  `@remotion/install-whisper-cpp` (see the `remotion-captions` skill) once
  outside that restriction, or by hand from a transcript.

## Environment note

This repo's `remotion.config.ts` points `Config.setBrowserExecutable()` at
a pre-installed Chromium (`/opt/pw-browsers/...`) because the sandbox this
was built in has no network access to `remotion.media`, where Remotion
would otherwise download its own Chrome Headless Shell. If you're
rendering somewhere with normal network access, that override is
harmless but unnecessary — delete it and Remotion will manage its own
browser binary.

## Commands

<p align="center">
  <a href="https://github.com/remotion-dev/logo">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-dark.apng">
      <img alt="Animated Remotion Logo" src="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-light.gif">
    </picture>
  </a>
</p>

Welcome to your Remotion project!

## Commands

**Install Dependencies**

```console
npm i
```

**Start Preview**

```console
npm run dev
```

**Render video**

```console
npx remotion render
```

**Upgrade Remotion**

```console
npx remotion upgrade
```

## Docs

Get started with Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).

## Help

We provide help on our [Discord server](https://discord.gg/6VzzNDwUwV).

## Issues

Found an issue with Remotion? [File an issue here](https://github.com/remotion-dev/remotion/issues/new).

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
