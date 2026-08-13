// Edit plan derived from silence-detection pass on public/source.mp4
// (talking-head clip, 576x1024 @30fps, 31.37s original).
// Each entry is a segment of the SOURCE video (in source frames) that is kept;
// the gaps between them are the trimmed-out pauses/dead air.
export type SourceSegment = {
  startFrom: number; // frame in the source video
  endAt: number; // frame in the source video (exclusive)
};

export const SOURCE_SEGMENTS: SourceSegment[] = [
  { startFrom: 0, endAt: 91 },
  { startFrom: 96, endAt: 258 },
  { startFrom: 264, endAt: 384 },
  { startFrom: 391, endAt: 415 },
  { startFrom: 420, endAt: 497 },
  { startFrom: 502, endAt: 708 },
  { startFrom: 713, endAt: 791 },
  { startFrom: 796, endAt: 887 },
  { startFrom: 895, endAt: 941 },
];

// Cumulative length of each segment once placed back-to-back on the output
// timeline -- used to drive the <Series> and to know where each cut lands.
export const SEGMENT_LENGTHS = SOURCE_SEGMENTS.map(
  (s) => s.endAt - s.startFrom,
);

export const TOTAL_FRAMES = SEGMENT_LENGTHS.reduce((a, b) => a + b, 0);

// Frame (on the OUTPUT timeline) of every internal cut -- used to place the
// punch/flash transition at each jump cut.
export const CUT_BOUNDARIES: number[] = (() => {
  const boundaries: number[] = [];
  let cursor = 0;
  for (let i = 0; i < SEGMENT_LENGTHS.length - 1; i++) {
    cursor += SEGMENT_LENGTHS[i];
    boundaries.push(cursor);
  }
  return boundaries;
})();

// Source video's native size -- same aspect ratio as the 1080x1920 output
// (576/1024 === 1080/1920), so it only needs a uniform scale-up, no crop.
export const SOURCE_WIDTH = 576;
export const SOURCE_HEIGHT = 1024;

export const COLORS = {
  white: "#ffffff",
  black: "#000000",
  textShadow: "rgba(0, 0, 0, 0.55)",
};

export const FONT_FAMILY =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif';
