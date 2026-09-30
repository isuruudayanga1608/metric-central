import { Link } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';
import Header from '../components/Header';
import styles from './LandingPage.module.css';

function LandingPage() {
  return (
    <div className={styles.page}>
      <AnimatedBackground />
      <Header showBrandTitle={false} className={styles.header} />

      <main className={styles.hero}>
        <h1 className={styles.title}>Metric Central</h1>
        <p className={styles.subtitle}>
          Central Hub for Monthly Maintenance Metrics and Insights.
        </p>
      </main>

      <div className={styles.cta}>
        <Link to="/activities" className={styles.next}>
          Next
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;
