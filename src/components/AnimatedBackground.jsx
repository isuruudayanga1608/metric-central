import styles from './AnimatedBackground.module.css';

// Purely decorative blurred, animated blobs used behind every page.
// Marked aria-hidden since it carries no information.
function AnimatedBackground() {
  return (
    <div className={styles.background} aria-hidden="true">
      <span className={`${styles.blob} ${styles.blobYellow}`} />
      <span className={`${styles.blob} ${styles.blobCoral}`} />
      <span className={`${styles.blob} ${styles.blobBlue}`} />
      <span className={`${styles.blob} ${styles.blobViolet}`} />
    </div>
  );
}

export default AnimatedBackground;
