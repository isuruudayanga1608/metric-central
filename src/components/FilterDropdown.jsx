import { useId } from 'react';
import styles from './FilterDropdown.module.css';

// Accessible native <select> styled to match the dashboard UI. A native
// select gets full keyboard support, screen-reader labeling and mobile
// picker UIs for free, which a custom-built dropdown would have to
// reimplement.
function FilterDropdown({ label, value, placeholder, options, onChange, disabled = false }) {
  const selectId = useId();

  return (
    <div className={styles.field}>
      <label htmlFor={selectId} className={styles.label}>
        {label}
      </label>
      <select
        id={selectId}
        className={styles.select}
        value={value ?? ''}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">{placeholder ?? `Select ${label}`}</option>
        {options.map((option) => (
          <option key={option.value ?? option} value={option.value ?? option}>
            {option.label ?? option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default FilterDropdown;
