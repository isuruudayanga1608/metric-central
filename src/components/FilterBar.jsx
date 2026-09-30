import { activities } from '../config/activities';
import { ENVIRONMENT_TYPES, MONTHS, YEARS } from '../config/filters';
import FilterDropdown from './FilterDropdown';
import styles from './FilterBar.module.css';

const activityOptions = activities
  .slice()
  .sort((a, b) => a.cardOrder - b.cardOrder)
  .map((activity) => ({ value: activity.id, label: activity.displayName }));

function FilterBar({
  activityId,
  year,
  month,
  environment,
  onYearChange,
  onMonthChange,
  onEnvironmentChange,
  onActivityChange,
  onReset,
  onRefresh,
  isRefreshing = false,
}) {
  return (
    <div className={styles.bar}>
      <div className={styles.filters}>
        <FilterDropdown label="Year" value={year} options={YEARS} onChange={onYearChange} />
        <FilterDropdown label="Month" value={month} options={MONTHS} onChange={onMonthChange} />
        <FilterDropdown
          label="Environment Type"
          value={environment}
          options={ENVIRONMENT_TYPES}
          onChange={onEnvironmentChange}
        />
        <FilterDropdown
          label="Activity"
          value={activityId}
          options={activityOptions}
          onChange={onActivityChange}
        />
      </div>
      <div className={styles.actions}>
        <button type="button" className={styles.secondaryButton} onClick={onReset}>
          Reset Filters
        </button>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? 'Refreshing…' : 'Refresh Data'}
        </button>
      </div>
    </div>
  );
}

export default FilterBar;
