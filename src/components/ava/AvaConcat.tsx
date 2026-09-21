import { AVA_CONCAT_FILES, AVA_CONCAT_TOTAL_LABEL } from "@/content/ava";
import { useLanguage } from "@/contexts/LanguageContext";

const DragHandle = () => {
  return (
    <span className="ava-concat-handle" aria-hidden="true">
      {Array.from({ length: 6 }, (_, index) => (
        <span key={index} />
      ))}
    </span>
  );
};

const AvaConcatGraphic = () => {
  const { t } = useLanguage();

  return (
    <figure className="ava-concat-panel">
      <div className="ava-concat-chrome">
        <span className="ava-concat-select">{t("ava.concat.select")}</span>
        <span>{t("ava.concat.formats")}</span>
      </div>

      <p className="ava-concat-dialog">{t("ava.concat.arrange")}</p>

      <div className="ava-concat-files">
        {AVA_CONCAT_FILES.map((file, index) => (
          <article className="ava-concat-file" key={file.id}>
            <header className="ava-concat-file-head">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <DragHandle />
            </header>
            <span className="ava-concat-file-name">{file.name}</span>
            <span className="ava-concat-file-rail" />
            <span className="ava-concat-file-time">{file.duration}</span>
          </article>
        ))}
      </div>

      <div className="ava-concat-join" aria-hidden="true">
        <div className="ava-concat-stems">
          {AVA_CONCAT_FILES.map((file) => (
            <span key={file.id} />
          ))}
        </div>
        <p className="ava-concat-progress">{t("ava.concat.progress")}</p>
      </div>

      <div className="ava-concat-match">
        <div className="ava-concat-match-rail">
          <div className="ava-playhead" />
          {AVA_CONCAT_FILES.map((file) => (
            <div
              className="ava-concat-segment"
              key={file.id}
              style={{ flex: file.seconds }}
            >
              <span className="ava-concat-segment-tick" />
              <span className="ava-concat-segment-label">{file.quarter}</span>
            </div>
          ))}
          <span className="ava-concat-segment-tick is-end" />
        </div>
        <div className="ava-concat-match-ends">
          <span>00:00</span>
          <span>{AVA_CONCAT_TOTAL_LABEL}</span>
        </div>
      </div>

      <figcaption className="ava-concat-caption">{t("ava.concat.cta")}</figcaption>
    </figure>
  );
};

export default AvaConcatGraphic;
