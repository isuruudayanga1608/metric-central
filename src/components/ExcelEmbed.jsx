import { useState } from 'react';
import MissingEmbedState from './MissingEmbedState';
import styles from './ExcelEmbed.module.css';

// Responsive, view-only Excel Online embed (Option 1 integration).
//
// This component never parses, fetches or transforms the workbook's data —
// it only renders whatever the approved embedUrl points to inside an
// iframe. Filtering happens either inside the Excel view itself, or by the
// parent swapping embedUrl for a different mapped view (see
// src/services/embedResolver.js).
function ExcelEmbed({
  embedUrl,
  title,
  refreshKey,
  onLoad,
  aspectRatio = '16 / 9',
  minimumHeight = 480,
  safeOpenUrl,
}) {
  if (!embedUrl) {
    return <MissingEmbedState />;
  }

  return (
    <div className={styles.wrapper}>
      <Frame
        // Remounting on embedUrl/refreshKey change is what makes a fresh
        // load start "loading" again, with no effect-driven state reset.
        key={`${embedUrl}::${refreshKey ?? ''}`}
        embedUrl={embedUrl}
        title={title}
        onLoad={onLoad}
        aspectRatio={aspectRatio}
        minimumHeight={minimumHeight}
      />
      {safeOpenUrl && (
        <a
          className={styles.openLink}
          href={safeOpenUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open Excel view in a new tab
        </a>
      )}
    </div>
  );
}

function Frame({ embedUrl, title, onLoad, aspectRatio, minimumHeight }) {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  return (
    <div className={styles.frameContainer} style={{ aspectRatio, minHeight: minimumHeight }}>
      {isLoading && (
        <div className={styles.loadingOverlay} role="status" aria-live="polite">
          <span className={styles.spinner} aria-hidden="true" />
          <p>Loading Excel dashboard…</p>
        </div>
      )}
      <iframe
        className={styles.iframe}
        src={embedUrl}
        title={title || 'Excel dashboard view'}
        loading="lazy"
        onLoad={handleLoad}
        allowFullScreen
      />
    </div>
  );
}

export default ExcelEmbed;
