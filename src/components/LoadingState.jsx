import styles from './StatePanel.module.css';

function LoadingState({ message = 'Loading Excel dashboard…' }) {
  return (
    <div className={styles.panel} role="status" aria-live="polite">
      <span className={styles.spinner} aria-hidden="true" />
      <p className={styles.message}>{message}</p>
    </div>
  );
}

export default LoadingState;
