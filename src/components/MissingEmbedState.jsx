import styles from './StatePanel.module.css';

function MissingEmbedState({
  message = 'No Excel dashboard view has been configured for the selected filters.',
}) {
  return (
    <div className={styles.panel} aria-live="polite">
      <p className={styles.message}>{message}</p>
      <p className={styles.subMessage}>
        An authorized workbook owner can add this view in src/config/excelEmbeds.js — see
        README.md for the full setup steps.
      </p>
    </div>
  );
}

export default MissingEmbedState;
