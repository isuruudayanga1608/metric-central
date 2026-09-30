import styles from './StatePanel.module.css';

function EmptyState({
  message = 'Select the year, month, and environment type to view metrics.',
}) {
  return (
    <div className={styles.panel} aria-live="polite">
      <p className={styles.message}>{message}</p>
    </div>
  );
}

export default EmptyState;
