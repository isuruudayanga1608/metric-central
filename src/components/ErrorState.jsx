import { Link } from 'react-router-dom';
import styles from './StatePanel.module.css';

function ErrorState({
  message = 'The Excel dashboard could not be loaded.',
  onRetry,
  showBackLink = true,
}) {
  return (
    <div className={styles.panel} role="alert" aria-live="assertive">
      <p className={styles.message}>{message}</p>
      <div className={styles.actions}>
        {onRetry && (
          <button type="button" className={styles.buttonPrimary} onClick={onRetry}>
            Try Again
          </button>
        )}
        {showBackLink && (
          <Link to="/activities" className={styles.link}>
            Back to Activities
          </Link>
        )}
      </div>
    </div>
  );
}

export default ErrorState;
