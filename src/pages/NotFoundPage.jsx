import { Link } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';
import Header from '../components/Header';
import styles from './NotFoundPage.module.css';

function NotFoundPage() {
  return (
    <div className={styles.page}>
      <AnimatedBackground />
      <Header />
      <main className={styles.main}>
        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.message}>
          The page you're looking for doesn't exist.
        </p>
        <Link to="/" className={styles.link}>
          Back to Metric Central
        </Link>
      </main>
    </div>
  );
}

export default NotFoundPage;
