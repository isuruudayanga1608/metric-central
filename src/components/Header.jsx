import { Link } from 'react-router-dom';
import styles from './Header.module.css';

// Shared top bar used on every page: organization brand box on the left,
// IFS logo on the right. `showBrandTitle` controls whether the bold
// "Metric Central" line is shown above the org subtitle (selection/dashboard
// pages show it, the landing page keeps just the subtitle since the big
// title already appears in the hero). The brand box always links back to
// the landing page, from any page in the app.
function Header({ showBrandTitle = true, className = '' }) {
  return (
    <header className={`${styles.header} ${className}`}>
      <Link to="/" className={styles.brand} aria-label="Go to Metric Central home">
        {showBrandTitle && <p className={styles.title}>Metric Central</p>}
        <p className={styles.subtitle}>
          IFS Product &amp; Technology
          <br />
          Manufacturing &amp; Core - Maintenance &amp; Cloud Services
        </p>
      </Link>
      <img
        className={styles.logo}
        src={`${import.meta.env.BASE_URL}assets/ifs-ai-logo.png`}
        alt="IFS logo"
      />
    </header>
  );
}

export default Header;
