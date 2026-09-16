const CROSS_TILE_BACKGROUND_IMAGE = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;

const NOISE_TILE_BACKGROUND_IMAGE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23000' fill-opacity='1' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")`;

/** Fixed, non-interactive SVG tile overlays used on `/` and `/capital`. */
const PatternedBackground = () => {
  return (
    <>
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
        style={{ backgroundImage: CROSS_TILE_BACKGROUND_IMAGE }}
      />
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none opacity-[0.015] dark:opacity-[0.04]"
        style={{ backgroundImage: NOISE_TILE_BACKGROUND_IMAGE }}
      />
    </>
  );
};

export default PatternedBackground;
