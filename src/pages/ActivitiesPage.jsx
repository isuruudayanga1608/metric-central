import AnimatedBackground from '../components/AnimatedBackground';
import Header from '../components/Header';
import ActivityCard from '../components/ActivityCard';
import { activities } from '../config/activities';
import styles from './ActivitiesPage.module.css';

const sortedActivities = activities.slice().sort((a, b) => a.cardOrder - b.cardOrder);

function ActivitiesPage() {
  return (
    <div className={styles.page}>
      <AnimatedBackground />
      <Header />

      <main className={styles.main}>
        <h2 className={styles.heading}>Select an Activity</h2>
        <div className={styles.grid}>
          {sortedActivities.map((activity, index) => (
            <ActivityCard key={activity.id} activity={activity} entranceDelayMs={index * 90} />
          ))}
        </div>
      </main>
    </div>
  );
}

export default ActivitiesPage;
