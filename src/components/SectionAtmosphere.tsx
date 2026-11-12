/**
 * A short textured interval between the hero and the first body copy.
 * No text sits on it. The wash plays once; reduced motion holds the end frame.
 */
const SectionAtmosphere = () => {
  return (
    <div className="section-atmosphere" aria-hidden="true">
      <div className="section-atmosphere-wash" />
      <div className="section-atmosphere-grid" />
    </div>
  );
};

export default SectionAtmosphere;
