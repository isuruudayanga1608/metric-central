import styles from './StatePanel.module.css';

function AccessErrorState({
  message = 'This Excel dashboard could not be displayed. The workbook may require permission or sign-in.',
  onDismiss,
}) {
  return (
    <div className={styles.panel} role="alert" aria-live="assertive">
      <p className={styles.message}>{message}</p>
      <p className={styles.subMessage}>
        Ask the workbook owner to confirm the item is shared for anonymous, view-only access, or
        request access to the workbook. See README.md &gt; "Authentication and access" for
        details.
      </p>
      {onDismiss && (
        <div className={styles.actions}>
          <button type="button" className={styles.button} onClick={onDismiss}>
            Back to dashboard
          </button>
        </div>
      )}
    </div>
  );
}

export default AccessErrorState;
